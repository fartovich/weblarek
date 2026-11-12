import { ICardActions, TCardCatalog } from "../../types";
import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";

type TCategory = keyof typeof categoryMap;

// Карточка товара в каталоге на главной странице. Вся карточка это кнопка выбора товара для просмотра.
export class CardCatalog extends Card<TCardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );

    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }

  set image(value: string) {
    this.setImage(
      this.imageElement,
      value,
      this.titleElement.textContent ?? "",
    );
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    Object.values(categoryMap).forEach((modifier) =>
      this.categoryElement.classList.remove(modifier),
    );
    const modifier = categoryMap[value as TCategory];
    if (modifier) {
      this.categoryElement.classList.add(modifier);
    }
  }
}
