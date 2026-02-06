from typing import Dict
import numpy as np


def build_adjacency_with_links(
    features: dict,
    link_counts: dict,
    top_k: int = 5,
    alpha: float = 0.3,
    threshold: float = 0.5,
) -> Dict:
    files = list(features.keys())
    emb_matrix = np.stack([features[f]["embedding"] for f in files])
    normed = emb_matrix / np.linalg.norm(emb_matrix, axis=1, keepdims=True)
    sim_matrix = normed @ normed.T
    np.fill_diagonal(sim_matrix, -np.inf)

    max_links = max(link_counts.values() or [1])
    norm_links = np.zeros(len(files))
    if max_links != 0:
        norm_links = np.array([link_counts.get(f, 0) / max_links for f in files])

    adj = {}
    for i, f in enumerate(files):
        neighbors = []
        for j, g in enumerate(files):
            if i == j:
                continue
            cosSim = float(sim_matrix[i, j])
            linkScore = float(norm_links[j])
            if linkScore > 0 or cosSim > threshold:
                weight = alpha * cosSim + (1 - alpha) * linkScore
                neighbors.append(
                    {
                        "file": g,
                        "weight": weight,
                        "cosine_similarity": cosSim,
                        "link_score": linkScore,
                    }
                )
        neighbors.sort(key=lambda x: -x["weight"])
        adj[f] = {
            "neighbors": neighbors[:top_k],
            "links_to_me": link_counts.get(f, 0),
        }
    return adj
