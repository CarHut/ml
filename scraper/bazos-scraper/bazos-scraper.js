import * as cheerio from 'cheerio';
import PgConnection from '../postgres-util/pg-util.js';

class BazosScraper {
    constructor(page, startPage, endPage, interactor) {
        this.page = page;
        this.startPage = startPage;
        this.endPage = endPage;
        this.interactor = interactor;
    }
clea
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
        var header = $('.nadpisdetail').text().trim();

        if (header === null) {
            return null;
        }

        header = header.replaceAll("\'", " ");
        header = header.replaceAll("\"", " ");
        return header;
    }

    async getBodyFromHtmlContent(htmlContent) {
        const $ = cheerio.load(htmlContent);
        var body = $('.popisdetail').text().trim();

        if (body === null) {
            return null;
        }

        body = body.replaceAll("\'", " ");
        body = body.replaceAll("\"", " ");
        return body;
    }

    async getLocationFromHtmlContent(htmlContent) {
        const $ = cheerio.load(htmlContent);
        var postalCode = $('td > a[title="Približná lokalita"]').first().text().trim();
        var city = $('td > a[title="Približná lokalita"]').next('a').text().trim();
        
        if (city === null || postalCode === null) {
            return null;
        }

        city = city.replace("\'", " ");
        city = city.replace("\"", " ");
        postalCode = postalCode.replace("\'", " ");
        postalCode = postalCode.replace("\"", " ");
    
        return postalCode + " " + city;
    }

    async getSellerFromHtmlContent(htmlContent) {
        const $ = cheerio.load(htmlContent);
        var sellerName = $('td b span').text().trim();
        if (sellerName === null) {
            return null;
        }
        sellerName = sellerName.replace("\'", " ");
        sellerName = sellerName.replace("\'", " ");
        return sellerName;
    }

    async getPriceFromHtmlContent(htmlContent) {
        const $ = cheerio.load(htmlContent);
        const priceElement = $('td b').eq(1);
        if (priceElement.length === 0) {
            return null;
        }
        var price = priceElement.text().trim();
        if (price === null) {
            return null;
        }
        price = price.replace("\'", " ");
        price = price.replace("\'", " ");
        return price;
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

    async traverseSomeLinks(links, id) {
        var currentOfferIdBuffer = 0;
        const randomLinks = this.pickRandomLinks(links, 0, links.length);
        // If links are length of 0 make some delay because it wont find next pages
        if (randomLinks.length === 0) {
            await this.delay(5000);
        }
        for (const randomLink of randomLinks) {
            await this.delay(Math.floor(Math.random() * (15000 - 4500) + 4500));
            const parentSelector = `h2.nadpis:has(a[href^="${randomLink['href']}"])`;
            await this.interactor.moveMouseToElement(parentSelector);
            await this.delay(1000);
            await this.page.click(parentSelector);
            await this.getPageContentAndReturn(randomLink, id + currentOfferIdBuffer);
            currentOfferIdBuffer = currentOfferIdBuffer + 1;
        }

        return currentOfferIdBuffer;
    }

    pickRandomLinks(links, minThreshold, maxThreshold) {
        const randNumAmount = Math.floor(Math.random() * (maxThreshold - minThreshold) + minThreshold);
        var randomLinkNumbers = Array.from({ length: links.length }, (_, i) => i);
        
        while (randomLinkNumbers.length > randNumAmount) {
            const randNum = Math.floor(Math.random() * randomLinkNumbers.length);
            randomLinkNumbers.splice(randNum, 1);
        }
    
        randomLinkNumbers = randomLinkNumbers.sort();
        const randomLinks = [];
        for (let i = 0; i < randomLinkNumbers.length; i++) {
            randomLinks.push(links[randomLinkNumbers[i]]);
        }
        console.log(`Random links: ${randomLinks}`);
        return randomLinks;
    }

    async getUncheckedLinks(links) {
        const pgConnection = new PgConnection();
        const uncheckedLinks = await pgConnection.getUncheckedLinks(links);
        return uncheckedLinks;
    }

    async acceptCookies() {
        try {
            await this.interactor.moveMouseToElement(`button[class="${'cc-nb-okagree'}"]`);
            await this.delay(1500);
            await this.page.click(`button[class="${'cc-nb-okagree'}"]`);    
        } catch (error) {
            console.log(`Cannot accept cookies: ${error}`);
        }
    }

    async goToPage(pageNum) {
        await this.delay(Math.random() * (10000 - 3000) + 3000)
        const htmlContent = await this.page.content();
        const $ = cheerio.load(htmlContent); 
    
        const pageLinks = $('.strankovani a');
        let targetHref = null;
        pageLinks.each((index, element) => {
            if ($(element).text().trim() === pageNum.toString()) {
                targetHref = $(element).attr('href');
            }
        });
    
        if (targetHref) {
            const targetSelector = `a[href="${targetHref}"]`;
            console.log(`Navigating to page ${pageNum} with selector: ${targetSelector}`);
            
            const targetElement = await this.page.$(targetSelector);
            if (targetElement) {
                await this.delay(Math.random() * (3000 - 1500) + 1500);
                await this.interactor.moveMouseToElement(targetSelector);
                await this.delay(Math.random() * (1000 - 500) + 500);
                await this.page.click(targetSelector);
                console.log(`Successfully navigated to page ${pageNum}`);
            } else {
                console.error(`Target element for page ${pageNum} not found in Puppeteer!`);
            }
        } else {
            console.error(`Page number ${pageNum} not found!`);
        }
    }

    async startScraping(startId) {
        // fetch page html
        let currentId = startId;
        await this.acceptCookies();
        for (let i = this.startPage + 1; i <= this.endPage; i++) {
            await this.page.waitForSelector('.inzeraty.inzeratyflex a', { timeout: 60000 }); 
            const htmlContent = await this.page.content();
            const links = await this.getLinksToTraverse(htmlContent);
            const uncheckedLinks = await this.getUncheckedLinks(links);
            const buffer = await this.traverseSomeLinks(uncheckedLinks, currentId);
            await this.goToPage(i);
            currentId = currentId + buffer;
        }
    }

}

export default BazosScraper;