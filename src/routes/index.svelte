<script lang="typescript" context="module">
  import type { LoadOutput, LoadInput } from '@sveltejs/kit';

  export async function load({ fetch }: LoadInput): Promise<LoadOutput> {
    const response = await fetch('/chapters/api');

    if (response.ok) {
      const chapters = (await response.json()) as string[];
      return {
        props: {
          chapters,
        },
      };
    }

    return {
      status: response.status,
      error: new Error('Could not load chapters'),
    };
  }
</script>

<script lang="typescript">
  export let chapters: string[] = [];

  type Chapter = {
    relativeUrl: string;
    chapterNumber: string;
    chapterTitle: string;
  };

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const fullChapters = chapters.map<Chapter>((chapter) => {
    const chapterSplit = chapter.split(/-(.+)/);
    const chapterNumber = chapterSplit.length >= 2 ? chapterSplit[0] : 'XX';
    const rawTitle = chapterSplit.length >= 2 ? chapterSplit[1] : chapterSplit[0];
    const rawTitleSplit = rawTitle.split('-');
    const capTitleSplit = rawTitleSplit.map(capitalizeFirstLetter);

    return {
      relativeUrl: chapter,
      chapterNumber,
      chapterTitle: capTitleSplit.join(' '),
    };
  });
</script>

<h1>Welcome to Computer Graphics From Scratch</h1>
<p>
  The rendering from the below chapters will change over time, as the renderer is updated over time, and I am not
  versioning the renderer implementations to keep them static as they were per chapter. Individual scenes are defined as
  per the book's scenes.
</p>
<div>
  {#each fullChapters as { relativeUrl, chapterNumber, chapterTitle }}
    <p><a href={`chapters/${relativeUrl}`}>{`Chapter ${chapterNumber}`}</a>{`: ${chapterTitle}`}</p>
  {/each}
</div>
