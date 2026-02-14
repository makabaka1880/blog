import os
from huggingface_hub import snapshot_download

# 1. Point to the mirror
os.environ["HF_ENDPOINT"] = "https://hf-mirror.com"

def download_depth_model(repo_id, local_dir):
    print(f"🚀 Starting download from {os.environ['HF_ENDPOINT']}...")
    try:
        snapshot_download(
            repo_id=repo_id,
            local_dir=local_dir,
            # We only need the ONNX weights and config for Transformers.js
            local_dir_use_symlinks=False
        )
        print(f"✅ Model successfully downloaded to: {local_dir}")
    except Exception as e:
        print(f"❌ Error downloading model: {e}")

if __name__ == "__main__":
    MODEL_ID = "Qwen/Qwen3-VL-Embedding-2B"
    SAVE_PATH = "./models/embed-model"
    
    download_depth_model(MODEL_ID, SAVE_PATH)