import https from "https"
import http from "http"

const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

export function httpGet(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const client = url.startsWith("https") ? https : http
        client.get(url, { headers: HEADERS }, (res) => {
            if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return httpGet(res.headers.location).then(resolve).catch(reject)
            }
            let data = ""
            res.on("data", chunk => data += chunk)
            res.on("end", () => resolve(data))
            res.on("error", reject)
        }).on("error", reject)
    })
}
