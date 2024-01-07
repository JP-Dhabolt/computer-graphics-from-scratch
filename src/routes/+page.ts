import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const getChapters = async () => {
    const response = await fetch('/chapters/api');

    if (!response.ok) {
      throw new Error('Could not load chapters');
    }
    return (await response.json()) as string[];
  };
  return {
    chapters: await getChapters(),
  };
};
