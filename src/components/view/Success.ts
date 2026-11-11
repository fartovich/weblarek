import { TSuccess } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { currency, eventNames } from "../../utils/constants";

// Сообщение об успешном оформлении заказа.
export class Success extends Component<TSuccess> {
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);
    this.descriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );

    this.closeButton.addEventListener("click", () => {
      this.events.emit(eventNames.successClose);
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} ${currency}`;
  }
}
