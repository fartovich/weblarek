import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { LarekApi } from "./components/communication/LarekApi";
import { Buyer } from "./components/models/Buyer";
import { Cart } from "./components/models/Cart";
import { Products } from "./components/models/Products";
import { API_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";

const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();
const larekApi = new LarekApi(new Api(API_URL));

// Каталог товаров
productsModel.setItems(apiProducts.items);
console.log("Каталог: массив товаров", productsModel.getItems());

const [firstProduct, secondProduct, unpricedProduct] = productsModel.getItems();

console.log(
  "Каталог: товар по id",
  firstProduct.id,
  productsModel.getItem(firstProduct.id),
);
console.log(
  "Каталог: товар по несуществующему id",
  productsModel.getItem("unknown-id"),
);

console.log(
  "Каталог: выбранный товар до выбора",
  productsModel.getSelectedItem(),
);
productsModel.setSelectedItem(secondProduct);
console.log(
  "Каталог: выбранный товар после выбора",
  productsModel.getSelectedItem(),
);

// Корзина
console.log("Корзина: товары в пустой корзине", cartModel.getItems());

cartModel.addItem(firstProduct);
cartModel.addItem(secondProduct);
cartModel.addItem(unpricedProduct);
cartModel.addItem(firstProduct);
console.log(
  "Корзина: товары после добавления трёх товаров (один добавлен повторно)",
  cartModel.getItems(),
);
console.log("Корзина: количество товаров", cartModel.getCount());
console.log("Корзина: общая стоимость", cartModel.getTotal());
console.log(
  "Корзина: есть ли товар",
  firstProduct.title,
  cartModel.hasItem(firstProduct.id),
);

cartModel.removeItem(firstProduct);
console.log(
  "Корзина: товары после удаления",
  firstProduct.title,
  cartModel.getItems(),
);
console.log(
  "Корзина: есть ли товар после удаления",
  firstProduct.title,
  cartModel.hasItem(firstProduct.id),
);
console.log("Корзина: количество после удаления", cartModel.getCount());
console.log("Корзина: стоимость после удаления", cartModel.getTotal());

cartModel.clear();
console.log("Корзина: товары после очистки", cartModel.getItems());
console.log("Корзина: количество после очистки", cartModel.getCount());

// Покупатель
console.log("Покупатель: данные по умолчанию", buyerModel.getData());
console.log(
  "Покупатель: ошибки валидации пустых данных",
  buyerModel.validate(),
);

buyerModel.setData({ payment: "card" });
buyerModel.setData({ address: "г. Москва, ул. Тверская, д. 1" });
console.log(
  "Покупатель: данные после сохранения оплаты и адреса",
  buyerModel.getData(),
);
console.log(
  "Покупатель: ошибки валидации после первого шага",
  buyerModel.validate(),
);

buyerModel.setData({ email: "buyer@example.com", phone: "+7 900 000-00-00" });
console.log(
  "Покупатель: данные после сохранения email и телефона",
  buyerModel.getData(),
);
console.log(
  "Покупатель: ошибки валидации заполненных данных",
  buyerModel.validate(),
);

buyerModel.clear();
console.log("Покупатель: данные после очистки", buyerModel.getData());

// Запрос к серверу
larekApi
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
    console.log(
      "Сервер: каталог товаров, сохранённый в модели",
      productsModel.getItems(),
    );
  })
  .catch((error) => console.error("Сервер: ошибка загрузки каталога", error));
