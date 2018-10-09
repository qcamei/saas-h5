import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {MessageListViewData} from "./messageList.page";

export class MessageListViewDataMgr {

  private static Instance: MessageListViewDataMgr = new MessageListViewDataMgr();

  public static getInstance(): MessageListViewDataMgr {
    return MessageListViewDataMgr.Instance;
  }

  private viewDataMgr: ViewDataMgr<MessageListViewData> = new ViewDataMgr<MessageListViewData>();

  public setMessageListViewData(messageListViewData: MessageListViewData): void {
    this.viewDataMgr.setData(messageListViewData);
  }

  public onDataChanged(initData:MessageListViewData, func: (messageListViewData: MessageListViewData) => void) {
    this.viewDataMgr.onDataChanged(initData, func);
  }


  public onInformDataChanged(func: () => void) {
    this.viewDataMgr.onInformDataChanged(func);
  }

  public onViewDestroy(): void {
    this.viewDataMgr.onViewDestroy();
  }


  public notifyDataChanged(): void {
    this.viewDataMgr.notifyDataChanged();
  }

}
