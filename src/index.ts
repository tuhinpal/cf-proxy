import { parseConfig } from './config';
import htmlTransformer from './transform';
import { Env } from './types';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
			const config = parseConfig(env);

			const url = new URL(request.url);
			const workerHostname = url.hostname; // this will be returned as header
			url.hostname = config.BASE.hostname;

			const res = await fetch(url.toString(), {
				method: request.method,
				headers: {
					...Object.fromEntries(request.headers.entries()),
					host: config.BASE.hostname,
					referer: config.BASE.toString(),
					origin: config.BASE.toString(),
				},
				body: request.body,
			});

			let responseBody: string | ArrayBuffer | null = null;

			const contentType = res.headers.get('content-type');

			if (contentType && contentType.includes('text/html')) {
				responseBody = await htmlTransformer(res, {
					workerHostname,
					config,
				});
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
		} catch (e) {
			const error = e as Error;
			const errorMessage = `Oh! Snap. Something went wrong on proxy server.\n\nError: ${error.message}`;

			return new Response(errorMessage, {
				status: 500,
				headers: { 'content-type': 'text/plain', 'access-control-allow-origin': '*', 'cache-control': 'max-age=0' },
			});
		}
	},
};
