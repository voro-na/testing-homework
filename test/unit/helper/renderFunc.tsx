import {Provider} from "react-redux";
import {MemoryRouter} from "react-router-dom";
import {Application} from "../../../src/client/Application";
import {createStore} from "redux";
import {render} from "@testing-library/react";
import React from "react";

interface renderProps {
    initialRoute?: string;
    store?: any;
}

const renderFunc = ({
                    initialRoute = "/",
                    store = createStore(() => ({
                        products: {},
                        cart: {},
                        details: {},
                    })),
                }: renderProps) => {
    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={[initialRoute]}>
                <Application/>
            </MemoryRouter>
        </Provider>
    );
};

export default renderFunc;
