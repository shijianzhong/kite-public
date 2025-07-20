<script lang="ts">
import { getImageSrc, isImageCached, onCacheUpdate, getProxiedImageUrl } from '$lib/utils/imagePreloader';
import { onMount } from 'svelte';

// Props
interface Props {
	article: any;
	imagesPreloaded?: boolean;
}

let { article, imagesPreloaded = false }: Props = $props();

// State for image loading
let imageLoaded = $state(false);
let imageError = $state(false);
let currentImageSrc = $state('');
let cacheVersion = $state(0); // Force reactivity

// Get the image source reactively
const imageSrc = $derived(() => {
	cacheVersion; // Subscribe to cache changes
	return getImageSrc(article.image);
});

// Update currentImageSrc when imageSrc changes
$effect(() => {
	const newSrc = imageSrc();
	if (newSrc !== currentImageSrc) {
		currentImageSrc = newSrc;
		imageLoaded = false;
		imageError = false;
	}
});

// Determine loading strategy
const shouldLoadEagerly = $derived(
	imagesPreloaded || (article.image && isImageCached(article.image))
);

// Handle image load
function handleImageLoad() {
	imageLoaded = true;
	imageError = false;
}

// Handle image error
function handleImageError() {
	imageError = true;
	imageLoaded = false;
	
	// If we're using a cached version and it failed, try the proxied URL
	if (currentImageSrc.startsWith('data:')) {
		const proxiedUrl = getProxiedImageUrl(article.image);
		console.warn('Cached image failed, falling back to proxied URL:', proxiedUrl);
		currentImageSrc = proxiedUrl;
		imageError = false; // Reset error state to try loading again
	} else {
		console.error('Image failed to load even with proxy:', currentImageSrc);
	}
}

// Subscribe to cache updates
onMount(() => {
	if (!article.image) return;
	
	// Subscribe to cache updates
	const unsubscribe = onCacheUpdate(() => {
		cacheVersion++; // Trigger reactivity
	});
	
	return unsubscribe;
});
</script>

<section class="mt-6">
	<figure>
		<div class="relative">
			<div class="relative mx-auto w-[calc(100%-1rem)] max-w-[800px]">
				<a href={article.link} target="_blank" class="relative block">
					<img
						src={currentImageSrc || getProxiedImageUrl(article.image)}
						alt={article.image_caption || 'Story image'}
						class="h-auto w-full rounded-lg shadow-md"
						class:opacity-50={!imageLoaded && !imageError}
						loading={shouldLoadEagerly ? 'eager' : 'lazy'}
						decoding={shouldLoadEagerly ? 'sync' : 'async'}
						onload={handleImageLoad}
						onerror={handleImageError}
					/>
					
					<!-- Loading indicator -->
					{#if !imageLoaded && !imageError}
						<div class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
							<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
						</div>
					{/if}
					
					<!-- Error indicator -->
					{#if imageError}
						<div class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
							<div class="text-center text-gray-500 dark:text-gray-400">
								<svg class="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								<p class="text-sm">Image unavailable</p>
							</div>
						</div>
					{/if}
					
					<!-- <div class="bg-opacity-50 hover:bg-opacity-75 absolute right-2 bottom-2 rounded bg-black px-2 py-1 text-sm text-white">
						{article.domain}
					</div> -->
				</a>
				<!-- {#if article.image_caption}
					<p class="mt-2 text-sm text-gray-600 italic dark:text-gray-400">
						{article.image_caption}
					</p>
				{/if} -->
			</div>
		</div>
	</figure>
</section> 