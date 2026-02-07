from pathlib import Path
import json

from .config import article_dir, adjacency_store, digest_params, content_root
from .manifest import changed_files
from .embeddings import embed_file
from .hashing import hash_file
from .features import load_features, update, remove
from .links import count_markdown_links
from .adjacency import build_adjacency_with_links


# MARK: Main pipeline

def main() -> None:
    articles_root = article_dir()
    changed, deleted = changed_files(articles_root, content_root())

    if len(changed) == 0 and len(deleted) == 0:
        print("🔍 buildgraph: no changes detected, skipping.")
        return

    print(f"🧹 buildgraph: removed files: {len(deleted)}")
    for rel_file in deleted:
        remove(rel_file)

    print(f"🧠 buildgraph: embedding updated files: {len(changed)}")
    for rel_file in changed:
        full_path = articles_root / rel_file
        embedding = embed_file(full_path)
        digest = hash_file(full_path)
        update(rel_file, embedding, digest)

    print("🔗 buildgraph: rebuilding adjacency")
    features = load_features()
    all_files = list(features.keys())
    link_counts = count_markdown_links(articles_root, all_files)

    params = digest_params()  # read top_k, alpha, threshold from config
    print(f"⚙️ buildgraph: params top_k={params['top_k']} alpha={params['alpha']}")

    adjacency = build_adjacency_with_links(
        features,
        link_counts,
        top_k=params["top_k"],
        alpha=params["alpha"],
    )

    prefix_path: Path | None = None
    try:
        rel = articles_root.resolve().relative_to(content_root().resolve())
        if rel.parts:
            prefix_path = rel
    except ValueError:
        prefix_path = None

    if prefix_path:
        prefixed = {}
        for f, data in adjacency.items():
            neighbors = []
            for n in data["neighbors"]:
                n2 = dict(n)
                n_path = prefix_path / n2["file"]
                n2["file"] = "/" + n_path.with_suffix("").as_posix()
                neighbors.append(n2)
            f_path = prefix_path / f
            prefixed["/" + f_path.with_suffix("").as_posix()] = {
                "neighbors": neighbors,
                "links_to_me": data["links_to_me"],
            }
        adjacency = prefixed

    Path(adjacency_store()).write_text(json.dumps(adjacency, indent=2))
    print(f"✅ buildgraph: wrote adjacency to {adjacency_store()}")
