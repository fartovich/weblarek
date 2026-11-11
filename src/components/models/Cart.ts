import { IProduct } from "../../types";
import { IEvents } from "../base/Events";
import { eventNames } from "../../utils/constants";

// Корзина. Хранит товары, которые покупатель выбрал для покупки.
export class Cart {
  protected items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    if (!this.hasItem(item.id)) {
      this.items.push(item);
      this.events.emit(eventNames.basketChanged);
    }
  }

  removeItem(item: IProduct): void {
    this.items = this.items.filter((cartItem) => cartItem.id !== item.id);
    this.events.emit(eventNames.basketChanged);
  }

  clear(): void {
    this.items = [];
    this.events.emit(eventNames.basketChanged);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
