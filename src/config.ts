import path from "path"

export const ALLOWED_DIRS = [

]

export function resolveSafePath(p: string): string {
    const resolved = path.resolve(p)
    const allowed = ALLOWED_DIRS.some(dir => resolved.startsWith(dir))
    if (!allowed) throw new Error("Access denied")
    return resolved
}
