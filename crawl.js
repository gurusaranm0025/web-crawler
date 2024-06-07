const { JSDOM } = require("jsdom")

async function crawlPage(currentURL) {
    console.log(`currently crawling ${currentURL}`)
    try {
        const resp = await fetch(currentURL)
        if (resp.status > 399) {
            console.error(`error in fetch with status code: ${resp.status} on page: ${currentURL}`)
            return
        }

        const contentType = resp.headers.get("content-type")
        if (!contentType.includes("text/html")) {
            console.error(`non html response, content type: ${contentType}, on page: ${currentURL}`)
            return
        }

        console.log(await resp.text())
    } catch (err) {
        console.log(`error in fech: ${err.message}, on page: ${currentURL}`)
    }
}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for (const linkElement of linkElements) {

        const urlStr = linkElement.href.slice(0, 1) === '/' ? `${baseURL}${linkElement.href}` : linkElement.href

        try {
            const urlObj = new URL(urlStr)
            urls.push(urlObj.href)
        } catch (err) {
            console.log(`error with url: "${urlStr}" with message: "${err.message}"`)
        }
    }
    return urls
}


function normalizeURL(urlString) {
    const urlObj = new URL(urlString)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`

    if (hostPath.length > 0 && hostPath.slice(-1) == '/') {
        return hostPath.slice(0, -1)
    }
    return hostPath
}

module.exports = { normalizeURL, getURLsFromHTML, crawlPage }