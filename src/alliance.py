"""
OPC Alliance — 一人公司联盟成员管理

用户视角：加入联盟→展示项目→互相推荐→共同成长
"""
from dataclasses import dataclass, asdict
from typing import List, Dict

@dataclass
class Member:
    name: str
    company: str
    url: str
    revenue: str
    skills: List[str]
    status: str = "active"

class AllianceHub:
    def __init__(self):
        self.members: Dict[str, Member] = {}
    
    def add_member(self, member: Member) -> str:
        self.members[member.company] = member
        return f"✅ {member.name} 已加入联盟"
    
    def find_collaborators(self, skill: str) -> List[Member]:
        return [m for m in self.members.values() if skill.lower() in [s.lower() for s in m.skills]]
    
    def get_stats(self) -> Dict:
        return {
            "total_members": len(self.members),
            "active": sum(1 for m in self.members.values() if m.status == "active"),
        }
