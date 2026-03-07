import fs from "fs"
import { resolveSafePath } from "../config.js"

export const editFileTool = {
    name: "edit_file",
    description: "Overwrite an existing file with new content.",
    inputSchema: {
        type: "object",
        properties: {
            path: { type: "string", description: "Full path of the file to edit" },
            content: { type: "string", description: "New text content to write into the file" }
        },
        required: ["path", "content"]
    }
}

export function handleEditFile(args: Record<string, unknown>) {
    const { path: inputPath, content } = args as { path?: string; content?: string }
    if (!inputPath) throw new Error("Missing path")
    if (content === undefined) throw new Error("Missing content")

    const safePath = resolveSafePath(inputPath)
    if (!fs.existsSync(safePath)) throw new Error(`File not found: ${safePath}`)

    fs.writeFileSync(safePath, content, "utf8")
    return { content: [{ type: "text", text: `✅ Updated: ${safePath}` }] }
}
