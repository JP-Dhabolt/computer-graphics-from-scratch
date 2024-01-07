<script lang="ts">
  interface PageData {
    chapters: string[];
  }

  export let data: PageData;

  type Chapter = {
    relativeUrl: string;
    chapterNumber: string;
    chapterTitle: string;
  };

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  export const fullChapters = data.chapters.map<Chapter>((chapter) => {
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
