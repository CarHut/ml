// Packages
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Utils
import FileLoader from './util/extensions-loader.js';
import proxies from './util/proxies.js';
import userAgents from './util/user-agents.js';
import viewports from './util/viewports.js';
import InteractionsWithAutobazarEu from './interactions/user-bot-interactions-with-bazos.js';

// Scraper
import AutobazarEuScraper from './scraper/autobazar-eu-scraper.js';

const pageUrl = 'https://autobazar.eu/'
const dummyUrl = 'https://bot.sannysoft.com/'
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

const loadExtensions = async () => {
    const fileLoader = new FileLoader();
    const extensions = await fileLoader.loadExtensionFolders();
    const randExtensions = fileLoader.pickRandomExtensionsFromList(extensions);
    const extensionsString = fileLoader.extensionsToString(randExtensions);
    return extensionsString;
}

async function setPageHeaders(page, randProxyNum) {
    const userAgent = userAgents[randProxyNum];
    const viewport = viewports[randProxyNum];
    await page.setUserAgent(userAgent);
    await page.setViewport({
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: viewport.deviceScaleFactor
    });
}

async function closeTabs(browser) {
    const pages = await browser.pages();
    for (const page of pages) {
        if (page.url() !== 'https://bot.sannysoft.com/') {
            await page.close();
        }
    }
}

async function interactAndScrapeAutobazarEu(page, startPage, endPage, interactor, browser) {
    const scraper = new AutobazarEuScraper(page, startPage, endPage, interactor, browser);
    await scraper.startScraping(533);
}

const main = async () => {
    const extensions = await loadExtensions();
    // Enable all stealth evasions
    puppeteer.use(StealthPlugin());

    const randProxyNum = Math.floor(Math.random() * 9);
    const browser = await puppeteer.launch({
        headless: false, // Run in non-headless mode to view extensions
        args: [
            '--start-maximized',
            `--load-extension=${extensions}`,
            `--proxy-server=${proxies[randProxyNum]}`,
        ],
    });

    console.log(`Using proxy: ${proxies[randProxyNum]}`);

    const page = await browser.newPage();
    await setPageHeaders(page, randProxyNum);
    await page.goto(dummyUrl, { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: 'bot.png' });
    await delay(10000);
    await closeTabs(browser);
    await delay(10000);
    await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const interactionsWithAutobazarEu = new InteractionsWithAutobazarEu(page);
    await interactAndScrapeAutobazarEu(page, 1, 17, interactionsWithAutobazarEu, browser);
    await delay(60000);
    await browser.close();
};

main();
