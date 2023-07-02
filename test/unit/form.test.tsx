import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom'
import { screen} from '@testing-library/react';
import renderFunc from "./helper/renderFunc";
import {createStore} from "redux";
import mockCart from "./mock/cart";
import mockProducts from "./mock/details";

import React from "react";

describe("отправка формы", () => {
    it('проверка на коректный ввод в поля формы', () =>{
        renderFunc({
            initialRoute: "/cart",
            store: createStore(() => ({
                cart: mockCart.data,
                products: mockProducts.data,
                details: {},
            })),
        });
        const nameInput = screen.getByLabelText('Name');
        const phoneNumberInput = screen.getByLabelText('Phone');
        const addressInput = screen.getByLabelText('Address');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(phoneNumberInput, { target: { value: '1234567890' } });
        fireEvent.change(addressInput, { target: { value: '123 Main St' } });


        const submitButton = screen.getByText('Checkout');

        fireEvent.click(submitButton);

        expect(submitButton).toBeDisabled();
    })
})
