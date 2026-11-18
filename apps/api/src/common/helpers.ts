export function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}
export function normalizePagination(page?: number, pageSize?: number) {
  return { page: Math.max(1, Number(page) || 1), pageSize: Math.min(100, Math.max(1, Number(pageSize) || 10)) };
}
export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function buildSearchText(input: { title: string; symptom: string; errorCode?: string | null; tags: string[]; softwareName: string; faultTypeName: string; }) {
  return [input.title, input.symptom, input.errorCode || '', ...input.tags, input.softwareName, input.faultTypeName].join(' ').toLocaleLowerCase();
}