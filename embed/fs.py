from pathlib import Path
from typing import List


# MARK: FS

def scan_files(root: Path) -> List[Path]:
    """Recursively scan all files under root. Deterministic order."""
    return sorted(
        (p for p in root.rglob("*") if p.is_file()),
        key=lambda p: p.relative_to(root).as_posix(),
    )
