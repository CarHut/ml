import * as cheerio from 'cheerio';

class AutobazarEuScraper {
    constructor (page, startPage, endPage, interactor) {
        this.page = page;
        this.startPage = startPage;
        this.endPage = endPage;
        this.interactor = interactor;
    }

    delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

    async acceptCookies() {
        try {
            await this.page.mouse.wheel({deltaY: 300});
            const buttonSelector = `button[class^="first-focusable-el"]`;
            await this.interactor.moveMouseToElement(buttonSelector);
            await this.delay(Math.floor(Math.random() * (2000 - 1500) + 1500));
            await this.page.click(buttonSelector);    
        } catch(error) {

        }
    }

    async goToCarOffers() {
        await this.delay(Math.floor(Math.random() * (3000 - 1500) - 1500));
        await this.page.mouse.wheel({deltaY: 100});
        await this.delay(Math.floor(Math.random() * (500 - 300) - 300));
        await this.page.mouse.wheel({deltaY: 300});
        await this.delay(Math.floor(Math.random() * (3000 - 1500) - 1500));
        const buttonSelector = `button[class^="button-search"]`;
        await this.interactor.moveMouseToElement(buttonSelector);
        await this.delay(Math.floor(Math.random() * (3000 - 1500) - 1500));
        await this.page.click(buttonSelector);
    }

    async pickCarBrandFromImages(brandName) {
        await this.interactor.moveMouseToElement(`button[id^="headlessui-listbox-button-:Rr92m2d7sm:"]`);
        await this.delay(Math.floor(Math.random() * (2000 - 1000) + 1000));
        await this.page.click(`button[id^="headlessui-listbox-button-:Rr92m2d7sm:"]`);
    
        await this.delay(Math.floor(Math.random() * (2000 - 1000) + 1000));
        const htmlContent = await this.page.content();
        const $ = cheerio.load(htmlContent);
        const imageButtonsParent = $(`div[class^="flex space-x-1"]`).children(`button[class^="flex-1"]`);

        let targetButton = null;
        imageButtonsParent.each((index, element) => {
            const alt = $(element).find('picture img').attr('alt');
            if (alt === brandName) {
                targetButton = element;
            }
        });
    
        if (targetButton) {
            console.log(targetButton);
            const buttonSelector = $(targetButton).toArray()[0].tagName === 'button' ? 'button' : '';
            await this.delay(Math.floor(Math.random() * (1500 - 1000) - 1000));
            await this.interactor.moveMouseToElement(buttonSelector);
            await this.delay(Math.floor(Math.random() * (1300 - 800) - 800));
            await this.page.click(buttonSelector);
            return true;
        }
    
        return false;
    }
    
    async confirmBrandSelection() {
        await this.delay(Math.floor(Math.random() * (1500 - 1000) - 1000));
        await this.interactor.moveMouseToElement(`button[class^="h-10 rounded-full bg-[#0071e3] p-0 leading-[30px] text-white w-[70%]"]`);
        await this.delay(Math.floor(Math.random() * (1500 - 1000) - 1000));
        await this.page.click(`button[class^="h-10 rounded-full bg-[#0071e3] p-0 leading-[30px] text-white w-[70%]"]`);
    }

    async startScraping(startId) {
        await this.delay(20000);
        await this.acceptCookies();
        await this.delay(Math.floor(Math.random() * (6000 - 5000) - 5000));
        const wasBrandPicked = await this.pickCarBrandFromImages(`Škoda`);
        if (wasBrandPicked === true) {
            console.log('Brand was not found. Aborting scraping...');
            return;
        }
        await this.confirmBrandSelection();
        await this.goToCarOffers();
    }

}

export default AutobazarEuScraper;