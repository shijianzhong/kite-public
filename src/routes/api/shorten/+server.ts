import { GET as proxyGET, POST as proxyPOST } from '$lib/server/proxy';

export const GET = proxyGET('/shorten');
export const POST = proxyPOST('/shorten');