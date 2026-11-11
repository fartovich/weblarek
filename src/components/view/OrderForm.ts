import { TOrderForm, TPayment } from "../../types";
import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { eventNames } from "../../utils/constants";

const activePaymentModifier = "button_alt-active";

// Форма первого шага оформления. Выбор способа оплаты и ввод адреса доставки.
export class OrderForm extends Form<TOrderForm> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);
    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      ".order__buttons .button",
      this.container,
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    );

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.events.emit(eventNames.formChange, {
          payment: button.name as TPayment,
        });
      });
    });
  }

  set payment(value: TPayment | null) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle(activePaymentModifier, button.name === value);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
