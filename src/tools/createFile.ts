import fs from "fs"
import path from "path"
import { resolveSafePath } from "../config.js"

export const createFileTool = {
    name: "create_file",
    description: "Create a new file with the given content. Fails if file already exists.",
    inputSchema: {
        type: "object",
        properties: {
            path: { type: "string", description: "Full path of the file to create" },
            content: { type: "string", description: "Text content to write into the file" }
        },
        required: ["path", "content"]
    }
}

export function handleCreateFile(args: Record<string, unknown>) {
    const { path: inputPath, content } = args as { path?: string; content?: string }
    if (!inputPath) throw new Error("Missing path")
    if (content === undefined) throw new Error("Missing content")

    const safePath = resolveSafePath(inputPath)
    if (fs.existsSync(safePath)) throw new Error(`File already exists: ${safePath}`)

    fs.mkdirSync(path.dirname(safePath), { recursive: true })
    fs.writeFileSync(safePath, content, "utf8")
    return { content: [{ type: "text", text: `✅ Created: ${safePath}` }] }
}
