from pathlib import Path
from typing import Dict, List
import re
from collections import defaultdict


LINK_RE = re.compile(r"\[.*?\]\((.*?)\)")


def count_markdown_links(dir: Path, files: List[str]) -> Dict[str, int]:
    """Count how many times each article is linked by other articles via Markdown links."""
    counts = defaultdict(int)
    contents = {f: (dir / f).read_text() for f in files}

    for target in files:
        for f, text in contents.items():
            if f == target:
                continue
            links = LINK_RE.findall(text)
            counts[target] += sum(
                1 for link in links if Path(link).as_posix() == target
            )
    return counts
