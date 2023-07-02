import {CartApi, ExampleApi} from "../../src/client/api";
import {render} from "@testing-library/react";
import {fireEvent} from "@testing-library/dom";
import {mockApp} from "./helper/mockApp";

describe("на ширине меньше 576px навигационное меню должно скрываться за гамбургер", () => {
    let width = global.innerWidth;

    it('При клике на кнопку бургера меню открывается и закрывается при клике на элемент меню-бургера', async () => {
        global.innerWidth = 480;

        const route = '/hw/store';
        const api = new ExampleApi(route);
        const cart = new CartApi();
        const app = mockApp(api, cart, route);

        const { getByTestId } = render(app);
        let navbar = getByTestId("navbar-menu");
        let burgerBtn = getByTestId("burget-toggler");

        if (burgerBtn) {
            fireEvent.click(burgerBtn);
        }
        expect(navbar.className.split(' ')).not.toContain('collapse');

        const burgerLinks = navbar.querySelectorAll("a.nav-link");
        if (burgerLinks.length > 0) {
            fireEvent.click(burgerLinks[burgerLinks.length - 1]);
        }
        expect(navbar.className.split(' ')).toContain('collapse');
    });

    afterAll(() => {
        global.innerWidth = width;
    });
});
