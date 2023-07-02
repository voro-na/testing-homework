const INITIAL_ROUTE = 'http://localhost:3000/hw/store';

describe("Тестирование корзины", async function() {
    it("Пустая корзина", async function() {
        await this.browser.url(INITIAL_ROUTE + '/cart');
        await this.browser.setWindowSize(1920, 1040);

        await this.browser.assertView('верстка страницы', 'body', {
        });
    });

    it("Корзина с товаром", async function() {
        const productId = 0;
        await this.browser.url(INITIAL_ROUTE + '/catalog' + `/${productId}`);
        await this.browser.setWindowSize(1920, 1040);
        const puppeteer = await this.browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.click(".ProductDetails-AddToCart");
        await this.browser.url(INITIAL_ROUTE + '/cart');

        await this.browser.assertView('верстка страницы', 'body', {
            ignoreElements: [".Cart-Table"],
        });
    });

    it('При клике на кнопку "Очистить" корзина пустая', async function() {
        const productId = 0;
        await this.browser.url(INITIAL_ROUTE + '/catalog' + `/${productId}`);
        await this.browser.setWindowSize(1920, 1040);
        const puppeteer = await this.browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.click(".ProductDetails-AddToCart");
        await this.browser.pause(1000);
        await this.browser.url(INITIAL_ROUTE + '/cart');

        await page.click(".Cart-Clear");
        await this.browser.pause(1000);

        await this.browser.assertView('верстка страницы', 'body');
    });

    it('После отправки формы появляется сообщение с номером заказа.', async function() {
        const productId = 2;
        await this.browser.url(INITIAL_ROUTE + '/catalog' + `/${productId}`);
        await this.browser.setWindowSize(1920, 1040);
        const puppeteer = await this.browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.click(".ProductDetails-AddToCart");
        await this.browser.pause(1000);
        await this.browser.url(INITIAL_ROUTE + '/cart');

        await page.focus(".Form-Field_type_name");
        await page.keyboard.type("cool goose");

        await page.focus(".Form-Field_type_phone");
        await page.keyboard.type("1234567898");

        await page.focus(".Form-Field_type_address");
        await page.keyboard.type("top of the world");

        await page.click(".Form-Submit");
        await this.browser.pause(1000);

        await this.browser.assertView('верстка страницы', 'body', {
            ignoreElements: [".Cart-Number"]
        });
    });
});

describe("Тестирование страницы товара.", async function() {
    it("Подробная страница товара, ширина более 576px.", async function() {
        const productId = 1;
        await this.browser.url(INITIAL_ROUTE + '/catalog' + `/${productId}`);
        await this.browser.setWindowSize(1920, 1040);
        const puppeteer = await this.browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.evaluate(() => {
            document.querySelector(".ProductDetails-Name").textContent = "название товара";
            document.querySelector(".ProductDetails-Description").textContent = "Тут должно быть описание";
            document.querySelector(".ProductDetails-Price").textContent = "$10";
            document.querySelector(".ProductDetails-Color").textContent = "Белый";
            document.querySelector(".ProductDetails-Material").textContent = "Стекло";
        });
        await this.browser.assertView('верстка страницы', 'body');
    });

    it("Подробная страница товара, ширина менее 576px.", async function() {
        const productId = 0;
        await this.browser.url(INITIAL_ROUTE + '/catalog' + `/${productId}`);
        await this.browser.setWindowSize(480, 1110);
        const puppeteer = await this.browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.evaluate(() => {
            document.querySelector(".ProductDetails-Name").textContent = "название товара";
            document.querySelector(".ProductDetails-Description").textContent = "Тут должно быть описание";
            document.querySelector(".ProductDetails-Price").textContent = "$10";
            document.querySelector(".ProductDetails-Color").textContent = "белый";
            document.querySelector(".ProductDetails-Material").textContent = "Стекло";
        });
        await this.browser.assertView('верстка страницы', 'body');
    });
});

describe("Тестирование главной страницы.", async function() {
    it("Главная страница, ширина более 576px.", async function() {
        await this.browser.url(INITIAL_ROUTE);
        await this.browser.setWindowSize(1920, 1080);
        await this.browser.assertView('верстка страницы', 'body');
    });

    it("Подробная страница товара, ширина менее 576px.", async function() {
        await this.browser.url(INITIAL_ROUTE);
        await this.browser.setWindowSize(480, 1310);
        await this.browser.assertView('верстка страницы', 'body');
    });
});

describe("Тестирование страницы условий доставки.", async function() {
    it("Условия доставки, ширина более 576px.", async function() {
        await this.browser.url(INITIAL_ROUTE + "/delivery");
        await this.browser.setWindowSize(1920, 1080);
        await this.browser.assertView('верстка страницы', 'body');
    });

    it("Условия доставки, ширина менее 576px.", async function() {
        await this.browser.url(INITIAL_ROUTE + "/delivery");
        await this.browser.setWindowSize(480, 1310);
        await this.browser.assertView('верстка страницы', 'body');
    });
});

describe("Тестирование страницы с контактами.", async function() {
    it("Контакты, ширина более 576px.", async function() {
        await this.browser.url(INITIAL_ROUTE + "/contacts");
        await this.browser.setWindowSize(1920, 1080);
        await this.browser.assertView('верстка страницы', 'body');
    });

    it("Контакты, ширина менее 576px.", async function() {
        await this.browser.url(INITIAL_ROUTE + "/contacts");
        await this.browser.setWindowSize(480, 1310);
        await this.browser.assertView('верстка страницы', 'body');
    });
});

describe("Тестирование каталога.", async function() {
    it("Каталог, ширина более 576px. ", async function() {
        await this.browser.url(INITIAL_ROUTE + '/catalog');
        await this.browser.setWindowSize(1920, 1040);
        const puppeteer = await this.browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.evaluate(() => {
            const titles = document.querySelectorAll(".ProductItem-Name");
            titles.forEach(title => {
                if (title.textContent) {
                    title.textContent = "название";
                }
            });
        });

        await this.browser.assertView('верстка страницы', 'body', {
            ignoreElements: [".ProductItem-Price"],
            compositeImage: false,
            allowViewportOverflow: true
        });
    });

    it("Каталог, ширина менее 576px.", async function() {
        await this.browser.url(INITIAL_ROUTE + '/catalog');
        await this.browser.setWindowSize(480, 30440);
        const puppeteer = await this.browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.evaluate(() => {
            const titles = document.querySelectorAll(".ProductItem-Name");
            titles.forEach(title => {
                if (title.textContent) {
                    title.textContent = "название";
                }
            });
        });

        await this.browser.assertView('верстка страницы', 'body', {
            ignoreElements: [".ProductItem-Price"],
            compositeImage: false,
            allowViewportOverflow: true,
            screenshotDelay: 1000,
        });
    });
});
