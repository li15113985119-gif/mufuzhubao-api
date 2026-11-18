export type LearningResourceGroup = 'tutorial' | 'plc' | 'diagram' | 'exam';
export type LearningResourceCategory =
  | 'INSTALL_GUIDE'
  | 'PLC_EXAMPLE'
  | 'WIRING_DIAGRAM'
  | 'COMPETITION_QUESTION';

export type ResourceContentItemType = 'p' | 'steps' | 'code' | 'note';

export interface ResourceContentItem {
  type: ResourceContentItemType;
  text: string;
  lines?: string[];
}

export interface ResourceChapter {
  title: string;
  items: ResourceContentItem[];
}

export interface LearningResourceDefinition {
  id: string;
  group: LearningResourceGroup;
  category: LearningResourceCategory;
  name: string;
  tag: string;
  desc: string;
  softwareName?: string;
  softwareVersion?: string;
  estimatedTime: number;
  chapters: ResourceChapter[];
}
