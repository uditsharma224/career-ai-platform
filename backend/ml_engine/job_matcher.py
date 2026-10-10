import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def match_jobs(candidate_skills, job_roles_path):
    job_df = pd.read_csv(job_roles_path)
    job_df["combined"] = job_df["required_skills"].fillna("")
    candidate_text = " ".join(candidate_skills)

    docs = [candidate_text] + list(job_df["combined"])
    vectorizer = TfidfVectorizer()
    matrix = vectorizer.fit_transform(docs)

    similarities = cosine_similarity(matrix[0:1], matrix[1:])[0]
    ranked = []

    for idx, score in enumerate(similarities):
        job = job_df.iloc[idx]
        ranked.append({
            "title": job["title"],
            "score": round(float(score) * 100, 2),
            "required_skills": job["required_skills"].split(","),
            "description": job["description"]
        })

    return sorted(ranked, key=lambda x: x["score"], reverse=True)[:5]