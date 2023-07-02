import {CartApi, ExampleApi} from "../../../src/client/api";
import {AxiosResponse} from "axios";
import {CartState, CheckoutFormData, CheckoutResponse, Product, ProductShortInfo} from "../../../src/common/types";
import {initStore} from "../../../src/client/store";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {Application} from "../../../src/client/Application";
import React from "react";

const productInfo = [{
    id: 1, name: 'banana', price: 10
}, {
    id: 2, name: 'apple', price: 20
}, {
    id: 3, name: 'orange', price: 30
}];

const productDescription = {
    description: "Some description",
    material: "glass",
    color: "white",
    id: 1,
    name: "cup",
    price: 200
};
const response = {
    status: 200,
    statusText: "OK",
    headers: {},
    config: {},
    request: {}
};
export const mockApi = (api: ExampleApi) => {

    api.getProducts = async (): Promise<AxiosResponse<ProductShortInfo[], any>> =>
        Promise.resolve({...response, data: productInfo});

    api.getProductById = async (id: number): Promise<AxiosResponse<Product, any>> =>
        Promise.resolve({...response, data: {...productDescription, id}});

    api.checkout = async (form: CheckoutFormData, cart: CartState): Promise<AxiosResponse<CheckoutResponse, any>> =>
        Promise.resolve({...response, data: {id: 2}});

}
export const mockCarts = (cart: CartApi) => {
    let cartProductsMock: CartState = {};
    cart.getState =  (): CartState => cartProductsMock;

    cart.setState =  (cart: CartState) => {
        cartProductsMock = {...cartProductsMock, ...cart};
    }
}
export const mockApp = (api: ExampleApi, cart: CartApi, initialRoute: string) => {
    mockApi(api);
    mockCarts(cart);

    const Store = initStore(api, cart);

    return (
        <BrowserRouter basename={initialRoute}>
            <Provider store={Store}>
                <Application/>
            </Provider>
        </BrowserRouter>
    );
}
