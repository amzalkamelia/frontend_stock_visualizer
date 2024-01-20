export class StockRequest {
  constructor(
    public stock_key: string,
    public date_target: string,
    public date_from: string,
    public date_to: string
  ) {
    this.stock_key = stock_key;
    this.date_target = date_target;
    this.date_from = date_from;
    this.date_to = date_to;
  }
}
