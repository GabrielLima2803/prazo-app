import { DeadlinesScreen } from '@/features/deadlines';
import { GoogleBanner } from '@/features/google';

export default function DeadlinesRoute() {
  return <DeadlinesScreen banner={<GoogleBanner />} />;
}
