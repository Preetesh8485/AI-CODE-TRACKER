from pydantic import BaseModel, Field
from typing import List, Optional


class ATSScoreBreakdown(BaseModel):
    skillsMatch: int
    experienceMatch: int
    projectMatch: int
    educationMatch: int
    keywordMatch: int


class ATSReportSchema(BaseModel):
    overallScore: int

    scoreBreakdown: ATSScoreBreakdown

    matchedSkills: List[str] = Field(default_factory=list)

    missingSkills: List[str] = Field(default_factory=list)

    matchedKeywords: List[str] = Field(default_factory=list)

    missingKeywords: List[str] = Field(default_factory=list)

    strengths: List[str] = Field(default_factory=list)

    weaknesses: List[str] = Field(default_factory=list)

    recommendations: List[str] = Field(default_factory=list)

    interviewFocusAreas: List[str] = Field(default_factory=list)