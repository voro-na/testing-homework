import {CartApi, ExampleApi} from "../../src/client/api";
import {ReactElement} from "react";
import {render} from "@testing-library/react";
import {fireEvent} from "@testing-library/dom";
import {mockApp} from "./helper/mockApp";

describe("Отображение товаров в каталоге", () => {
    let api: ExampleApi;
    let cart: CartApi;
    let initialRoute = "/hw/store";
    let app: ReactElement;

    beforeEach(() => {
        api = new ExampleApi(initialRoute);
        cart = new CartApi();
        app = mockApp(api, cart, initialRoute);
    });

    it("Названия товаров на странице совпадают с данными сервера", async () => {
        const { findAllByTestId, getByTestId } = render(app);

        const catalogLink = getByTestId("catalog-link");
        fireEvent.click(catalogLink);

        const productsFromApi = await api.getProducts().then(response => response.data);
        const productsOnPage = await findAllByTestId(/([0-9]+)/).then(products => products.map(prod => prod.querySelector('h5')?.textContent));

        for (let i = 0; i < productsOnPage.length; i++) {
            const productOnPageTitle = productsOnPage[i];
            const productsFromApiTitles = productsFromApi.map(item => item.name);
            expect(productsFromApiTitles).toContain(productOnPageTitle);
        }
    });

    it("Каждый товар в каталоге содержит название, цену и ссылку на страницу товара", async () => {
        const { findAllByTestId, getByTestId } = render(app);
        const catalogLink = getByTestId("catalog-link");
        fireEvent.click(catalogLink);
        const products = await findAllByTestId(/([0-9]+)/);

        for (const product of products) {

            const title = product.querySelector('.card-title');
            const price = product.querySelector('.card-text');
            const link = product.querySelector('.card-link');

            expect(title).toBeDefined();
            expect(price).toBeDefined();
            expect(link).toBeDefined();
            expect(link?.getAttribute('href')).toBeTruthy();
        }
    });

    it('Страница товара содержит описание товара, кнопку "добавить в корзину"', async () => {
        const { findByTestId, findAllByTestId, getByTestId } = render(app);
        const catalogLink = getByTestId("catalog-link");
        fireEvent.click(catalogLink);
        const products = await findAllByTestId(/([0-9]+)/);

        if (products.length > 0) {
            const productLink = products[products.length - 1].querySelector('.card-link');
            if (productLink) {
                fireEvent.click(productLink);
                const productFullPage = await findByTestId("product-detail");

                const title = productFullPage.querySelector('.ProductDetails-Name');
                const description = productFullPage.querySelector('.ProductDetails-Description');
                const price = productFullPage.querySelector('.ProductDetails-Price');
                const color = productFullPage.querySelector('.ProductDetails-Color');
                const material = productFullPage.querySelector('.ProductDetails-Material');
                const btn = productFullPage.querySelector('.ProductDetails-AddToCart');

                expect(title).toBeTruthy();
                expect(description).toBeTruthy();
                expect(price).toBeTruthy();
                expect(color).toBeTruthy();
                expect(material).toBeTruthy();
                expect(btn).toBeTruthy();
            }
        }
    });
});
