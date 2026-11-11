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

/* ---------- Типы слоя представления ---------- */
/* Новые типы построены на основе уже объявленных и не изменяют их */

// Обработчик действия пользователя, который компонент получает в конструкторе
export interface ICardActions {
  onClick: () => void;
}

// Данные шапки страницы
export interface IHeader {
  counter: number;
}

// Данные каталога на главной странице
export interface IGallery {
  catalog: HTMLElement[];
}

// Данные модального окна
export interface IModal {
  content: HTMLElement;
}

// Общие данные всех карточек товара
export type TCard = Pick<IProduct, "title" | "price">;

// Данные карточки в каталоге
export type TCardCatalog = TCard & Pick<IProduct, "image" | "category">;

// Данные карточки для подробного просмотра
export type TCardPreview = TCardCatalog &
  Pick<IProduct, "description"> & {
    buttonText: string;
    buttonDisabled: boolean;
  };

// Данные карточки в корзине
export type TCardBasket = TCard & {
  index: number;
};

// Данные корзины
export interface IBasket {
  items: HTMLElement[];
  total: number;
  buttonDisabled: boolean;
}

// Общие данные всех форм
export interface IForm {
  valid: boolean;
  errors: string;
}

// Данные формы первого шага. Способ оплаты и адрес
export type TOrderForm = IForm & Pick<IBuyer, "payment" | "address">;

// Данные формы второго шага. Почта и телефон
export type TContactsForm = IForm & Pick<IBuyer, "email" | "phone">;

// Данные сообщения об успешном заказе
export type TSuccess = Pick<IOrderResponse, "total">;
