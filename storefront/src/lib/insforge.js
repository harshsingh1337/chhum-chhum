import { createClient } from '@insforge/sdk';

export const insforge = createClient({
  baseUrl: import.meta.env.VITE_INSFORGE_URL || 'https://ktr733ig.ap-southeast.insforge.app',
  anonKey: import.meta.env.VITE_INSFORGE_ANON_KEY || 'ik_034aa37481b185606213c4ff49112670',
});
