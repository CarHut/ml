import * as cheerio from 'cheerio';
import PgConnection from '../postgres-util/pg-util.js';

class BazosScraper {
    constructor(page, startPage, endPage, interactor) {
        this.page = page;
        this.startPage = startPage;
        this.endPage = endPage;
        this.interactor = interactor;
    }

    delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

    async getLinksToTraverse(htmlContent) {
        const $ = cheerio.load(htmlContent);
        const linksWithTitles = [];
    
        $('.nadpis a').each((index, element) => {
            const href = $(element).attr('href');
            const title = $(element).parent().text().trim();
    
            if (href) {
                linksWithTitles.push({ href, title }); 
            }
        });
        const uniqueLinks = linksWithTitles.filter((value, index, self) =>
            index === self.findIndex((t) => t.href === value.href)
        );
    
        return uniqueLinks;
    }

    async getHeaderFromHtmlContent(htmlContent) {
        const $ = cheerio.load(htmlContent);
        const header = $('.nadpisdetail').text().trim();
        return header || null;
    }

    async getBodyFromHtmlContent(htmlContent) {
        const $ = cheerio.load(htmlContent);
        const body = $('.popisdetail').text().trim();
        return body || null;
    }

    async getLocationFromHtmlContent(htmlContent) {
        const $ = cheerio.load(htmlContent);
        const postalCode = $('td > a[title="Približná lokalita"]').first().text().trim();
        const city = $('td > a[title="Približná lokalita"]').next('a').text().trim();
        return postalCode && city ? `${postalCode} ${city}` : null;
    }

    async getSellerFromHtmlContent(htmlContent) {
        const $ = cheerio.load(htmlContent);
        const sellerName = $('span.paction').text().trim();
        return sellerName || null;
    }

    async getPriceFromHtmlContent(htmlContent) {
        const $ = cheerio.load(htmlContent);
        const price = $('tr:nth-last-of-type(2) b').text().trim();
        return price || null;
    }

    async getPageContentAndReturn(randomLink, id) {
        await this.delay(20000);
        await this.delay(Math.floor(Math.random() * (2000 - 500) + 500));
        await this.page.screenshot({ path: `C:\\Users\\Johny\\Desktop\\bazos-images\\${id}.png` });
        const htmlContent = await this.page.content();
        const header = await this.getHeaderFromHtmlContent(htmlContent);
        const imagePath = `C:\\Users\\Johny\\Desktop\\bazos-images\\${id}.png`;
        const link = `https://auto.bazos.sk${randomLink['href']}`;
        const body = await this.getBodyFromHtmlContent(htmlContent);
        const location = await this.getLocationFromHtmlContent(htmlContent);
        const seller = await this.getSellerFromHtmlContent(htmlContent);
        const price = await this.getPriceFromHtmlContent(htmlContent);
        const pg = new PgConnection();
        await pg.executePgQuery(`INSERT INTO bazos_data_scraping (id,header,image_path,link,body,location,price,seller_name) VALUES (${id},'${header}','${imagePath}','${link}','${body}','${location}','${price}','${seller}');`)
        await this.randomizeBotInteractionWithOffer();    
    }

    async randomizeBotInteractionWithOffer() {
        await this.interactor.scrollTo(1200);
        await this.delay(Math.floor(Math.random() * (3000 - 1500) + 1500));
        await this.interactor.scrollTo(0);
        const htmlContent = await this.page.content();
        await this.delay(Math.floor(Math.random() * (1500 - 1000) + 1000));
        try {
            const $ = cheerio.load(htmlContent);
            $('tr:nth-last-of-type(2) b').each(async (index, element) => {
                this.interactor.moveMouseToElement(element);
                await this.delay(Math.floor(Math.random() * (10000 - 500) + 500));   
            }); 
        } catch {
            console.log('No images to hover over.');
        }
        await this.delay(Math.floor(Math.random() * (2000 - 500) + 500));
        await this.interactor.scrollTo(1200);
        await this.delay(Math.floor(Math.random() * (500 - 300) + 300));
        await this.interactor.scrollTo(1300);
        await this.delay(Math.floor(Math.random() * (500 - 300) + 300));
        await this.interactor.scrollTo(1400);
        await this.delay(Math.floor(Math.random() * (20000 - 5000) + 5000));
        await this.interactor.scrollTo(0);
        await this.delay(Math.floor(Math.random() * (5000 - 2000) + 2000));
        await this.page.goBack(); 
        await this.delay(10000);
    }

    async traverseSomeLinks(links, startId) {
        const randomLinks = this.pickRandomLinks(links, 5, 15);
        let currentId = startId; 
        for (const randomLink of randomLinks) {
            await this.delay(Math.floor(Math.random() * (15000 - 4500) + 4500));
            const parentSelector = `h2.nadpis:has(a[href^="${randomLink['href']}"])`;
            await this.interactor.moveMouseToElement(parentSelector);
            await this.delay(1000);
            await this.page.click(parentSelector);
            await this.getPageContentAndReturn(randomLink, currentId);
            currentId = currentId + 1;
        }
    }

    pickRandomLinks(links, minThreshold=5, maxThreshold=15) {
        const randNumAmount = Math.floor(Math.random() * (maxThreshold - minThreshold) + minThreshold);
        var randomLinkNumbers = Array.from({ length: 20 }, (_, i) => i);
        
        while (randomLinkNumbers.length > randNumAmount) {
            const randNum = Math.floor(Math.random() * randomLinkNumbers.length);
            randomLinkNumbers.splice(randNum, 1);
        }
    
        randomLinkNumbers = randomLinkNumbers.sort();
        const randomLinks = [];
        for (let i = 0; i < randomLinkNumbers.length; i++) {
            randomLinks.push(links[i]);
        }
    
        return randomLinks;
    }

    async startScraping(startId) {
        // fetch page html
        await this.page.waitForSelector('.inzeraty.inzeratyflex a', { timeout: 10000 }); 
        const htmlContent = await this.page.content();
        const links = await this.getLinksToTraverse(htmlContent);
        await this.traverseSomeLinks(links, startId);
    }

}

export default BazosScraper;