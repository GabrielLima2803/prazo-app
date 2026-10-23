import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import type { DeadlineType } from '@/api/types';

type IconName = ComponentProps<typeof Ionicons>['name'];

export const typeIcon: Record<DeadlineType, IconName> = {
  assign: 'cloud-upload-outline',
  exam: 'school-outline',
  quiz: 'help-circle-outline',
  forum: 'chatbubbles-outline',
  course_event: 'calendar-outline',
  other: 'flag-outline',
};
