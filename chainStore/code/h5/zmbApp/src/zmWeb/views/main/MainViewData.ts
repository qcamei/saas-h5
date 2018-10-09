import {MgrPool} from "../../comModule/MgrPool";
import {SimpleStore, UserPermData} from "../../comModule/session/SessionData";
import {Message} from "../../bsModule/message/data/Message";
import {Constants} from "../zmComUtils/Constants";


export class MainViewData{

  public static getInstance():MainViewData{
    return MgrPool.getInstance().get("MainViewData",MainViewData);
  }

  public initData() {
    MgrPool.getInstance().setNull("MainViewData", MainViewData);
  }

  constructor(){}

  private _userName:string = "";
  private _imgUrl:string = Constants.USER_DEFAULT_IMG;
  private _userRole:string = "";
  private _showDevice:boolean = false;
  private _messageBadge:number = 0;
  private _messageList:Array<Message> = new Array<Message>();

  //店铺
  private _storeName:string = Constants.DEFAULT_STORE_NAME;
  private _storeList:Array<SimpleStore> = new Array<SimpleStore>();

  private _userPermData:UserPermData = new UserPermData();


  get userName(): string {
    return this._userName;
  }

  set userName(value: string) {
    this._userName = value;
  }

  get imgUrl(): string {
    return this._imgUrl;
  }

  set imgUrl(value: string) {
    this._imgUrl = value;
  }

  get userRole(): string {
    return this._userRole;
  }

  set userRole(value: string) {
    this._userRole = value;
  }

  get showDevice(): boolean {
    return this._showDevice;
  }

  set showDevice(value: boolean) {
    this._showDevice = value;
  }

  get messageBadge(): number {
    return this._messageBadge;
  }

  set messageBadge(value: number) {
    this._messageBadge = value;
  }

  get messageList(): Array<Message> {
    return this._messageList;
  }

  set messageList(value: Array<Message>) {
    this._messageList = value;
  }

  get storeName(): string {
    return this._storeName;
  }

  set storeName(value: string) {
    this._storeName = value;
  }

  get storeList(): Array<SimpleStore> {
    return this._storeList;
  }

  set storeList(value: Array<SimpleStore>) {
    this._storeList = value;
  }

  get userPermData(): UserPermData {
    return this._userPermData;
  }

  set userPermData(value: UserPermData) {
    this._userPermData = value;
  }

}
