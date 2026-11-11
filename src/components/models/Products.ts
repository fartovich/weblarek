import { IProduct } from "../../types";
import { IEvents } from "../base/Events";
import { eventNames } from "../../utils/constants";

// Каталог товаров. Хранит массив всех товаров, доступных для покупки, и товар, выбранный для подробного просмотра.
export class Products {
  protected items: IProduct[] = [];
  protected selectedItem: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit(eventNames.catalogChanged);
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItem(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
    this.events.emit(eventNames.previewChanged);
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}
