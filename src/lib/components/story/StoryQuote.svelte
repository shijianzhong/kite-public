<script lang="ts">
import CitationText from './CitationText.svelte';
import { replaceWithNumberedCitations, type CitationMapping } from '$lib/utils/citationContext';
import type { Article } from '$lib/types';

// Props
interface Props {
	quote: string;
	author?: string;
	attribution?: string;
	sourceUrl?: string;
	sourceDomain?: string;
	articles?: Article[];
	citationMapping?: CitationMapping;
}

let { quote, author, attribution, sourceUrl, sourceDomain, articles = [], citationMapping }: Props = $props();

// Convert citations to numbered format if mapping is available
const displayQuote = $derived.by(() => {
	if (!citationMapping) return quote;
	return replaceWithNumberedCitations(quote, citationMapping);
});
</script>

<section class="my-8 rounded-lg bg-[#F3F6FE] p-4 dark:bg-gray-700">
	<blockquote class="text-lg text-black dark:text-white">
		<CitationText text={displayQuote} showFavicons={true} showNumbers={false} {articles} {citationMapping} />
	</blockquote>
	{#if author || attribution}
		<p class="mt-2 text-left text-gray-700 dark:text-gray-300">
			{#if sourceUrl}
				<a
					href={sourceUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="text-[#183FDC] hover:underline dark:text-[#5B89FF]"
				>
					{author}{attribution ? ` in the ${attribution}` : ''}{sourceDomain && !attribution ? ` (via ${sourceDomain})` : ''}
				</a>
			{:else}
				<span>{author}{attribution ? ` in the ${attribution}` : ''}</span>
			{/if}
		</p>
	{/if}
</section> 