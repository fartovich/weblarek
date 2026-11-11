import { IModal } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { eventNames } from "../../utils/constants";

const activeModifier = "modal_active";

// Модальное окно. Показывает любой переданный в него контент.
export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );
    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );

    this.closeButton.addEventListener("click", () => {
      this.events.emit(eventNames.modalClose);
    });
    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.events.emit(eventNames.modalClose);
      }
    });
  }

  set content(element: HTMLElement) {
    this.contentElement.replaceChildren(element);
  }

  open(): void {
    this.container.classList.add(activeModifier);
  }

  close(): void {
    this.container.classList.remove(activeModifier);
    this.contentElement.replaceChildren();
  }
}
