import {IonicPage} from "ionic-angular";
import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {MessageListViewDataMgr} from "./MessageListViewDataMgr";
import {BUserMessage} from "../../../bsModule/buserMessage/data/BUserMessage";
import {MessageQueryForm} from "../../../bsModule/buserMessage/apiData/MessageQueryForm";
import {PageResp} from "../../../comModule/asynDao/apiData/PageResp";
import {TriggerTypeEnum} from "../../../bsModule/buserMessage/apiData/TriggerTypeEnum";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {BUserMessageClientMgr} from "../../../bsModule/buserMessage/BUserMessageClientMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {MessageStatusEnum} from "../../../bsModule/buserMessage/data/MessageStatusEnum";
import {BUserMessageUpdateStatusForm} from "../../../bsModule/buserMessage/apiData/BUserMessageUpdateStatusForm";

@IonicPage({
  name: "messageList",
  segment: 'messageList'
})

@Component({
  template: `
 <zm-page-header title="消息中心"></zm-page-header>
    <zm-page-content>
        <zmbMessage-info *ngFor="let item of viewData.messageList" [item] = 'item' (onItemClick)="goDetail($event)"></zmbMessage-info>    
    </zm-page-content>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class MessageListPage {

  private service: MessageListService;
  public viewData: MessageListViewData = new MessageListViewData();

  constructor(private cdRef: ChangeDetectorRef) {
    this.service = new MessageListService();
    MessageListViewDataMgr.getInstance().onDataChanged(new MessageListViewData(), (viewDataTmp: MessageListViewData) => {
      this.viewData = viewDataTmp;
      this.cdRef.markForCheck();
    });

  }

  ionViewDidEnter() {
    this.service.initViewData();
  }


  //查看  标记为已读
  checkMessage(buserMessage: BUserMessage) {
    if (buserMessage.status == MessageStatusEnum.Read) {
      this.goDetail(buserMessage);
      return;
    }
    //未读 就发请求为已读
    let messageUpdateStatusForm: BUserMessageUpdateStatusForm = new BUserMessageUpdateStatusForm();
    messageUpdateStatusForm.messageId = buserMessage.id;
    messageUpdateStatusForm.status = MessageStatusEnum.Read;
    this.service.updateStatue(messageUpdateStatusForm, () => {
      this.goDetail(buserMessage);
    });
  }

  /**
   * 页面点击事件 跳转到详情
   * @param BUserMessage
   */
  goDetail(bUserMessage: BUserMessage) {
    switch (bUserMessage.messageType) {
      case TriggerTypeEnum.NEW_MY_CLERK: {
        // AppRouter.goFindClerk(1);
      }
        break;
      case TriggerTypeEnum.APPLY_CLERK_SUCCESS: {
        // AppRouter.goFindClerk(0);
      }
        break;

      case TriggerTypeEnum.APPLY_CLERK_FAILURE: {
        // AppRouter.goFindClerk(0);
      }
        break;
      case TriggerTypeEnum.NEW_MY_APPOINTMENT: {
        // AppRouter.goAppointmentList();
      }
        break;
      case TriggerTypeEnum.NEW_MY_WORKFLOW: {
        // AppRouter.goBillDetail(bUserMessage.messageObjId);
      }
        break;
      case TriggerTypeEnum.PASS_APPLY_CHAIN: {
        // AppRouter.goPullData();
      }
        break;
      case TriggerTypeEnum.CHAIN_ALLOT_CLERK: {
        // AppRouter.goPullData();
      }
        break;
      case TriggerTypeEnum.CHAIN_PRODUCT_UPDATE: {
        // AppRouter.goPullProduct();
      }
        break;
      case TriggerTypeEnum.CHAIN_PRODUCT_UP: {
        // AppRouter.goPullProduct();
      }
        break;
    }
  }

}

export class MessageListService {

  public initViewData() {
    let viewDataTmp = new MessageListViewData();
    MessageListViewDataMgr.getInstance().setMessageListViewData(viewDataTmp);

    this.buildViewData((viewDataP: MessageListViewData) => {
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: MessageListViewData) {
    MessageListViewDataMgr.getInstance().setMessageListViewData(viewDataP);
  }

  public async buildViewData(callback: (viewDataP: MessageListViewData) => void) {
    let viewDataTmp = new MessageListViewData();
    //请求店铺所有消息
    viewDataTmp.messageQueryForm = this.buildMessageQueryForm(1, viewDataTmp);
    let pageResp: PageResp = await BUserMessageClientMgr.getInstance().findMessagePageInfo(viewDataTmp.messageQueryForm);
    viewDataTmp.messageList = pageResp.list.map((item)=> {
     return  MessageVD.fromMessage(item);
    });
    callback(viewDataTmp);
  }

  /**
   * 根据来源查询消息列表
   * @param viewData
   * @param {(viewDataTmp: BuserMessageListViewData) => void} handleCallBack
   */

  public async queryMessageListReq(viewData, handleCallBack: (viewDataTmp: MessageListViewData) => void) {
    //请求店铺所有消息
    viewData.messageQueryForm = this.buildMessageQueryForm(1, viewData);
    let pageResp: PageResp = await BUserMessageClientMgr.getInstance().findMessagePageInfo(viewData.messageQueryForm);
    viewData.messageList = pageResp.list.map((item)=> {
      return  MessageVD.fromMessage(item);
    });
    handleCallBack(viewData);
  }

  private buildMessageQueryForm(curPage, viewData) {
    let buserId = SessionUtil.getInstance().getUserId();
    let messageQueryForm = new MessageQueryForm();
    messageQueryForm.buserId = buserId;
    if (viewData.origin == -1) {
      messageQueryForm.messageType = [-1];  //默认-1
    } else if (viewData.origin == 0) {
      //员工相关
      messageQueryForm.messageType = [TriggerTypeEnum.NEW_MY_CLERK, TriggerTypeEnum.APPLY_CLERK_SUCCESS, TriggerTypeEnum.APPLY_CLERK_FAILURE];
    } else if (viewData.origin == 1) {
      //预约
      messageQueryForm.messageType = [TriggerTypeEnum.NEW_MY_APPOINTMENT];
    } else if (viewData.origin == 2) {
      //流程
      messageQueryForm.messageType = [TriggerTypeEnum.NEW_MY_WORKFLOW];
    } else if (viewData.origin == 3) {
      //总店数据
      messageQueryForm.messageType = [TriggerTypeEnum.PASS_APPLY_CHAIN, TriggerTypeEnum.CHAIN_ALLOT_CLERK, TriggerTypeEnum.CHAIN_PRODUCT_UPDATE, TriggerTypeEnum.CHAIN_PRODUCT_UP];
    }
    messageQueryForm.pageItemCount = 10;
    messageQueryForm.pageNo = curPage;
    messageQueryForm.minTime = AppUtils.getMinTime(viewData.minTime);
    messageQueryForm.maxTime = AppUtils.getMaxTime(viewData.maxTime);
    return messageQueryForm;
  }

  //更新为已读
  async updateStatue(updateMessage: BUserMessageUpdateStatusForm, callBack: () => void) {
    let success: boolean = await BUserMessageClientMgr.getInstance().updateMessageStatue(updateMessage.messageId, updateMessage);
    if (success) {
      // AppUtils.showSuccess('温馨提示', '标识已读' + "成功");
      callBack();
    } else {
      // AppUtils.showError('温馨提示', '标记已读' + "失败");
    }
  }

}

export class MessageListViewData {

  public messageList: Array<MessageVD> = new Array<MessageVD>();
  public messageQueryForm: MessageQueryForm = new MessageQueryForm();

  //消息 过滤参数
  public origin: number = -1;
  public minTime: any;
  public maxTime: any;

  constructor() {

    let date = new Date();
    let lastWeekTime = date.getTime() - 1000 * 60 * 60 * 24 * 7;
    let lastWeekDate = new Date(lastWeekTime);
    this.maxTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.minTime = {
      year: lastWeekDate.getFullYear(),
      month: lastWeekDate.getMonth() + 1,
      day: lastWeekDate.getDate()
    };
  }

}

export class MessageVD {
  imgUrl:string;
  title:string;
  message:BUserMessage;


  public static fromMessage(message:BUserMessage){
    let messageVD = new MessageVD();
    messageVD.message = message;
    messageVD.imgUrl = messageVD.getImgUrlByMessageType(message.messageType);
    messageVD.title = messageVD.getTitleByMessageType(message.messageType);
    return messageVD;
  }

  private getImgUrlByMessageType(type:number):string{

    // assets/icon/avatar.jpeg

    var imgUrl = '-';
    switch (type) {
      case TriggerTypeEnum.APPLY_CLERK_FAILURE:
      case TriggerTypeEnum.APPLY_CLERK_SUCCESS:
      case TriggerTypeEnum.NEW_MY_CLERK:
        imgUrl = 'assets/icon/client.svg';
        break;
      case TriggerTypeEnum.NEW_MY_APPOINTMENT:
        imgUrl = 'assets/icon/appointment.svg';
        break;
      case TriggerTypeEnum.NEW_MY_WORKFLOW:
        imgUrl = 'assets/icon/apply.svg';
        break;
      case TriggerTypeEnum.PASS_APPLY_CHAIN:
      case TriggerTypeEnum.CHAIN_ALLOT_CLERK:
      case TriggerTypeEnum.CHAIN_PRODUCT_UP:
      case TriggerTypeEnum.CHAIN_PRODUCT_UPDATE:
        imgUrl = 'assets/icon/wunit.svg';
        break;
      case TriggerTypeEnum.LEAGUER_BIRTHDAY_NOTICE:
        imgUrl = 'assets/icon/agent_add.svg';
        break;
      default:
        break;
    }
    return imgUrl;
}

  private getTitleByMessageType(type:number):string{

    var title = '-';
    switch (type) {
      case TriggerTypeEnum.APPLY_CLERK_FAILURE:
      case TriggerTypeEnum.APPLY_CLERK_SUCCESS:
      case TriggerTypeEnum.NEW_MY_CLERK:
        title = '员工管理';
        break;
      case TriggerTypeEnum.NEW_MY_APPOINTMENT:
        title = '预约管理';
        break;
      case TriggerTypeEnum.NEW_MY_WORKFLOW:
        title = '流程管理';
        break;
      case TriggerTypeEnum.PASS_APPLY_CHAIN:
      case TriggerTypeEnum.CHAIN_ALLOT_CLERK:
      case TriggerTypeEnum.CHAIN_PRODUCT_UP:
      case TriggerTypeEnum.CHAIN_PRODUCT_UPDATE:
        title = '连锁店管理';
        break;
      case TriggerTypeEnum.LEAGUER_BIRTHDAY_NOTICE:
        title = '会员生日提醒';
        break;
      default:
        break;
    }
    return title;
  }


}

