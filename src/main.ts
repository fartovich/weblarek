import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { LarekApi } from "./components/communication/LarekApi";
import { Buyer } from "./components/models/Buyer";
import { Cart } from "./components/models/Cart";
import { Products } from "./components/models/Products";
import { Basket } from "./components/view/Basket";
import { CardBasket } from "./components/view/CardBasket";
import { CardCatalog } from "./components/view/CardCatalog";
import { CardPreview } from "./components/view/CardPreview";
import { ContactsForm } from "./components/view/ContactsForm";
import { Gallery } from "./components/view/Gallery";
import { Header } from "./components/view/Header";
import { Modal } from "./components/view/Modal";
import { OrderForm } from "./components/view/OrderForm";
import { Success } from "./components/view/Success";
import { IBuyer, IOrderRequest, IProduct } from "./types";
import { API_URL, buttonLabels, CDN_URL, eventNames } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";

/* Шаблоны разметки */
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

/* Брокер событий, API и модели данных */
const events = new EventEmitter();
const larekApi = new LarekApi(new Api(API_URL));
const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

/* Компоненты представления */
const header = new Header(events, ensureElement<HTMLElement>(".header"));
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const modal = new Modal(events, ensureElement<HTMLElement>("#modal-container"));
const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
  onClick: () => events.emit(eventNames.cardToggle),
});
const basket = new Basket(events, cloneTemplate(basketTemplate));
const orderForm = new OrderForm(events, cloneTemplate(orderTemplate));
const contactsForm = new ContactsForm(events, cloneTemplate(contactsTemplate));
const success = new Success(events, cloneTemplate(successTemplate));

/* Вспомогательные функции презентера */

// Возвращает текст кнопки карточки просмотра в зависимости от наличия цены и товара в корзине
function getPreviewButtonText(product: IProduct): string {
  if (product.price === null) return buttonLabels.unavailable;
  return cartModel.hasItem(product.id) ? buttonLabels.remove : buttonLabels.buy;
}

// Собирает тексты ошибок для перечисленных полей покупателя в одну строку
function getErrorsText(fields: (keyof IBuyer)[]): string {
  const errors = buyerModel.validate();
  return fields
    .map((field) => errors[field])
    .filter(Boolean)
    .join("; ");
}

// Проверяет, что перечисленные поля покупателя заполнены без ошибок
function isFieldsValid(fields: (keyof IBuyer)[]): boolean {
  const errors = buyerModel.validate();
  return fields.every((field) => !errors[field]);
}

const orderFields: (keyof IBuyer)[] = ["payment", "address"];
const contactsFields: (keyof IBuyer)[] = ["email", "phone"];

// Готовит данные и перерисовывает форму первого шага
function renderOrderForm(): HTMLElement {
  const { payment, address } = buyerModel.getData();
  return orderForm.render({
    payment,
    address,
    valid: isFieldsValid(orderFields),
    errors: getErrorsText(orderFields),
  });
}

// Готовит данные и перерисовывает форму второго шага
function renderContactsForm(): HTMLElement {
  const { email, phone } = buyerModel.getData();
  return contactsForm.render({
    email,
    phone,
    valid: isFieldsValid(contactsFields),
    errors: getErrorsText(contactsFields),
  });
}

// Готовит данные и перерисовывает корзину
function renderBasket(): HTMLElement {
  const items = cartModel.getItems().map((product, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit(eventNames.basketRemove, product),
    });
    return card.render({
      index: index + 1,
      title: product.title,
      price: product.price,
    });
  });
  return basket.render({
    items,
    total: cartModel.getTotal(),
    buttonDisabled: cartModel.getCount() === 0,
  });
}

// Показывает переданный контент в модальном окне
function openModal(content: HTMLElement): void {
  modal.render({ content });
  modal.open();
}

/* Обработчики событий моделей данных */

// Если изменился каталог товаров, то перерисовываем галерею
events.on(eventNames.catalogChanged, () => {
  const cards = productsModel.getItems().map((product) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit(eventNames.cardSelect, product),
    });
    return card.render({
      title: product.title,
      price: product.price,
      image: CDN_URL + product.image,
      category: product.category,
    });
  });
  gallery.render({ catalog: cards });
});

// Если изменился выбранный товар, показываем его карточку в модальном окне
events.on(eventNames.previewChanged, () => {
  const product = productsModel.getSelectedItem();
  if (!product) return;
  openModal(
    cardPreview.render({
      title: product.title,
      price: product.price,
      image: CDN_URL + product.image,
      category: product.category,
      description: product.description,
      buttonText: getPreviewButtonText(product),
      buttonDisabled: product.price === null,
    }),
  );
});

// Если изменилось содержимое корзины, то обновляем счётчик и разметку корзины
events.on(eventNames.basketChanged, () => {
  header.render({ counter: cartModel.getCount() });
  renderBasket();
});

// Если изменились данные покупателя, то обновляем обе формы оформления
events.on(eventNames.buyerChanged, () => {
  renderOrderForm();
  renderContactsForm();
});

/* Обработчики событий представлений */

// Выбрана карточка в каталоге
events.on<IProduct>(eventNames.cardSelect, (product) => {
  productsModel.setSelectedItem(product);
});

// Нажата кнопка «Купить» или «Удалить из корзины» в карточке просмотра
events.on(eventNames.cardToggle, () => {
  const product = productsModel.getSelectedItem();
  if (!product) return;
  if (cartModel.hasItem(product.id)) {
    cartModel.removeItem(product);
  } else {
    cartModel.addItem(product);
  }
  modal.close();
});

// Нажата кнопка удаления товара в корзине
events.on<IProduct>(eventNames.basketRemove, (product) => {
  cartModel.removeItem(product);
});

// Нажата иконка корзины в шапке
events.on(eventNames.basketOpen, () => {
  openModal(renderBasket());
});

// Нажата кнопка «Оформить» в корзине
events.on(eventNames.orderOpen, () => {
  openModal(renderOrderForm());
});

// Изменены данные в одной из форм
events.on<Partial<IBuyer>>(eventNames.formChange, (data) => {
  buyerModel.setData(data);
});

// Нажата кнопка «Далее» в форме первого шага
events.on(eventNames.orderSubmit, () => {
  openModal(renderContactsForm());
});

// Нажата кнопка «Оплатить» в форме второго шага
events.on(eventNames.contactsSubmit, () => {
  const buyer = buyerModel.getData();
  if (!buyer.payment) return;

  const order: IOrderRequest = {
    ...buyer,
    payment: buyer.payment,
    total: cartModel.getTotal(),
    items: cartModel.getItems().map((product) => product.id),
  };

  larekApi
    .createOrder(order)
    .then((response) => {
      openModal(success.render({ total: response.total }));
      cartModel.clear();
      buyerModel.clear();
    })
    .catch((error) => console.error("Ошибка оформления заказа", error));
});

// Нажата кнопка «За новыми покупками!»
events.on(eventNames.successClose, () => {
  modal.close();
});

// Клик по крестику или вне модального окна
events.on(eventNames.modalClose, () => {
  modal.close();
});

/* Загрузка каталога с сервера */
larekApi
  .getProducts()
  .then((response) => productsModel.setItems(response.items))
  .catch((error) => console.error("Ошибка загрузки каталога", error));
