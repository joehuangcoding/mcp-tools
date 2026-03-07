import { httpGet } from "../utils/httpGet.js"
import { htmlToText } from "../utils/htmlToText.js"

export const fetchUrlTool = {
    name: "fetch_url",
    description: "Fetch the contents of a URL and return it as plain text.",
    inputSchema: {
        type: "object",
        properties: {
            url: { type: "string", description: "The URL to fetch" },
            max_length: { type: "number", description: "Max characters to return (default: 5000)" }
        },
        required: ["url"]
    }
}

export async function handleFetchUrl(args: Record<string, unknown>) {
    const { url, max_length = 5000 } = args as { url?: string; max_length?: number }
    if (!url) throw new Error("Missing url")

    const raw = await httpGet(url)
    const text = htmlToText(raw).slice(0, max_length)
    return { content: [{ type: "text", text: text }] }
}
