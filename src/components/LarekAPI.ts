import { IApi, ICard, IOrder, TOrderModal } from "../types";

export class LarekAPI {
  private _baseApi: IApi;

  constructor(baseApi: IApi) {
    this._baseApi = baseApi;
  };

  getCards(): Promise<ICard[]> {
    return this._baseApi
      .get<ICard[]>(`/product`)
      .then((cards: ICard[]) => cards);
  }

  getCard(cardId: string): Promise<ICard> {
    return this._baseApi
      .get<ICard>(`/product/${cardId}`)
      .then((card: ICard) => card);
  }

  addOrder(order: TOrderModal): Promise<TOrderModal> {
    return this._baseApi
      .post<TOrderModal>(`/order`, order)
      .then((data: TOrderModal) => data);
  }
}