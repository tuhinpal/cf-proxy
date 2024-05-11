# CF Proxy

A fast, efficient, Zero Dependency Cloudflare Proxy with AD Blocker support.

## Features 📖

- Zero Dependency
- Origin Replacer
- AD Blocker
- Text Replacer
- On-Demand Host configuration

## Deployment 🚀

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/tuhinpal/cf-proxy)

## Post Deployment 🛠️

You need to change two `ENVIROMENT VARIABLES` in the `Cloudflare Workers` dashboard.

- `BASE` - The URL of the website you want to proxy. (e.g. `https://developers.cloudflare.com`)
- `FEATURE_FLAGS` - Feature flags you want to opt-in. (e.g. `AD_BLOCKER,TEXT_REPLACER,ON_DEMAND_HOST_CONFIG`)

Additionally, open the `wrangler.toml` file and change the `BASE` and `FEATURE_FLAGS` values.

## Feature Flags 🚩

Features flags are comma separated values that you can use to enable or disable features. You need to put these flags in the `FEATURE_FLAGS` environment variable.

- `AD_BLOCKER` - Enable AD Blocker
- `TEXT_REPLACER` - Enable Text Replacer
- `ON_DEMAND_HOST_CONFIG` - Enable On-Demand Host configuration by adding `?host=example.com` in the URL

## Development 🛠️

1. Clone the repository
2. Install the dependencies
3. Run the development server

```bash
git clone https://github.com/tuhinpal/cf-proxy.git
cd cf-proxy
npm install
npm run dev
```

## License 📝

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

## Legal Disclaimer ⚖️

Don't use this for any illegal activities. You are responsible for your actions. This project is made to test the HtmlRewriter runtime API of Cloudflare Workers.
