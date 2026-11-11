import { IForm } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { eventNames } from "../../utils/constants";

// Базовая форма оформления заказа. Содержит общую для всех форм функциональность.
// Отправку формы, уведомление об изменении полей, активность кнопки и вывод ошибок.
export abstract class Form<T extends IForm> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  protected constructor(
    protected events: IEvents,
    protected readonly container: HTMLFormElement,
  ) {
    super(container);
    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );
    this.errorsElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );

    this.container.addEventListener("input", (event) => {
      const input = event.target as HTMLInputElement;
      this.events.emit(eventNames.formChange, { [input.name]: input.value });
    });
    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
