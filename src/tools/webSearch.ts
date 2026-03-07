import { httpGet } from "../utils/httpGet.js"
import { htmlToText } from "../utils/htmlToText.js"

export const webSearchTool = {
    name: "web_search",
    description: "Search the web using DuckDuckGo and return the top results with titles, URLs and snippets.",
    inputSchema: {
        type: "object",
        properties: {
            query: { type: "string", description: "Search query" },
            max_results: { type: "number", description: "Max number of results to return (default: 5)" }
        },
        required: ["query"]
    }
}

export async function handleWebSearch(args: Record<string, unknown>) {
    const { query, max_results = 5 } = args as { query?: string; max_results?: number }
    if (!query) throw new Error("Missing query")

    const encoded = encodeURIComponent(query)
    const url = `https://search.yahoo.com/search?p=${encoded}&ei=UTF-8`
    const html = await httpGet(url)

    const results: string[] = []

    // Each result block looks like:
    // <div class="algo ..."> ... <a ...href="URL"...>TITLE</a> ... snippet text ... </div>
    const blockRegex = /<div[^>]+class="[^"]*algo[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g
    let match: RegExpExecArray | null

    while ((match = blockRegex.exec(html)) !== null) {
        if (results.length >= max_results) break
        const block = match[1]

        // Extract URL from href
        const urlMatch = block.match(/href="(https?:\/\/[^"]+)"/)
        const rawUrl = urlMatch ? urlMatch[1] : null

        // Extract title from <a> tag text
        const titleMatch = block.match(/<a[^>]*>([\s\S]*?)<\/a>/)
        const title = titleMatch ? htmlToText(titleMatch[1]).trim() : null

        // Extract snippet - text after stripping all tags
        const snippet = htmlToText(block).replace(title ?? "", "").trim().slice(0, 200)

        if (rawUrl && title) {
            results.push(`🔗 ${title}\n   URL: ${rawUrl}\n   ${snippet}`)
        }
    }

    if (results.length === 0) {
        return { content: [{ type: "text", text: `No results found for: "${query}"` }] }
    }

    return { content: [{ type: "text", text: results.join("\n\n") }] }
}
