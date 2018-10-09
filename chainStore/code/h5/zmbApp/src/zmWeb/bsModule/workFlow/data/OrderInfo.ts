export class OrderInfo {
  private _orderId: number;

  get orderId(): number {
    return this._orderId;
  }

  set orderId(value: number) {
    this._orderId = value;
  }
}
