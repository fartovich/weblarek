import { TCard } from "../../types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { categoryMap, currency, priceless } from "../../utils/constants";

type TCategory = keyof typeof categoryMap;

// Базовая карточка товара. Содержит общую для всех карточек функциональность. Название и цену.
export abstract class Card<T extends TCard> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  protected constructor(container: HTMLElement) {
    super(container);
    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container,
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container,
    );
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent =
      value === null ? priceless : `${value} ${currency}`;
  }

  // Устанавливает текст категории и модификатор цвета её фона
  protected setCategory(element: HTMLElement, value: string): void {
    element.textContent = value;
    Object.values(categoryMap).forEach((modifier) =>
      element.classList.remove(modifier),
    );
    const modifier = categoryMap[value as TCategory];
    if (modifier) {
      element.classList.add(modifier);
    }
  }
}
