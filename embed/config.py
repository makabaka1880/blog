from pathlib import Path
import tomllib


# MARK: Config

def load_config() -> dict:
    config_path = Path("scripts.config.toml")
    if not config_path.exists():
        raise FileNotFoundError("scripts.config.toml not found")
    with config_path.open("rb") as f:
        return tomllib.load(f)


def content_root() -> Path:
    cfg = load_config()
    try:
        return Path(cfg["digest"]["content_dir"])
    except KeyError as e:
        raise KeyError("Missing [digest].content_dir in scripts.config.toml") from e


def article_dir() -> Path:
    cfg = load_config()
    root = content_root()
    sub = cfg.get("digest", {}).get("article_dir", "")
    if sub:
        return root / sub
    return root


def manifest_name() -> str:
    cfg = load_config()
    try:
        return cfg["digest"]["manifest_name"]
    except KeyError as e:
        raise KeyError("Missing [digest].manifest_name in scripts.config.toml") from e


def adjacency_store() -> str:
    cfg = load_config()
    try:
        return cfg["digest"]["adjacency_store"]
    except KeyError as e:
        raise KeyError("Missing [digest].adjacency_store in scripts.config.toml") from e


def feature_store() -> Path:
    cfg = load_config()
    return Path(cfg.get("digest", {}).get("feature_store", "features.json"))


# MARK: Config parameters

def digest_params() -> dict:
    """Return top_k and alpha from config, with defaults."""
    cfg = load_config()
    digest_cfg = cfg.get("digest", {})
    return {
        "top_k": digest_cfg.get("top_k", 5),
        "alpha": digest_cfg.get("alpha", 0.3),
        "threshold": digest_cfg.get("threshold", 0.5),
    }
