import ky from 'ky';

export async function fetchFromJina(url: string, apiKey: string) {
	const jinaUrl = `https://r.jina.ai/${encodeURIComponent(url)}`;
	const response = await ky.get(jinaUrl, {
		headers: {
			'Authorization': `Bearer ${apiKey}`,
			'X-Engine': 'browser',
			"X-Target-Selector": "article",
			"X-Wait-For-Selector": "article",
			'X-Retain-Images': 'none',
			'X-Return-Format': 'text'
		}
	});
	return response.text();
} 