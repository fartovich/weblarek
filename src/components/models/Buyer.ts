import { IBuyer, TBuyerErrors, TPayment } from "../../types";

const errorMessages: Record<keyof IBuyer, string> = {
  payment: "Не выбран вид оплаты",
  address: "Необходимо указать адрес",
  email: "Укажите Email",
  phone: "Укажите телефон",
};

// Данные покупателя. Хранит данные, которые покупатель указывает при оформлении заказа, и проверяет их на валидность.
export class Buyer {
  protected payment: TPayment | null = null;
  protected address = "";
  protected email = "";
  protected phone = "";

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.address !== undefined) this.address = data.address;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  clear(): void {
    this.payment = null;
    this.address = "";
    this.email = "";
    this.phone = "";
  }

  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};
    if (!this.payment) errors.payment = errorMessages.payment;
    if (!this.address.trim()) errors.address = errorMessages.address;
    if (!this.email.trim()) errors.email = errorMessages.email;
    if (!this.phone.trim()) errors.phone = errorMessages.phone;
    return errors;
  }
}
