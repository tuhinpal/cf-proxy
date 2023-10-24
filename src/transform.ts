import { adBlocker, base, publicCdn } from './config';

export default async function htmlTransformer(
	res: Response,
	{
		workerHostname,
	}: {
		workerHostname: string;
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

			if (url.includes(base.hostname)) {
				element.setAttribute(replace, url.replace(new RegExp(base.hostname, 'gi'), workerHostname));
			}
		}

		text(text: Text) {
			if (text.text.includes(base.hostname)) {
				text.replace(text.text.replace(base.hostname, workerHostname));
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

	if (adBlocker) {
		// ad blocker
		transformedResp = new HTMLRewriter().on('script', new AdBlocker()).transform(transformedResp);
	}

	return await transformedResp.text();
}
