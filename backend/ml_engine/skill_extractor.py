import pandas as pd
import re

def load_skill_taxonomy(path):
    return pd.read_csv(path)

def extract_skills(resume_text, skill_taxonomy_path):
    skills_df = load_skill_taxonomy(skill_taxonomy_path)
    skill_names = skills_df["skill"].tolist()
    found = []

    for skill in skill_names:
        if re.search(rf"\b{re.escape(skill.lower())}\b", resume_text.lower()):
            found.append(skill)

    return found