import { base, publicCdn } from './config';

export default async function htmlTransformer(res: Response) {
	const originTransformed = new HTMLRewriter().on('*', new OriginHandler()).transform(res);

	const adBlocker = new HTMLRewriter().on('script', new AdBlocker()).transform(originTransformed);

	return await adBlocker.text();
}

class OriginHandler {
	element(element: Element) {
		const src = element.getAttribute('src');

		if (src && src.startsWith(base.origin)) {
			// https://x.co/sbs.js -> /sbs.js || https://x.co/image.png -> /image.png
			element.setAttribute('src', src.replace(base.origin, ''));
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
