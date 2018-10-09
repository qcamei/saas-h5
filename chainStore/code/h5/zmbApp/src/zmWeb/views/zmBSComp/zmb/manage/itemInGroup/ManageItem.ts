/**
 * 管理页 管理项封装
 */
export class ManageItem {
  private _imgUrl: string;//图片Url
  private _name: string;//名称
  private _msgCount: number = 0;//通知数量
  private _page: string;//跳转页面路由
  private _index: number = 0;//组内下标，用于组内排序

  public static newInstance(): ManageItem {
    return new ManageItem();
  }

  public static newItem(name: string, imageUrl: string, msgCount: number, routerUrl) {
    let item: ManageItem = ManageItem.newInstance();
    item.name = name;
    item.imgUrl = imageUrl;
    item.msgCount = msgCount;
    item.page = routerUrl;
    return item;
  }

  get imgUrl(): string {
    return this._imgUrl;
  }

  set imgUrl(value: string) {
    this._imgUrl = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get msgCount(): number {
    return this._msgCount;
  }

  set msgCount(value: number) {
    this._msgCount = value;
  }

  get page(): string {
    return this._page;
  }

  set page(value: string) {
    this._page = value;
  }

  get index(): number {
    return this._index;
  }

  set index(value: number) {
    this._index = value;
  }
}
