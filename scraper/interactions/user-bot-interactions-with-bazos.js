import mainPageLinks from "./util/bazos-main-page-links.js";

class InteractionsWithBazos {
    constructor(page) {
        this.page = page
    }

    delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

    async randomScrollDownThenUp() {
        await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        await this.page.evaluate(() => {
            window.scrollBy(0, 100);
        });
        const randomDelay = Math.floor(Math.random() * (1000 - 700) + 700) 
        this.delay(randomDelay);
        await this.page.evaluate(() => {
            window.scrollBy(100, 0);
        });
    }

    interactWithBazosMainMenuOptions = async (numberOfHoverOns) => {
        const pickedMainPageHeaders = [];
        while (pickedMainPageHeaders.length < numberOfHoverOns) {
            const randomNumber = Math.floor(Math.random() * 20);
            if (pickedMainPageHeaders.some(header => header === mainPageLinks[randomNumber])) {
                continue;
            } else {
                pickedMainPageHeaders.push(mainPageLinks[randomNumber]);
            }
        }

        console.log(pickedMainPageHeaders);

        for (let i = 0; i < pickedMainPageHeaders.length; i++) {
            await this.moveMouseToElement(`[href^="${pickedMainPageHeaders[i]}"]`);
            const randDelay = Math.floor(Math.random() * (1500 - 700) + 700);
            await this.delay(randDelay);
        }

        // lastly it should be at auto.bazos.sk
        await this.moveMouseToElement(`[href^="https://auto.bazos.sk/"]`);

    }

    moveMouseToElement = async (selector) => {
        // Get the bounding box of the element
        const element = await this.page.$(selector); // Get the element using the selector
        if (element) {
            const boundingBox = await element.boundingBox(); // Get the element's bounding box (position)
            if (boundingBox) {
                const { x, y } = boundingBox;
                await this.page.mouse.move(x + boundingBox.width / 2, y + boundingBox.height / 2); // Move mouse to center of the element
            }
        }
    };
}

export default InteractionsWithBazos;