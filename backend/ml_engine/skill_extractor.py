import re
import pandas as pd
import os

def load_skill_taxonomy():
    """Load skills database from CSV"""
    csv_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'skills_taxonomy.csv')
    try:
        df = pd.read_csv(csv_path)
        return df
    except:
        return pd.DataFrame()

def extract_skills(resume_text):
    """Extract skills from resume using keyword matching"""
    skill_df = load_skill_taxonomy()
    
    if skill_df.empty:
        return []
    
    found_skills = []
    resume_lower = resume_text.lower()
    
    for skill in skill_df['skill'].tolist():
        # Exact word boundary matching
        pattern = rf'\b{re.escape(skill.lower())}\b'
        if re.search(pattern, resume_lower):
            if skill not in found_skills:
                found_skills.append(skill)
    
    return found_skills

def categorize_skills(skills):
    """Categorize skills by type"""
    skill_df = load_skill_taxonomy()
    categorized = {}
    
    for skill in skills:
        skill_row = skill_df[skill_df['skill'].str.lower() == skill.lower()]
        if not skill_row.empty:
            category = skill_row.iloc[0]['category']
            if category not in categorized:
                categorized[category] = []
            categorized[category].append(skill)
    
    return categorized
