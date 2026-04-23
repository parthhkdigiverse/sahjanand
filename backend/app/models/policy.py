from pydantic import BaseModel, Field
from typing import List, Optional

class PolicySection(BaseModel):
    heading: str
    body: List[str]

class PolicyBase(BaseModel):
    slug: str
    title: str
    intro: str
    sections: List[PolicySection]

class Policy(PolicyBase):
    pass
