import { ICard, TOrderModal } from "../types";
import { Api, ApiListResponse } from "./base/Api";

export interface ILarekApi {
  getCards: () => Promise<ICard[]>;
  getCard: (id: string) => Promise<ICard>;
  addOrder: (order: TOrderModal) => Promise<TOrderModal>;
}

export class LarekAPI extends Api implements ILarekApi {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  };

  getCards(): Promise<ICard[]> {
    return this.get('/product').then((data: ApiListResponse<ICard>) =>
        data.items.map((item) => ({
            ...item,
            image: this.cdn + item.image.replace('svg', 'png'),
        }))
    );
  }

  getCard(cardId: string): Promise<ICard> {
      return this.get(`/product/${cardId}`).then(
          (item: ICard) => ({
              ...item,
              image: this.cdn + item.image.replace('svg', 'png'),
          })
      );
  }

  addOrder(order: TOrderModal): Promise<TOrderModal> {
      return this.post('/order', order).then(
          (data: TOrderModal) => data
      );
  }
}