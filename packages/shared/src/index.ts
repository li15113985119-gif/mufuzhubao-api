export const BRAND = {
  name: '沐-辅助包',
  fullName: '沐-辅助包——工控软件排错助手',
  subtitle: '工控软件排错助手',
  welcome: '遇到工控报错，先问沐-辅助包',
  shareTitle: '沐-辅助包 | 工控软件排错助手',
  version: '1.0.0',
} as const;

export const API_PREFIX = '/api/v1';

export const USER_ROLES = ['USER'] as const;
export const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];
export type UserRole = (typeof USER_ROLES)[number];
export type CaseStatus = 'DRAFT' | 'PUBLISHED' | 'OFFLINE';
export type IssueStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type ResourceCategory =
  | 'INSTALL_GUIDE'
  | 'PLC_EXAMPLE'
  | 'WIRING_DIAGRAM'
  | 'COMPETITION_QUESTION'
  | 'OPERATION_STANDARD';

export const RESOURCE_CATEGORY_LABELS: Record<ResourceCategory, string> = {
  INSTALL_GUIDE: '安装教程',
  PLC_EXAMPLE: 'PLC例程',
  WIRING_DIAGRAM: '接线图纸',
  COMPETITION_QUESTION: '竞赛题库',
  OPERATION_STANDARD: '操作规范',
};

export const ISSUE_STATUS_LABELS: Record<IssueStatus, string> = {
  PENDING: '待处理',
  IN_PROGRESS: '处理中',
  RESOLVED: '已解决',
  CLOSED: '已关闭',
};

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  DRAFT: '草稿',
  PUBLISHED: '已发布',
  OFFLINE: '已下线',
};

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Software {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  sortOrder: number;
  status: string;
}

export interface FaultType {
  id: string;
  name: string;
  description?: string | null;
  sortOrder: number;
  status: string;
}

export interface FaultCase {
  id: string;
  title: string;
  softwareId: string;
  software?: Software;
  softwareVersion: string;
  faultTypeId: string;
  faultType?: FaultType;
  errorCode?: string | null;
  symptom: string;
  possibleCauses: string[];
  solutionSteps: string[];
  systemEnvironment?: string | null;
  tags: string[];
  screenshotUrls: string[];
  status: CaseStatus;
  viewCount: number;
  favoriteCount: number;
  solvedCount: number;
  unsolvedCount: number;
  isFavorite?: boolean;
  sourceName?: string | null;
  sourceUrl?: string | null;
  verificationStatus?: 'DEMO' | 'PENDING_REVIEW' | 'VERIFIED';
  verifiedAt?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  demoNotice?: string;
}

export interface Issue {
  id: string;
  name: string;
  className: string;
  contact: string;
  softwareId: string;
  software?: Software;
  softwareVersion: string;
  faultTypeId: string;
  faultType?: FaultType;
  symptom?: string | null;
  errorCode?: string | null;
  description: string;
  screenshotUrls: string[];
  status: IssueStatus;
  adminReply?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  category: ResourceCategory;
  group?: string | null;
  tag?: string | null;
  softwareId?: string | null;
  software?: Software | null;
  softwareVersion?: string | null;
  description?: string | null;
  estimatedTime?: number | null;
  content?: import('./resource-types').ResourceChapter[] | null;
  sortOrder?: number;
  fileUrl?: string | null;
  externalUrl?: string | null;
  fileType?: string | null;
  fileSize?: number | null;
  downloadCount: number;
  source?: string | null;
  status: string;
  createdAt: string;
}

export interface PublicStats {
  caseCount: number;
  userCount: number;
  usageCount: number;
  issueCount: number;
  resourceCount: number;
  demoDataCount: number;
}

export interface DashboardStats {
  totalCases: number;
  publishedCases: number;
  pendingIssues: number;
  resolvedIssues: number;
  favoriteCount: number;
  caseViews: number;
  resourceDownloads: number;
  issueTrend: Array<{ date: string; count: number }>;
  viewTrend: Array<{ date: string; count: number }>;
  hotSoftware: Array<{ name: string; count: number }>;
  hotFaultTypes: Array<{ name: string; count: number }>;
}
export * from './learning-resources';
export * from './resource-types';



