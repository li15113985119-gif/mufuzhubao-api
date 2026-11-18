import type { LearningResourceDefinition } from './resource-types';
import { tutorialResources } from './resources/tutorial';
import { plcResources } from './resources/plc';
import { diagramResources } from './resources/diagram';
import { examResources } from './resources/exam';

export const LEARNING_RESOURCES: LearningResourceDefinition[] = [
  ...tutorialResources,
  ...plcResources,
  ...diagramResources,
  ...examResources,
];

export const LEARNING_RESOURCE_GROUPS = {
  tutorial: '教程',
  plc: '例程',
  diagram: '图纸',
  exam: '题库',
} as const;
