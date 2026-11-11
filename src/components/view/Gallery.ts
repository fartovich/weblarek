import { IGallery } from "../../types";
import { Component } from "../base/Component";

// Каталог товаров на главной странице. Выводит переданные карточки.
export class Gallery extends Component<IGallery> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set catalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}
