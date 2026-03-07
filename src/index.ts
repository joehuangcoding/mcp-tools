// MCP filesystem + web server
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js"

import { listFilesTool, handleListFiles } from "./tools/listFiles.js"
import { readFileTool, handleReadFile } from "./tools/readFile.js"
import { createFileTool, handleCreateFile } from "./tools/createFile.js"
import { editFileTool, handleEditFile } from "./tools/editFile.js"
import { webSearchTool, handleWebSearch } from "./tools/webSearch.js"
import { fetchUrlTool, handleFetchUrl } from "./tools/fetchUrl.js"

const server = new Server(
    { name: "filesystem-server", version: "1.0.0" },
    { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        listFilesTool,
        readFileTool,
        createFileTool,
        editFileTool,
        webSearchTool,
        fetchUrlTool,
    ]
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params
    if (!args || typeof args !== "object") throw new Error("Invalid args")

    const a = args as Record<string, unknown>

    switch (name) {
        case "list_files":  return handleListFiles(a)
        case "read_file":   return handleReadFile(a)
        case "create_file": return handleCreateFile(a)
        case "edit_file":   return handleEditFile(a)
        case "web_search":  return await handleWebSearch(a)
        case "fetch_url":   return await handleFetchUrl(a)
        default:            throw new Error(`Unknown tool: ${name}`)
    }
})

async function main() {
    const transport = new StdioServerTransport()
    await server.connect(transport)
    console.error("✅ MCP filesystem server running")
}

main()
