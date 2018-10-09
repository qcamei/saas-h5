export class AppointInfo {
  private _appointId: number;


  get appointId(): number {
    return this._appointId;
  }

  set appointId(value: number) {
    this._appointId = value;
  }
}
