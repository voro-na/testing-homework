import {cleanup, render, screen, waitFor, within} from "@testing-library/react";
import '@testing-library/jest-dom'
import {createStore} from "redux";
import {initStore} from "../../src/client/store";
import mockCart from "./mock/cart";
import mockProducts from "./mock/details";
import React from "react";
import renderFunc from "./helper/renderFunc";
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {Cart} from "../../src/client/pages/Cart";
import {ProductDetails} from "../../src/client/components/ProductDetails";
import {fireEvent} from "@testing-library/dom";
import {CartApi, ExampleApi} from '../../src/client/api';
import {mockApi, mockCarts, mockApp} from "./helper/mockApp";


describe("Тестирование корзины с товарами", () => {

    it("в шапке должно отображаться количество не повторяющихся товаров в корзине", () => {

        renderFunc({
            initialRoute: "/cart",
            store: createStore(() => ({
                cart: mockCart.data,
                products: mockProducts.data,
                details: {},
            })),
        });
        const {getByRole} = screen;

        const link = getByRole("link", {
            name: /cart \(.*\)/i,
        });

        expect(link.textContent).toBe('Cart (2)');
    });

    it("в корзине должна отображаться таблица с добавленными в нее товарами", () => {
        renderFunc({
            initialRoute: "/cart",
            store: createStore(() => ({
                cart: mockCart.data,
                products: mockProducts.data,
                details: {},
            })),
        });
        Object.keys(mockCart.data).forEach((id) => {
            expect(screen.getByTestId(`${id}`)).toBeInTheDocument();
        });
    });
    it('Количество товара в корзине увеличивается при клике на "добавить в корзину"', async () => {
        const initialRoute = "/hw/store";
        const api = new ExampleApi(initialRoute);
        const cart = new CartApi();
        const productId = 1;

        mockApi(api);
        mockCarts(cart);
        const store = initStore(api, cart);

        const cartComponent = <BrowserRouter basename={initialRoute}>
            <Provider store={store}>
                <Cart/>
            </Provider>
        </BrowserRouter>

        const productComponent = <BrowserRouter basename={initialRoute}>
            <Provider store={store}>
                <ProductDetails product={{
                    id: 1,
                    name: "apple",
                    price: 100000,
                    description: "phone",
                    material: "black",
                    color: "black",
                }}/>
            </Provider>
        </BrowserRouter>

        const cartRender = render(cartComponent);
        const productRender = render(productComponent);

        const addToCartButton = await cartRender.findByTestId("add-to-cart");
        fireEvent.click(addToCartButton);

        await waitFor(() => {
            expect(productRender.queryByTestId(productId)).not.toBeNull();
        })
        const product = productRender.queryByTestId(productId);
        let amount = product?.querySelector(".Cart-Count")?.textContent;
        expect(amount).toBeDefined();

        fireEvent.click(addToCartButton);
        expect(product?.querySelector(".Cart-Count")?.textContent).toBe("2");

    });
    it("если корзина пустая, должна отображаться ссылка на каталог товаров", () => {
        renderFunc({initialRoute: "/cart"});
        const view = screen.getAllByText(
            /cart is empty\. please select products in the \./i
        )[0];
        const link = within(view).getByRole("link", {name: /catalog/i});

        expect(link).toBeInTheDocument();
    });

    beforeEach(() => {
        const initialRoute = '/hw/store';
        const api = new ExampleApi(initialRoute);
        const cart = new CartApi();
        const app = mockApp(api, cart, initialRoute);
        render(app);
    });
    afterEach(cleanup);
});
