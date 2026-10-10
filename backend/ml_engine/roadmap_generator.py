def generate_learning_roadmap(missing_skills, weeks=8):
    """Generate personalized learning roadmap"""
    
    if not missing_skills:
        return []
    
    roadmap = []
    weeks_per_skill = weeks / len(missing_skills) if missing_skills else 0
    
    course_suggestions = {
        'python': {'course': 'Python Basics', 'difficulty': 'Beginner', 'duration': '2 weeks'},
        'javascript': {'course': 'JavaScript ES6+', 'difficulty': 'Beginner', 'duration': '2 weeks'},
        'react': {'course': 'React Complete Guide', 'difficulty': 'Intermediate', 'duration': '3 weeks'},
        'sql': {'course': 'SQL Fundamentals', 'difficulty': 'Beginner', 'duration': '1.5 weeks'},
        'machine learning': {'course': 'ML with Python', 'difficulty': 'Advanced', 'duration': '4 weeks'},
        'data analysis': {'course': 'Data Analysis with Pandas', 'difficulty': 'Intermediate', 'duration': '2 weeks'},
    }
    
    for idx, skill in enumerate(missing_skills[:8], 1):
        skill_lower = skill.lower()
        suggestion = course_suggestions.get(skill_lower, {
            'course': f'{skill} Masterclass',
            'difficulty': 'Intermediate',
            'duration': '2 weeks'
        })
        
        roadmap.append({
            'week': idx,
            'skill': skill,
            'course': suggestion['course'],
            'difficulty': suggestion['difficulty'],
            'duration': suggestion['duration'],
            'tasks': [
                f'Complete online course for {skill}',
                f'Practice 5 exercises on {skill}',
                f'Build a small project using {skill}',
                f'Test your knowledge with quiz'
            ]
        })
    
    return roadmap
