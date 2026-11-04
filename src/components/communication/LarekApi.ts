import {
  IApi,
  IOrderRequest,
  IOrderResponse,
  IProductListResponse,
} from "../../types";

const PRODUCTS_ENDPOINT = "/product/";
const ORDER_ENDPOINT = "/order/";

// Отвечает за обмен данными с сервером «Веб-ларёк»: получает каталог товаров и отправляет заказ. 
// Сам запросы не реализует, а использует через композицию объект, соответствующий интерфейсу IApi. Например, экземпляр базового класса Api.
export class LarekApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductListResponse> {
    return this.api.get<IProductListResponse>(PRODUCTS_ENDPOINT);
  }

  createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>(ORDER_ENDPOINT, order);
  }
}
