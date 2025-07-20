import type { Article } from '$lib/types';
import type { CitationMapping } from './citationContext';

export interface CitationItem {
	article: Article | null;
	number: number;
	isCommon?: boolean;
}

export interface AggregatedCitations {
	citedArticles: Article[];
	citedNumbers: number[];
	citedItems: CitationItem[];
	hasCommonKnowledge: boolean;
}

/**
 * Citation pattern regex for parsing [number] and [*] citations
 */
export const CITATION_PATTERN = /\[(\d+|\*)\]/g;

/**
 * Parses citations from a single text string and returns citation info
 */
export function parseCitationsFromText(
	text: string,
	citationMapping?: CitationMapping,
	articles: Article[] = []
): CitationItem[] {
	const citationItems: CitationItem[] = [];
	const citationPattern = new RegExp(CITATION_PATTERN.source, 'g'); // Create new instance to avoid shared state
	let match;

	while ((match = citationPattern.exec(text)) !== null) {
		const citationText = match[1];

		if (citationText === '*') {
			// Common knowledge citation
			citationItems.push({
				article: null,
				number: -1,
				isCommon: true
			});
		} else {
			// Numbered citation
			const citationNumber = parseInt(citationText);
			let article: Article | undefined;

			if (citationMapping) {
				article = citationMapping.numberToArticle.get(citationNumber);
			} else {
				article = articles[citationNumber - 1];
			}

			if (article) {
				citationItems.push({
					article,
					number: citationNumber,
					isCommon: false
				});
			}
		}
	}

	return citationItems;
}

/**
 * Aggregates citations from multiple text strings and deduplicates them
 */
export function aggregateCitationsFromTexts(
	texts: string[],
	citationMapping?: CitationMapping,
	articles: Article[] = []
): AggregatedCitations {
	const allCitationItems: CitationItem[] = [];

	// Parse citations from all texts
	texts.forEach(text => {
		const citations = parseCitationsFromText(text, citationMapping, articles);
		allCitationItems.push(...citations);
	});

	// Deduplicate citations
	const seen = new Set<string>();
	const citedArticles: Article[] = [];
	const citedNumbers: number[] = [];
	const citedItems: CitationItem[] = [];
	let hasCommonKnowledge = false;

	for (const item of allCitationItems) {
		if (item.isCommon) {
			hasCommonKnowledge = true;
			if (!seen.has('common')) {
				seen.add('common');
				citedItems.push(item);
			}
		} else if (item.article) {
			const articleKey = item.article.link;
			if (!seen.has(articleKey)) {
				seen.add(articleKey);
				citedArticles.push(item.article);
				citedNumbers.push(item.number);
				citedItems.push(item);
			}
		}
	}

	return {
		citedArticles,
		citedNumbers,
		citedItems,
		hasCommonKnowledge
	};
}

/**
 * Helper function to aggregate citations from timeline events
 */
export function aggregateCitationsFromTimeline(
	timeline: any[],
	parseTimelineEvent: (event: any) => { description: string },
	citationMapping?: CitationMapping,
	articles: Article[] = []
): AggregatedCitations {
	const texts = timeline.map(event => parseTimelineEvent(event).description);
	return aggregateCitationsFromTexts(texts, citationMapping, articles);
}

/**
 * Helper function to aggregate citations from highlights/points
 */
export function aggregateCitationsFromPoints(
	points: string[],
	citationMapping?: CitationMapping,
	articles: Article[] = []
): AggregatedCitations {
	const texts: string[] = [];
	
	points.forEach(point => {
		if (point.includes(':')) {
			// Split title and content for highlights
			const parts = [point.split(':')[0].trim(), point.split(':')[1].trim()];
			texts.push(...parts);
		} else {
			texts.push(point);
		}
	});

	return aggregateCitationsFromTexts(texts, citationMapping, articles);
}

/**
 * Helper function to aggregate citations from Q&A pairs
 */
export function aggregateCitationsFromQnA(
	qnaItems: Array<{ question: string; answer: string }>,
	citationMapping?: CitationMapping,
	articles: Article[] = []
): AggregatedCitations {
	const texts: string[] = [];
	
	qnaItems.forEach(qa => {
		texts.push(qa.question, qa.answer);
	});

	return aggregateCitationsFromTexts(texts, citationMapping, articles);
}

/**
 * Helper function to aggregate citations from perspectives
 */
export function aggregateCitationsFromPerspectives(
	perspectives: Array<{ text: string }>,
	citationMapping?: CitationMapping,
	articles: Article[] = []
): AggregatedCitations {
	const texts = perspectives.map(p => p.text);
	return aggregateCitationsFromTexts(texts, citationMapping, articles);
}