class InteractionsWithAutobazarEu {
    constructor(page) {
        this.page = page
    }

    delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

    async randomScrollDownThenUp() {
        await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        await this.page.evaluate(() => {
            window.scrollBy(0, 1200);
        });
        const randomDelay = Math.floor(Math.random() * (1000 - 700) + 700) 
        this.delay(randomDelay);
        await this.page.evaluate(() => {
            window.scrollBy(0, 0);
        });
    }

    async scrollTo(to) {
        await this.page.evaluate((to) => {
            window.scrollBy(0, to);
        }, to);
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

export default InteractionsWithAutobazarEu;