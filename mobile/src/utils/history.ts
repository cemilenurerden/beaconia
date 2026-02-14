import type { Decision, Section } from '../types';

export function groupByDate(decisions: Decision[]): Section[] {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  const todayStr = formatDate(today);
  const yesterdayStr = formatDate(yesterday);

  const groups: Record<string, Decision[]> = {};

  for (const decision of decisions) {
    const dateStr = formatDate(new Date(decision.createdAt));
    let label: string;

    if (dateStr === todayStr) label = 'BUGÜN';
    else if (dateStr === yesterdayStr) label = 'DÜN';
    else label = new Date(decision.createdAt).toLocaleDateString('tr-TR', {
      day: 'numeric', month: 'long',
    }).toUpperCase();

    if (!groups[label]) groups[label] = [];
    groups[label].push(decision);
  }

  return Object.entries(groups).map(([title, data]) => ({ title, data }));
}
