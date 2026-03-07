import fs from "fs"
import { resolveSafePath } from "../config.js"

export const readFileTool = {
    name: "read_file",
    description: "Read a file's contents",
    inputSchema: {
        type: "object",
        properties: {
            path: { type: "string" }
        },
        required: ["path"]
    }
}

export function handleReadFile(args: Record<string, unknown>) {
    const { path: inputPath } = args as { path?: string }
    if (!inputPath) throw new Error("Missing path")

    const safePath = resolveSafePath(inputPath)
    return { content: [{ type: "text", text: fs.readFileSync(safePath, "utf8") }] }
}
