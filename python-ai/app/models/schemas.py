from pydantic import BaseModel
from typing import List, Optional


class PersonalInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None


class Skills(BaseModel):
    languages: List[str] = []
    frontend: List[str] = []
    backend: List[str] = []
    databases: List[str] = []
    cloud: List[str] = []
    tools: List[str] = []
    concepts: List[str] = []

class Experience(BaseModel):
    role: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    dates: Optional[str] = None

    techStack: List[str] = []

    description: List[str] = []
class Project(BaseModel):
    title: Optional[str] = None

    technologies: List[str] = []

    description: List[str] = []
class Education(BaseModel):
    institution: Optional[str] = None

    degree: Optional[str] = None

    dates: Optional[str] = None

    gpa: Optional[str] = None

class Certification(BaseModel):
    name: Optional[str] = None

    issuer: Optional[str] = None

    year: Optional[str] = None

class ResumeSchema(BaseModel):

    personalInfo: PersonalInfo

    summary: Optional[str] = None

    skills: Skills

    experience: List[Experience] = []

    projects: List[Project] = []

    education: List[Education] = []

    certifications: List[Certification] = []

    achievements: List[str] = []

    interests: List[str] = []