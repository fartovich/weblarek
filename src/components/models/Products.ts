import { IProduct } from "../../types";

// Каталог товаров. Хранит массив всех товаров, доступных для покупки, и товар, выбранный для подробного просмотра.
export class Products {
  protected items: IProduct[] = [];
  protected selectedItem: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItem(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}
