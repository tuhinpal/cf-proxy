import { publicCdn } from './config';
import { Config } from './types';

export default async function htmlTransformer(
	res: Response,
	{
		workerHostname,
		config,
	}: {
		workerHostname: string;
		config: Config;
	}
) {
	class OriginHandler {
		element(element: Element) {
			let replace: 'src' | 'href' | 'action';
			let url: string;

			const src = element.getAttribute('src');
			const href = element.getAttribute('href');
			const action = element.getAttribute('action');

			if (src) {
				replace = 'src';
				url = src;
			} else if (href) {
				replace = 'href';
				url = href;
			} else if (action) {
				replace = 'action';
				url = action;
			} else {
				return;
			}

			try {
				const urlObj = new URL(url, config.BASE);

				if (urlObj.hostname === config.BASE.hostname) {
					urlObj.hostname = workerHostname;

					if (config.ON_DEMAND_HOST) {
						urlObj.searchParams.set('host', config.ON_DEMAND_HOST);
					}

					element.setAttribute(replace, urlObj.toString());
				}
			} catch {}
		}

		text(text: Text) {
			if (config.FEATURE_FLAGS.TEXT_REPLACER_ENABLED && text.text.includes(config.BASE.hostname)) {
				text.replace(text.text.replace(config.BASE.hostname, workerHostname));
			}
		}
	}

	class AdBlocker {
		element(element: Element) {
			const src = element.getAttribute('src');

			// //:x.com/image.png https://x.com/image.png
			if (src && (src.startsWith('//') || src.startsWith('https://') || src.startsWith('http://'))) {
				let finalSrc = src;

				if (src.startsWith('//')) {
					finalSrc = 'https:' + src;
				}

				const hostname = new URL(finalSrc).hostname;

				if (publicCdn.some((domain) => hostname.endsWith(domain))) {
					// do nothing
				} else {
					// remove the element
					element.remove();
				}
			}
		}
	}

	// origin handler
	let transformedResp = new HTMLRewriter().on('*', new OriginHandler()).transform(res);

	if (config.FEATURE_FLAGS.AD_BLOCKER_ENABLED) {
		// ad blocker
		transformedResp = new HTMLRewriter().on('script', new AdBlocker()).transform(transformedResp);
	}

	return await transformedResp.text();
}
