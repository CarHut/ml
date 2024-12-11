import PgConnection from '../postgres-util/pg-util.js';
import InteractionsWithAutobazarEu from '../interactions/user-bot-interactions-with-bazos.js';

class AutobazarEuScraper {
    constructor (page, startPage, endPage, interactor, browser) {
        this.page = page;
        this.startPage = startPage;
        this.endPage = endPage;
        this.interactor = interactor;
        this.browser = browser;
    }

    delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

    async openRightTab(url) {
        await this.delay(5000);
        const pages = await this.browser.pages();
        await this.delay(1000);
        for (const page of pages) {
            if (await page.url() === url) {
                page.bringToFront();
                await this.delay(5000);
                return page;
            }
        }
    }

    async acceptCookies() {
        try {
            const buttonSelector = 'button[title="Pokračovať s nevyhnutnými cookies →"]';
            const button = await this.page.$(buttonSelector);
            await this.delay(Math.floor(Math.random() * (2000 - 1500) + 1500));
            await button.click();
        } catch (error) {
            console.error('Error accepting cookies:', error);
        }
    }

    async goToCarOffers() {
        await this.delay(Math.floor(Math.random() * (3000 - 1500) + 1500));
        await this.page.mouse.wheel({deltaY: 100});
        await this.delay(Math.floor(Math.random() * (500 - 300) + 300));
        await this.page.mouse.wheel({deltaY: 300});
        await this.delay(Math.floor(Math.random() * (3000 - 1500) + 1500));
        const buttonSelector = `button[class^="button-search"]`;
        await this.interactor.moveMouseToElement(buttonSelector);
        await this.delay(Math.floor(Math.random() * (3000 - 1500) + 1500));
        await this.page.click(buttonSelector);
    }

    async pickCarBrandFromImages(brandName) {
        await this.interactor.moveMouseToElement(`button[id^="headlessui-listbox-button-:Rr92m2d7sm:"]`);
        await this.delay(Math.floor(Math.random() * (2000 - 1000) + 1000));
        await this.page.click(`button[id^="headlessui-listbox-button-:Rr92m2d7sm:"]`);

        await this.delay(Math.floor(Math.random() * (2000 - 1000) + 1000));
        await this.interactor.moveMouseToElement(`img[alt^="${brandName}"]`);
        await this.delay(Math.floor(Math.random() * (1000 - 500) + 500));
        await this.page.click(`img[alt^="${brandName}"]`);
    }
    
    async confirmBrandSelection() {
        await this.delay(Math.floor(Math.random() * (1500 - 1000) + 1000));
        await this.interactor.moveMouseToElement(`span ::-p-text(Potvrdiť)`);
        await this.delay(Math.floor(Math.random() * (1500 - 1000) + 1000));
        await this.page.click(`span ::-p-text(Potvrdiť)`);
    }

    async getLinksToTraverse() {
        const allPageLinks = await this.page.$$('a');
    
        const validLinks = [];
        for (const link of allPageLinks) {
            const href = await link.evaluate(node => node.href);
            if (href && href.includes('/detail/')) {
                validLinks.push(href);
            }
        }

        // remove duplicate links
        return [...new Set(validLinks)];
    }

    async getUncheckedLinks(links) {
        const pgConnection = new PgConnection();
        const uncheckedLinks = await pgConnection.getUncheckedLinks(links);
        return uncheckedLinks;
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
        return randomLinks
    }

    async traverseSomeLinks(links, id) {
        var currentOfferIdBuffer = 0;
        const randomLinks = this.pickRandomLinks(links, 0, links.length);
        // If links are length of 0 make some delay because it wont find next pages
        if (randomLinks.length === 0) {
            await this.delay(5000);
        }
        for (const randomLink of randomLinks) {
            console.log(`Currently on: ${randomLink}`);
            await this.delay(Math.floor(Math.random() * (15000 - 4500) + 4500));
            const fixedHref = randomLink.split("https://www.autobazar.eu")[1];
            const parentSelector = `a[href^="${fixedHref}"]`;
            await this.interactor.moveMouseToElement(parentSelector);
            await this.delay(1000);
            await this.page.click(parentSelector);
            const currentTab = await this.openRightTab(randomLink);
            await this.getPageContentAndReturn(currentTab, randomLink, id + currentOfferIdBuffer);
            currentOfferIdBuffer = currentOfferIdBuffer + 1;
        }

        return currentOfferIdBuffer;
    }

