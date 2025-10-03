# generate_posts_json.py
import os
import json
import re
from datetime import datetime

# Folder containing your markdown files
MD_FOLDER = "./md"
OUTPUT_JSON = "./posts.json"

def parse_metadata(md_text):
    """
    Extract YAML front-matter metadata from markdown text.
    Returns a dict {title: ..., date: ...}
    """
    meta = {}
    match = re.match(r'^<!--([\s\S]*?)-->', md_text)
    if match:
        lines = match.group(1).strip().split("\n")
        for line in lines:
            if ":" in line:
                key, value = line.split(":", 1)
                meta[key.strip()] = value.strip()
    return meta

def get_creation_date(file_path):
    """
    Get creation date of the file as YYYY-MM-DD string.
    """
    ts = os.path.getctime(file_path)
    return datetime.fromtimestamp(ts).strftime("%Y-%m-%d")

posts = []

for fname in os.listdir(MD_FOLDER):
    if not fname.endswith(".md"):
        continue
    full_path = os.path.join(MD_FOLDER, fname)
    with open(full_path, "r", encoding="utf-8") as f:
        text = f.read()
    meta = parse_metadata(text)
    post_date = meta.get("date") or get_creation_date(full_path)
    post_title = meta.get("title") or os.path.splitext(fname)[0]
    post_tags = meta.get("tags", "[]").strip("[]").replace(" ", "").split(",") if "tags" in meta else []
    # Convert tags string to list if it's in YAML list format
    posts.append({
        "file": f"{MD_FOLDER}/{fname}",
        "title": post_title,
        "date": post_date,
        "tags": post_tags
    })

# Sort posts by date ascending
posts.sort(key=lambda x: x["date"], reverse=False)

with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(posts, f, indent=2, ensure_ascii=False)

print(f"Generated {OUTPUT_JSON} with {len(posts)} posts.")
