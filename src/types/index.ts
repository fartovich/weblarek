export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

// Способ оплаты заказа: онлайн-картой или наличными при получении
export type TPayment = "card" | "cash";

// Описывает товар, который можно купить в магазине
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Описывает данные покупателя, которые он указывает при оформлении заказа
export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

// Результат валидации данных покупателя. Ключ — имя поля из `IBuyer`, значение — текст ошибки. Если поле заполнено верно, ключа в объекте нет. Пустой объект означает, что все данные валидны
export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

// Ответ сервера на запрос товаров GET /product/
export interface IProductListResponse {
  total: number;
  items: IProduct[];
}

// Данные заказа, которые отправляются на сервер запросом POST /order/. Расширяет IBuyer, поэтому данные покупателя не описываются повторно. Способ оплаты в заказе обязателен
export interface IOrderRequest extends IBuyer {
  payment: TPayment;
  total: number;
  items: string[];
}

// Ответ сервера на успешное оформление заказа
export interface IOrderResponse {
  id: string;
  total: number;
}
