import json
from pathlib import Path
from typing import Dict, Optional

import faiss
import numpy as np
from numpy.typing import NDArray

from .config import feature_store


# MARK: Feature store (FAISS + sidecar metadata)

def _feature_paths() -> tuple[Path, Path]:
    base = feature_store()
    if base.suffix == ".faiss":
        faiss_path = base
        meta_path = base.with_suffix(".meta.json")
    else:
        faiss_path = base.with_suffix(".faiss")
        meta_path = base.with_suffix(".meta.json")
    return faiss_path, meta_path


def _load_meta() -> dict:
    _, meta_path = _feature_paths()
    if not meta_path.exists():
        return {"next_id": 0, "by_filename": {}, "by_id": {}}
    return json.loads(meta_path.read_text())


def _save_meta(meta: dict) -> None:
    _, meta_path = _feature_paths()
    meta_path.write_text(json.dumps(meta, indent=2, sort_keys=True))


def _load_index() -> Optional[faiss.Index]:
    faiss_path, _ = _feature_paths()
    if faiss_path.exists():
        return faiss.read_index(str(faiss_path))
    return None


def _new_index(dim: int) -> faiss.Index:
    base = faiss.IndexFlatIP(dim)
    return faiss.IndexIDMap2(base)


def _save_index(index: faiss.Index) -> None:
    faiss_path, _ = _feature_paths()
    faiss.write_index(index, str(faiss_path))


def load_features() -> Dict[str, dict]:
    index = _load_index()
    meta = _load_meta()
    if index is None or len(meta.get("by_filename", {})) == 0:
        return {}

    features: Dict[str, dict] = {}
    for filename, info in meta["by_filename"].items():
        idx = int(info["id"])
        embedding = index.reconstruct(idx)
        features[filename] = {"embedding": embedding.tolist(), "digest": info["digest"]}
    return features


def update(filename: str, embedding: NDArray, digest: str) -> None:
    meta = _load_meta()
    index = _load_index()

    vec = np.asarray(embedding, dtype="float32")
    if index is None:
        index = _new_index(vec.shape[0])

    if filename in meta["by_filename"]:
        idx = int(meta["by_filename"][filename]["id"])
        index.remove_ids(np.array([idx], dtype="int64"))
    else:
        idx = int(meta["next_id"])
        meta["next_id"] = idx + 1
        meta["by_id"][str(idx)] = filename

    index.add_with_ids(vec.reshape(1, -1), np.array([idx], dtype="int64"))
    meta["by_filename"][filename] = {"id": idx, "digest": digest}

    _save_index(index)
    _save_meta(meta)


def remove(filename: str) -> None:
    meta = _load_meta()
    index = _load_index()
    if filename not in meta.get("by_filename", {}):
        return

    idx = int(meta["by_filename"][filename]["id"])
    if index is not None:
        index.remove_ids(np.array([idx], dtype="int64"))
        _save_index(index)

    meta["by_filename"].pop(filename, None)
    meta["by_id"].pop(str(idx), None)
    _save_meta(meta)
