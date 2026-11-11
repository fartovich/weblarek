import { IHeader } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { eventNames } from "../../utils/constants";

// Шапка страницы. Кнопка открытия корзины и счётчик товаров в корзине.
export class Header extends Component<IHeader> {
  protected basketButton: HTMLButtonElement;
  protected counterElement: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );
    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container,
    );

    this.basketButton.addEventListener("click", () => {
      this.events.emit(eventNames.basketOpen);
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
