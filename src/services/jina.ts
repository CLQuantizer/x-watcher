export async function fetchFromJina(url: string, apiKey: string) {
	const jinaUrl = `https://r.jina.ai/${encodeURIComponent(url)}`;
	const response = await fetch(jinaUrl, {
		headers: {'Authorization': `Bearer ${apiKey}`}
	});
	if (!response.ok) {
		throw new Error(`Jina API request failed: ${response.statusText}`);
	}
	return response.json();
} 