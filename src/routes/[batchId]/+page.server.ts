import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, url }) => {
	const { batchId } = params;
	
	// Check if the request is for an XML file
	if (batchId.endsWith('.xml')) {
		// Return 404 to let nginx serve the static file
		error(404, 'Not found');
	}
	
	// Check if the request is for other static files that should be served by nginx
	if (batchId.endsWith('.json')) {
		// Return 404 to let nginx serve the static file
		error(404, 'Not found');
	}
	
	// Otherwise, continue with normal route handling
	return {};
};