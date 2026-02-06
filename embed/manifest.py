from pathlib import Path
from typing import Dict, List, Tuple
import json

from .config import manifest_name
from .fs import scan_files
from .hashing import hash_file


# MARK: Manifest

def manifest_path(root: Path) -> Path:
    name = Path(manifest_name())
    if name.is_absolute() or name.parent.as_posix() != ".":
        return name
    return root / name


def load_manifest(root: Path) -> Dict[str, str]:
    path = manifest_path(root)
    if not path.exists():
        return {}
    return json.loads(path.read_text())


def save_manifest(root: Path, data: Dict[str, str]) -> None:
    manifest_path(root).write_text(json.dumps(data, indent=2, sort_keys=True))


# MARK: Changed files

def changed_files(dir: Path, manifest_root: Path | None = None) -> Tuple[List[str], List[str]]:
    """Return paths (relative to dir) of files changed and deleted."""
    root = dir.resolve()
    manifest_base = (manifest_root or dir).resolve()
    old_manifest = load_manifest(manifest_base)
    new_manifest: Dict[str, str] = {}
    changed: List[str] = []
    deleted: List[str] = []

    for path in scan_files(root):
        rel = path.relative_to(root).as_posix()
        digest = hash_file(path)
        new_manifest[rel] = digest
        if old_manifest.get(rel) != digest:
            changed.append(rel)

    for rel in old_manifest.keys():
        if rel not in new_manifest:
            deleted.append(rel)

    save_manifest(manifest_base, new_manifest)
    return changed, deleted
