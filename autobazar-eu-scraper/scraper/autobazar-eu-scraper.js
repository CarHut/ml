import PgConnection from '../postgres-util/pg-util.js';

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
        for (const page of pages) {
            if (await page.url() === url) {
                await page.bringToFront();
                return;
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
        await this.interactor.moveMouseToElement(`img[alt^="Škoda"]`);
        await this.delay(Math.floor(Math.random() * (1000 - 500) + 500));
        await this.page.click(`img[alt^="Škoda"]`);
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
            await this.delay(Math.floor(Math.random() * (15000 - 4500) + 4500));
            const fixedHref = randomLink.split("https://www.autobazar.eu")[1];
            const parentSelector = `a[href^="${fixedHref}"]`;
            await this.interactor.moveMouseToElement(parentSelector);
            await this.delay(1000);
            await this.page.click(parentSelector);
            await this.openRightTab(randomLink);
            await this.getPageContentAndReturn(randomLink, id + currentOfferIdBuffer);
            currentOfferIdBuffer = currentOfferIdBuffer + 1;
        }

        return currentOfferIdBuffer;
    }

    async getHeader() {
        try {
            const h1 =  await this.page.$('h1');
            const header = await h1.evaluate(node => node.innerText);
            return header;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getPrice() {
        try {
            const priceElement = await this.page.$(`div[id="price"]`);
            const price = await priceElement.evaluate(node => node.innerText);
            return price;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getFuel() {
        try {
            const fuelSpan = await this.page.$eval('span', (el) => {
                return el.textContent.includes('Palivo');
            });
            const previousSibling = await fuelSpan.evaluate(el => el.previousElementSibling);
            const fuel = await previousSibling.evaluate(node => node.innerText);
            return fuel;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getModelYear() {
        try {
            const modelYearSpan = await this.page.$eval('span', (el) => {
                return el.textContent.includes('Rok výroby');
            });
            const previousSibling = await modelYearSpan.evaluate(el => el.previousElementSibling);
            const modelYear = await previousSibling.evaluate(node => node.innerText);
            return modelYear;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getCcm() {
        try {
            const ccmSpan = await this.page.$eval('span', (el) => {
                return el.textContent.includes('Objem motora');
            });
            const previousSibling = await ccmSpan.evaluate(el => el.previousElementSibling);
            const ccm = await previousSibling.evaluate(node => node.innerText);
            return ccm;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getMileage() {
        try {
            const mileageSpan = await this.page.$eval('span', (el) => {
                return el.textContent.includes('Kilometre');
            });
            const previousSibling = await mileageSpan.evaluate(el => el.previousElementSibling);
            const mileage = await previousSibling.evaluate(node => node.innerText);
            return mileage;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getVIN() {
        try {
            const vinSpan = await this.page.$eval('span', (el) => {
                return el.textContent.includes('VIN');
            });
            const previousSibling = await vinSpan.evaluate(el => el.previousElementSibling);
            const vin = await previousSibling.evaluate(node => node.innerText);
            return vin;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getBodyType() {
        try {
            const bodyTypeSpan = await this.page.$eval('span', (el) => {
                return el.textContent.includes('Karoséria');
            });
            const previousSibling = await bodyTypeSpan.evaluate(el => el.previousElementSibling);
            const bodyType = await previousSibling.evaluate(node => node.innerText);
            return bodyType;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getGearbox() {
        try {
            const gearboxSpan = await this.page.$eval('span', (el) => {
                return el.textContent.includes('Prevodovka');
            });
            const previousSibling = await gearboxSpan.evaluate(el => el.previousElementSibling);
            const gearbox = await previousSibling.evaluate(node => node.innerText);
            return gearbox;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getPower() {
        try {
            const powerSpan = await this.page.$eval('span', (el) => {
                return el.textContent.includes('Výkon');
            });
            const previousSibling = await powerSpan.evaluate(el => el.previousElementSibling);
            const power = await previousSibling.evaluate(node => node.innerText);
            return power;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getPowerTrain() {
        try {
            const powerTrainSpan = await this.page.$eval('span', (el) => {
                return el.textContent.includes('Pohon');
            });
            const previousSibling = await powerTrainSpan.evaluate(el => el.previousElementSibling);
            const powerTrain = await previousSibling.evaluate(node => node.innerText);
            return powerTrain;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getColor() {
        try {
            const colorSpan = await this.page.$eval('span', (el) => {
                return el.textContent.includes('Farba');
            });
            const previousSibling = await colorSpan.evaluate(el => el.previousElementSibling);
            const color = await previousSibling.evaluate(node => node.innerText);
            return color;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getVehicleState() {
        try {
            const vehicleStateH2 = await this.page.$eval('h2', (el) => {
                return el.textContent.includes('Stav vozidla');
            });
            const followingSiblingHtml = await vehicleStateH2.evaluate(el => el.nextElementSibling ? el.nextElementSibling.outerHTML : 'null');
            return followingSiblingHtml;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getSafetyFeatures() {
        try {
            const featuresH3 = await this.page.$eval('h3', (el) => {
                return el.textContent.includes('Bezpečnosť');
            });
            const followingSiblingHtml = await featuresH3.evaluate(el => el.nextElementSibling ? el.nextElementSibling.outerHTML : 'null');
            return followingSiblingHtml;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getComfortFeatures() {
        try {
            const featuresH3 = await this.page.$eval('h3', (el) => {
                return el.textContent.includes('Komfort');
            });
            const followingSiblingHtml = await featuresH3.evaluate(el => el.nextElementSibling ? el.nextElementSibling.outerHTML : 'null');
            return followingSiblingHtml;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getOtherFeatures() {
        try {
            const featuresH3 = await this.page.$eval('h3', (el) => {
                return el.textContent.includes('Ostatné');
            });
            const followingSiblingHtml = await featuresH3.evaluate(el => el.nextElementSibling ? el.nextElementSibling.outerHTML : 'null');
            return followingSiblingHtml;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getMoreFeatures() {
        try {
            const featuresH3 = await this.page.$eval('h3', (el) => {
                return el.textContent.includes('Ďalšia výbava');
            });
            const followingSiblingHtml = await featuresH3.evaluate(el => el.nextElementSibling ? el.nextElementSibling.outerHTML : 'null');
            return followingSiblingHtml;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getNote() {
        try {
            const noteH2 = await this.page.$eval('h2', (el) => {
                return el.textContent.includes('Poznámka');
            });
            const followingSiblingHtml = await noteH2.evaluate(el => el.nextElementSibling ? el.nextElementSibling.outerHTML : 'null');
            return followingSiblingHtml;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getLocation() {
        try {
            const locationHref = await this.page.$eval('a', (el) => {
                return el.href.includes('https://maps.google.com/');
            });
            const location = await locationHref.evaluate(el => el.href);
            return location;
        } catch (error) {
            console.log(error);
            return 'null';
        }
    }

    async getPageContentAndReturn(randomLink, id) {
        await this.delay(5000);
        await this.delay(Math.floor(Math.random() * (2000 - 500) + 500));
        const imagePath = `C:\\Users\\Johny\\Desktop\\autobazar-eu-images\\${id}.png`;
        await this.page.screenshot({ path: imagePath });
        const header = await this.getHeader();
        const price = await this.getPrice();
        const fuel = await this.getFuel();
        const modelYear = await this.getModelYear();
        const ccm = await this.getCcm(); 
        const mileage = await this.getMileage();
        const VIN = await this.getVIN();
        const bodyType = await this.getBodyType();
        const gearbox = await this.getGearbox();
        const power = await this.getPower();
        const powerTrain = await this.getPowerTrain();
        const color = await this.getColor();
        const vehicleState = await this.getVehicleState();
        const safetyFeatures = await this.getSafetyFeatures();
        const comfortFeatures = await this.getComfortFeatures();
        const otherFeature = await this.getOtherFeatures();
        const moreFeatures = await this.getMoreFeatures();
        const note = await this.getNote();
        const location = await this.getLocation();
        const pgConnection = new PgConnection();
        await pgConnection.executePgQuery(`INSERT INTO autobazar_eu_pupp (id,header,link,image_path,price,fuel,model_year,ccm,mileage,vin,body_type,gearbox,power,power_train,color,vehicle_state,safety_features,comfort_features,other_features,more_features,note,location) VALUES (${id},${header},${randomLink},${imagePath},${price},${fuel},${modelYear},${ccm},${mileage},${VIN},${bodyType},${gearbox},${power},${powerTrain},${color},${vehicleState},${safetyFeatures},${comfortFeatures},${otherFeature},${moreFeatures},${note},${location});`); 
        await this.randomizeBotInteractionWithOffer();    
        await this.page.close();
    }

    async randomizeBotInteractionWithOffer() {
        await this.page.mouse.wheel({ deltaY: 300});
        await this.delay(Math.floor(Math.random() * (3000 - 1500) + 1500));
        await this.interactor.scrollTo({ deltaY: 0 });
        await this.delay(Math.floor(Math.random() * (2000 - 500) + 500));
        await this.page.mouse.wheel({ deltaY: 1200} );
        await this.delay(Math.floor(Math.random() * (500 - 300) + 300));
        await this.page.mouse.wheel({ deltaY: 1300 });
        await this.delay(Math.floor(Math.random() * (500 - 300) + 300));
        await this.interactor.scrollTo({ deltaY: 1400 });
        await this.delay(Math.floor(Math.random() * (20000 - 5000) + 5000));
        await this.page.mouse.wheel({ deltaY: 0 });
        await this.delay(Math.floor(Math.random() * (5000 - 2000) + 2000));
        await this.page.goBack(); 
        await this.delay(10000);
    }

    async goToPage(pageNum) {
        try {
            await this.delay(Math.random() * (10000 - 3000) + 3000)
            const pageATag = await this.page.$eval('a', (el) => {
                return el.innerText === pageNum;
            });
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
        const wasBrandPicked = await this.pickCarBrandFromImages(carBrands[randCarBrandNum]);
        if (wasBrandPicked === true) {
            console.log('Brand was not found. Aborting scraping...');
            return;
        }
        await this.confirmBrandSelection();
        await this.goToCarOffers();
        var currentId = startId;
        for (let i = this.startPage+1; i < this.endPage; i++) {
            await this.delay(Math.floor(Math.random() * (20000 - 12000) + 12000));
            const links = await this.getLinksToTraverse();
            const uncheckedLinks = await this.getUncheckedLinks(links);
            const buffer = await this.traverseSomeLinks(uncheckedLinks, currentId);
            await this.goToPage(i);
            currentId = currentId + buffer;
        }
    }

}

export default AutobazarEuScraper;