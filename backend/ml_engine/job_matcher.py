import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

def load_job_roles():
    """Load job roles database from CSV"""
    csv_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'job_roles.csv')
    try:
        df = pd.read_csv(csv_path)
        return df
    except:
        return pd.DataFrame()

def match_jobs(candidate_skills):
    """Match candidate to suitable job roles using ML"""
    job_df = load_job_roles()
    
    if job_df.empty or not candidate_skills:
        return []
    
    # Prepare text data
    candidate_text = " ".join(candidate_skills)
    job_texts = job_df['required_skills'].fillna('').tolist()
    
    # Vectorize
    all_texts = [candidate_text] + job_texts
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(all_texts)
    
    # Calculate similarities
    candidate_vector = tfidf_matrix[0:1]
    job_vectors = tfidf_matrix[1:]
    
    similarities = cosine_similarity(candidate_vector, job_vectors)[0]
    
    # Create ranked list
    matches = []
    for idx, score in enumerate(similarities):
        job = job_df.iloc[idx]
        match_score = round(float(score) * 100, 2)
        
        matches.append({
            'title': job['title'],
            'match_score': match_score,
            'required_skills': [s.strip() for s in job['required_skills'].split(',')],
            'description': job['description'],
            'level': job['level']
        })
    
    # Sort by score and return top 5
    matches = sorted(matches, key=lambda x: x['match_score'], reverse=True)
    return matches[:5]
