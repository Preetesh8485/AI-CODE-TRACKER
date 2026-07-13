from pathlib import Path
BASE_DIR=Path(__file__).resolve().parent.parent

def load_prompt(filename:str):
    path=BASE_DIR/"prompts"/filename
    with open(path,"r",encoding="utf-8")as f:
        return f.read()