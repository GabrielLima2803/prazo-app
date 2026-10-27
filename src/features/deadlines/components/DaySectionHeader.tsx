import { SectionTitle } from '@/shared/components';

import type { DaySection } from '../types';

export function DaySectionHeader({ section }: { section: DaySection }) {
  return <SectionTitle title={section.title} trailing={section.data.length} />;
}
