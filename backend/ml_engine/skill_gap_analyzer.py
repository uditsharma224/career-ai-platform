def analyze_skill_gap(candidate_skills, target_job_skills):
    """Analyze gaps between candidate and target role"""
    
    candidate_set = set(skill.lower() for skill in candidate_skills)
    target_set = set(skill.lower() for skill in target_job_skills)
    
    # Calculate gaps
    matched_skills = sorted(candidate_set & target_set)
    missing_skills = sorted(target_set - candidate_set)
    extra_skills = sorted(candidate_set - target_set)
    
    # Calculate readiness score
    if len(target_set) > 0:
        readiness = round((len(matched_skills) / len(target_set)) * 100, 2)
        gap_percentage = round(100 - readiness, 2)
    else:
        readiness = 0
        gap_percentage = 100
    
    return {
        'matched_skills': list(matched_skills),
        'missing_skills': list(missing_skills),
        'extra_skills': list(extra_skills),
        'readiness_score': readiness,
        'gap_percentage': gap_percentage
    }
