<script lang="ts">
import CitationText from './CitationText.svelte';
import { replaceWithNumberedCitations, type CitationMapping } from '$lib/utils/citationContext';
import type { Article } from '$lib/types';

// Props
interface Props {
	title: string;
	content: string;
	articles?: Article[];
	citationMapping?: CitationMapping;
}

let { title, content, articles = [], citationMapping }: Props = $props();

// Convert citations to numbered format if mapping is available
const displayContent = $derived.by(() => {
	if (!citationMapping) return content;
	return replaceWithNumberedCitations(content, citationMapping);
});
</script>

<section class="mt-6">
	<h3 class="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
		{title}
	</h3>
	<div class="mb-4 text-gray-700 dark:text-gray-300">
		<CitationText text={displayContent} showFavicons={true} showNumbers={false} {articles} {citationMapping} />
	</div>
</section> 