    async getHeader(currentTab) {
        try {
            const h1 =  await currentTab.$('h1');
            const header = await h1.evaluate(node => node.innerText);
            console.log(header);
            return header;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getPrice(currentTab) {
        try {
            const priceElement = await currentTab.$(`div[id="price"]`);
            const price = await priceElement.evaluate(node => node.innerText);
            return price;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getFuel(currentTab) {
        try {
            const span = await currentTab.$('span ::-p-text(Palivo)');
            if (span !== null && span !== undefined) {
                const previousSibling = await currentTab.evaluateHandle(el => el.previousElementSibling, span);
                const text = await previousSibling.evaluate(el => el.innerText);
                return text;
            }
            return 'null';
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getModelYear(currentTab) {
        try {
            const span = await currentTab.$('span ::-p-text(Rok výroby)');
            if (span !== null && span !== undefined) {
                const previousSibling = await currentTab.evaluateHandle(el => el.previousElementSibling, span);
                const text = await previousSibling.evaluate(el => el.innerText);
                return text;
            }
            return 'null';
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getCcm(currentTab) {
        try {
            const span = await currentTab.$('span ::-p-text(Objem motora)');
            if (span !== null && span !== undefined) {
                const previousSibling = await currentTab.evaluateHandle(el => el.previousElementSibling, span);
                const text = await previousSibling.evaluate(el => el.innerText);
                return text;
            }
            return 'null';
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getMileage(currentTab) {
        try {
            const span = await currentTab.$('span ::-p-text(Kilometre)');
            if (span !== null && span !== undefined) {
                const previousSibling = await currentTab.evaluateHandle(el => el.previousElementSibling, span);
                const text = await previousSibling.evaluate(el => el.innerText);
                return text;
            }
            return 'null';
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getVIN(currentTab) {
        try {
            const span = await currentTab.$('span ::-p-text(VIN)');
            if (span !== null && span !== undefined) {
                const previousSibling = await currentTab.evaluateHandle(el => el.previousElementSibling, span);
                const text = await previousSibling.evaluate(el => el.innerText);
                return text;
            }
            return 'null';
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getBodyType(currentTab) {
        try {
            const span = await currentTab.$('span ::-p-text(Karoséria)');
            if (span !== null && span !== undefined) {
                const previousSibling = await currentTab.evaluateHandle(el => el.previousElementSibling, span);
                const text = await previousSibling.evaluate(el => el.innerText);
                return text;
            }
            return 'null';
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getGearbox(currentTab) {
        try {
            const span = await currentTab.$('span ::-p-text(Prevodovka)');
            if (span !== null && span !== undefined) {
                const previousSibling = await currentTab.evaluateHandle(el => el.previousElementSibling, span);
                const text = await previousSibling.evaluate(el => el.innerText);
                return text;
            }
            return 'null';
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getPower(currentTab) {
        try {
            const span = await currentTab.$('span ::-p-text(Výkon)');
            if (span !== null && span !== undefined) {
                const previousSibling = await currentTab.evaluateHandle(el => el.previousElementSibling, span);
                const text = await previousSibling.evaluate(el => el.innerText);
                return text;
            }
            return 'null';
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getPowerTrain(currentTab) {
        try {
            const span = await currentTab.$('span ::-p-text(Pohon)');
            if (span !== null && span !== undefined) {
                const previousSibling = await currentTab.evaluateHandle(el => el.previousElementSibling, span);
                const text = await previousSibling.evaluate(el => el.innerText);
                return text;
            }
            return 'null';
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getColor(currentTab) {
        try {
            const span = await currentTab.$('span ::-p-text(Farba)');
            if (span !== null && span !== undefined) {
                const previousSibling = await currentTab.evaluateHandle(el => el.previousElementSibling, span);
                const text = await previousSibling.evaluate(el => el.innerText);
                return text;
            }
            return 'null';
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getVehicleState(currentTab) {
        try {
            const h2Tag = await currentTab.$('h2 ::-p-text(Stav vozidla)');
            if (h2Tag !== null && h2Tag !== undefined) {
                const nextSibling = await currentTab.evaluateHandle(el => el.nextElementSibling, h2Tag);
                const outerHTML = await nextSibling.evaluate(el => el.outerHTML);
                const finalText = outerHTML.replaceAll("'", "");
                return finalText;
            }
            return 'null';
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getSafetyFeatures(currentTab) {
        try {
            const h3Tag = await currentTab.$('h3 ::-p-text(Bezpečnosť)');
            if (h3Tag !== null && h3Tag !== undefined) {
                const nextSibling = await currentTab.evaluateHandle(el => el.nextElementSibling, h3Tag);
                const outerHTML = await nextSibling.evaluate(el => el.outerHTML);
                const finalText = outerHTML.replaceAll("'", "");
                return finalText;
            }
            return 'null';
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getComfortFeatures(currentTab) {
        try {
            const h3Tag = await currentTab.$('h3 ::-p-text(Komfort)');
            if (h3Tag !== null && h3Tag !== undefined) {
                const nextSibling = await currentTab.evaluateHandle(el => el.nextElementSibling, h3Tag);
                const outerHTML = await nextSibling.evaluate(el => el.outerHTML);
                const finalText = outerHTML.replaceAll("'", "");
                return finalText;
            }
            return 'null';
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getOtherFeatures(currentTab) {
        try {
            const h3Tag = await currentTab.$('h3 ::-p-text(Ostatné)');
            if (h3Tag !== null && h3Tag !== undefined) {
                const nextSibling = await currentTab.evaluateHandle(el => el.nextElementSibling, h3Tag);
                const outerHTML = await nextSibling.evaluate(el => el.outerHTML);
                const finalText = outerHTML.replaceAll("'", "");
                return finalText;
            }
            return 'null';
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getMoreFeatures(currentTab) {
        try {
            const h3Tag = await currentTab.$('h3 ::-p-text(Ďalšia výbava)');
            if (h3Tag !== null && h3Tag !== undefined) {
                const nextSibling = await currentTab.evaluateHandle(el => el.nextElementSibling, h3Tag);
                const outerHTML = await nextSibling.evaluate(el => el.outerHTML);
                const finalText = outerHTML.replaceAll("'", "");
                return finalText;
            }
            return 'null';
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getNote(currentTab) {
        try {
            const h2Tag = await currentTab.$('h2 ::-p-text(Poznámka)');
            if (h2Tag !== null && h2Tag !== undefined) {
                const nextSibling = await currentTab.evaluateHandle(el => el.nextElementSibling, h2Tag);
                const outerHTML = await nextSibling.evaluate(el => el.outerHTML);
                const finalText = outerHTML.replaceAll("'", "");
                return finalText;
            }
            return 'null';
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getLocation(currentTab) {
        try {
            const aTag = await currentTab.$(`a[href^="https://maps.google.com/"]`);
            if (aTag !== null && aTag !== undefined) {
                const href = await aTag.evaluateHandle(el => el.href);
                return href;
            }
            return 'null';
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getPageContentAndReturn(currentTab, randomLink, id) {
        await this.delay(5000);
        await this.delay(Math.floor(Math.random() * (2000 - 500) + 500));
        const imagePath = `C:\\Users\\Johny\\Desktop\\autobazar-eu-images\\${id}.png`;
        await currentTab.screenshot({ path: imagePath });
        const header = await this.getHeader(currentTab);
        const price = await this.getPrice(currentTab);
        const fuel = await this.getFuel(currentTab);
        const modelYear = await this.getModelYear(currentTab);
        const ccm = await this.getCcm(currentTab); 
        const mileage = await this.getMileage(currentTab);
        const VIN = await this.getVIN(currentTab);
        const bodyType = await this.getBodyType(currentTab);
        const gearbox = await this.getGearbox(currentTab);
        const power = await this.getPower(currentTab);
        const powerTrain = await this.getPowerTrain(currentTab);
        const color = await this.getColor(currentTab);
        const vehicleState = await this.getVehicleState(currentTab);
        const safetyFeatures = await this.getSafetyFeatures(currentTab);
        const comfortFeatures = await this.getComfortFeatures(currentTab);
        const otherFeature = await this.getOtherFeatures(currentTab);
        const moreFeatures = await this.getMoreFeatures(currentTab);
        const note = await this.getNote(currentTab);
        const location = await this.getLocation(currentTab);
        const pgConnection = new PgConnection();
        await pgConnection.executePgQuery(`INSERT INTO autobazar_eu_pupp (id,header,link,image_path,price,fuel,model_year,ccm,mileage,vin,body_type,gearbox,power,power_train,color,vehicle_state,safety_features,comfort_features,other_features,more_features,note,location) VALUES (${id},'${header}','${randomLink}','${imagePath}','${price}','${fuel}','${modelYear}','${ccm}','${mileage}','${VIN}','${bodyType}','${gearbox}','${power}','${powerTrain}','${color}','${vehicleState}','${safetyFeatures}','${comfortFeatures}','${otherFeature}','${moreFeatures}','${note}','${location}');`); 
        await this.randomizeBotInteractionWithOffer(currentTab);    
        await currentTab.close();
    }

    async randomizeBotInteractionWithOffer(currentTab) {
        await currentTab.mouse.wheel({ deltaY: 300});
        await this.delay(Math.floor(Math.random() * (3000 - 1500) + 1500));
        const interactor = new InteractionsWithAutobazarEu(currentTab);
        await interactor.scrollTo({ deltaY: 0 });
        await this.delay(Math.floor(Math.random() * (2000 - 500) + 500));
        await currentTab.mouse.wheel({ deltaY: 1200} );
        await this.delay(Math.floor(Math.random() * (500 - 300) + 300));
        await currentTab.mouse.wheel({ deltaY: 1300 });
        await this.delay(Math.floor(Math.random() * (500 - 300) + 300));
        await interactor.scrollTo({ deltaY: 1400 });
        await this.delay(Math.floor(Math.random() * (20000 - 5000) + 5000));
        await currentTab.mouse.wheel({ deltaY: 0 });
        await this.delay(Math.floor(Math.random() * (5000 - 2000) + 2000));
    }

    async goToPage(pageNum, brand) {
        try {
            var brandName = null;
            switch (brand) {
                case 'Škoda':
                    brandName = 'skoda';
                    break;
                case 'Volkswagen':
                    brandName = 'volkswagen';
                    break;
                case 'BMW':
                    brandName = 'bmw';
                    break;
                case 'Audi':
                    brandName = 'audi';
                    break;
                case 'Mercedes-Benz':
                    brandName = 'mercedes-benz';
                    break;
                default:
                    brandName = 'none';
                    break;
            }
            await this.delay(Math.random() * (10000 - 3000) + 3000);
            const pageATag = await this.page.$(`a[href$="&page=${pageNum}"]`);
            console.log(`a[href$="&page=${pageNum}"]`);
            await pageATag.click();
        } catch (error) {
            console.log(`Cannot go to the page: ${pageNum}`);
        }
    }

    async startScraping(startId) {
        const carBrands = ['Škoda', 'Volkswagen', 'Mercedes-Benz', 'Audi', "BMW"];
        const randCarBrandNum = Math.floor(Math.random() * 5);
        await this.delay(20000);
        await this.acceptCookies();
        await this.delay(Math.floor(Math.random() * (6000 - 5000) + 5000));
        const brand = carBrands[randCarBrandNum];
        const wasBrandPicked = await this.pickCarBrandFromImages(brand);
        if (wasBrandPicked === true) {
            console.log('Brand was not found. Aborting scraping...');
            return;
        }
        await this.confirmBrandSelection();
        await this.delay(Math.floor(Math.random() * 20000));
        await this.goToCarOffers();
        var currentId = startId;
        for (let i = this.startPage+1; i < this.endPage; i++) {
            await this.delay(Math.floor(Math.random() * (20000 - 12000) + 12000));
            const links = await this.getLinksToTraverse();
            const uncheckedLinks = await this.getUncheckedLinks(links);
            const buffer = await this.traverseSomeLinks(uncheckedLinks, currentId);
            await this.goToPage(i, brand);
            currentId = currentId + buffer;
        }
    }

}

export default AutobazarEuScraper;