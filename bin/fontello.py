#!/usr/bin/python

import os
from pathlib import Path
from argparse import ArgumentParser
import webbrowser
import shutil
import sys
import zipfile
import requests

project_dir = Path(os.path.dirname(os.path.realpath(__file__))).parent
tmp_dir = project_dir / "tmp"


fontello_host = "https://fontello.com"


config_file = "fontello.config.json"
id_file = project_dir / ".fontello"
css_file = project_dir / "fontello.css"
font_dir = project_dir / "fontello-dist"
css_replace_str = "./fontello-dist"

fontello_id = None


def open_browser():
    files = {"config": open(project_dir / config_file, "rb")}
    response = requests.post(fontello_host, files=files, timeout=60)

    fontello_id = response.text

    with open(id_file, "w", encoding="utf8") as f:
        f.write(fontello_id)

    webbrowser.open(f"{fontello_host}/{fontello_id}")


def save_font():
    zip_file = tmp_dir / "fontello.zip"
    zip_extraction_dir = tmp_dir / "fontello-extraction"
    tmp_project_dir = tmp_dir / "fontello"

    if not (id_file).exists():
        print("run fontello.py open before")
        sys.exit(1)

    # Purge temp dirs
    if tmp_dir.exists():
        shutil.rmtree(tmp_dir)
    tmp_dir.mkdir(parents=True)

    if font_dir.exists():
        shutil.rmtree(font_dir)

    # Download File
    with open(id_file, "r", encoding="utf8") as f:
        fontello_id = f.read()

    response = requests.get(
        f"{fontello_host}/{fontello_id}/get", stream=True, timeout=60
    )

    with open(zip_file, "wb") as f:
        for chunk in response.iter_content(chunk_size=128):
            f.write(chunk)

    # Extract File
    with zipfile.ZipFile(zip_file, "r") as zip_ref:
        # one directory extracted
        # extra/fontello/tmp/fontello-extraction/fontello-[hash]/
        zip_ref.extractall(zip_extraction_dir)

    for directory in zip_extraction_dir.iterdir():
        # move this directory into
        # extra/fontello/tmp/fontello/
        directory.rename(tmp_project_dir)
        break

    # Copy files
    shutil.copyfile(tmp_project_dir / "config.json", project_dir / config_file)
    shutil.copytree(tmp_project_dir / "font", font_dir, dirs_exist_ok=True)

    with open(tmp_project_dir / "css/fontello.css", "r", encoding="utf8") as file:
        css_file_content = file.read()

    css_file_content = css_file_content.replace("../font", css_replace_str)

    with open(css_file, "w", encoding="utf8") as file:
        file.write(css_file_content)

    # cleanup
    shutil.rmtree(tmp_dir)


if __name__ == "__main__":
    parser = ArgumentParser()
    parser.add_argument("action", choices=["open", "save"], help="action to do")
    args = parser.parse_args()

    if args.action == "open":
        open_browser()
    else:
        save_font()
