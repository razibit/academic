export interface SkillGroup {
  name: string;
  items: string[];
}

export interface SkillsContent {
  groups: SkillGroup[];
  note?: string;
}

export interface AcademicAbout {
  profile?: {
    research_interests?: string[];
    spotlight?: string[];
  };
  spotlight?: string[];
}
