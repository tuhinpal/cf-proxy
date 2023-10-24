import { base } from './config';
import htmlTransformer from './transform';

export interface Env {}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		url.hostname = base.hostname;

		const res = await fetch(url.toString(), {
			method: request.method,
			headers: {
				...Object.fromEntries(request.headers.entries()),
				host: base.hostname,
				referer: base.toString(),
				origin: base.toString(),
			},
			body: request.body,
		});

		let responseBody: string | ArrayBuffer | null = null;

		const contentType = res.headers.get('content-type');

		if (contentType && contentType.includes('text/html')) {
			responseBody = await htmlTransformer(res);
		} else {
			responseBody = await res.arrayBuffer();
			if (responseBody.byteLength === 0) responseBody = null;
		}

		return new Response(responseBody, {
			status: res.status,
			statusText: res.statusText,
			headers: {
				...Object.fromEntries(res.headers.entries()),
				'access-control-allow-origin': '*',
				'cache-control': 'max-age=0',
			},
		});
	},
};
