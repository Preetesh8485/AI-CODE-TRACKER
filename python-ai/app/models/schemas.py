from typing import List, Optional

from pydantic import BaseModel, Field


class PersonalInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None


class Skills(BaseModel):
    languages: List[str] = Field(default_factory=list)
    frontend: List[str] = Field(default_factory=list)
    backend: List[str] = Field(default_factory=list)
    databases: List[str] = Field(default_factory=list)
    cloud: List[str] = Field(default_factory=list)
    tools: List[str] = Field(default_factory=list)
    concepts: List[str] = Field(default_factory=list)


class Experience(BaseModel):
    role: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    dates: Optional[str] = None

    techStack: List[str] = Field(default_factory=list)
    description: List[str] = Field(default_factory=list)


class Project(BaseModel):
    title: Optional[str] = None

    technologies: List[str] = Field(default_factory=list)
    description: List[str] = Field(default_factory=list)


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

    experience: List[Experience] = Field(default_factory=list)
    projects: List[Project] = Field(default_factory=list)
    education: List[Education] = Field(default_factory=list)
    certifications: List[Certification] = Field(default_factory=list)

    achievements: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)