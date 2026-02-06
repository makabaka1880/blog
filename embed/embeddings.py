from pathlib import Path
import os
from numpy.typing import NDArray
from huggingface_hub import InferenceClient


# MARK: Embedding

def embed_file(path: Path) -> NDArray:
    client = InferenceClient(
        provider="hf-inference",
        api_key=os.environ["HF_TOKEN"],
    )
    with path.open("r") as f:
        text = f.read()
    return client.feature_extraction(text, model="BAAI/bge-small-en-v1.5")
