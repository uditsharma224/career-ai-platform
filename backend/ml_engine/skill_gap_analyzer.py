def analyze_skill_gap(candidate_skills, target_skills):
    candidate_set = set(skill.lower() for skill in candidate_skills)
    target_set = set(skill.lower() for skill in target_skills)

    matched = sorted(candidate_set & target_set)
    missing = sorted(target_set - candidate_set)
    extra = sorted(candidate_set - target_set)

    score = round((len(matched) / len(target_set)) * 100, 2) if target_set else 0

    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "extra_skills": extra,
        "readiness_score": score
    }