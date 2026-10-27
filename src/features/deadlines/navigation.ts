import type { Href } from 'expo-router';

export const deadlineHref = (id: string): Href => ({ pathname: '/deadline/[id]', params: { id } });
