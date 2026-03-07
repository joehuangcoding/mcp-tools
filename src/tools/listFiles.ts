import fs from "fs"
import path from "path"
import { resolveSafePath } from "../config.js"

export const listFilesTool = {
    name: "list_files",
    description: "List all files in a folder (recursive)",
    inputSchema: {
        type: "object",
        properties: {
            path: { type: "string", description: "Folder path (relative or '.' for current dir)" },
            recursive: { type: "boolean", description: "List recursively (default: true)" }
        },
        required: ["path"]
    }
}

function listFilesRecursive(dir: string, baseDir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    const files: string[] = []

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        const relativePath = path.relative(baseDir, fullPath)

        if (entry.isDirectory()) {
            files.push(`📁 ${relativePath}/`)
            files.push(...listFilesRecursive(fullPath, baseDir))
        } else {
            files.push(`📄 ${relativePath}`)
        }
    }

    return files
}

export function handleListFiles(args: Record<string, unknown>) {
    const { path: inputPath, recursive = true } = args as { path?: string; recursive?: boolean }
    if (!inputPath) throw new Error("Missing path")

    const safePath = resolveSafePath(inputPath)
    const files = recursive
        ? listFilesRecursive(safePath, safePath)
        : fs.readdirSync(safePath).map(f => {
            const isDir = fs.statSync(path.join(safePath, f)).isDirectory()
            return isDir ? `📁 ${f}/` : `📄 ${f}`
          })

    const output = files.length > 0 ? files.join("\n") : "(empty directory)"
    return { content: [{ type: "text", text: output }] }
}
