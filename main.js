const { crawlPage } = require("./crawl.js")
const { printReport } = require("./report.js")

async function main() {
    if (process.argv.length < 3) {
        console.log("no website provided")
        process.exit(1)
    }
    if (process.argv.length > 3) {
        console.error("too many command line args")
        process.exit(1)
    }

    const baseURL = process.argv[2]

    console.log(`Starting crawl ${baseURL}`)

    const pages = await crawlPage(baseURL, baseURL, {})
    printReport(pages)
    process.exit(0)
}

main()