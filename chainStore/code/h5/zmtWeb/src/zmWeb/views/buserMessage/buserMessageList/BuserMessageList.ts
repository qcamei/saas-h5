import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {BUserMessage} from "../../../bsModule/buserMessage/data/BUserMessage";
import {PageResp} from "../../../comModule/PageResp";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppUtils} from "../../../comModule/AppUtils";
import {MessageQueryForm} from "../../../bsModule/buserMessage/apiData/MessageQueryForm";
import {AppRouter} from "../../../comModule/AppRouter";
import {TriggerTypeEnum} from "../../../bsModule/buserMessage/apiData/TriggerTypeEnum";
import {BuserMessageViewDataMgr} from "../BuserMessageViewDataMgr";
import {BUserMessageClientMgr} from "../../../bsModule/buserMessage/BUserMessageClientMgr";
import {BUserMessageUpdateStatusForm} from "../../../bsModule/buserMessage/apiData/BUserMessageUpdateStatusForm";
import {MessageStatusEnum} from "../../../bsModule/buserMessage/data/MessageStatusEnum";
import {BUserMessageBatchUpdateStatusForm} from "../../../bsModule/buserMessage/apiData/BUserMessageBatchUpdateStatusForm";
import {MsgUnReadCount} from "../../../bsModule/buserMessage/data/MsgUnReadCount";
import {MainViewData} from "../../main/MainViewData";
import {MainViewDataMgr} from "../../main/MainViewDataMgr";

@Component({
  selector: 'buser-messageList-page',
  templateUrl: 'buserMessageList.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BuserMessageListPage implements OnInit, OnDestroy {

  private viewDataSub: any;
  private service: BuserMessageListService;
  public viewData: BuserMessageListViewData;

  constructor(private bUserMessageClientMgr: BUserMessageClientMgr,
              private buserMessageViewDataMgr: BuserMessageViewDataMgr,
              private cdRef: ChangeDetectorRef) {
    this.service = new BuserMessageListService(this.bUserMessageClientMgr, this.buserMessageViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.buserMessageViewDataMgr.subscribeBuserMessageListVD((viewDataP: BuserMessageListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  getOriginNameById(originId: number): string {
    if (originId <= 2) {
      return this.viewData.messageOrignList[0].name;
    } else if (originId <= 3) {
      return this.viewData.messageOrignList[1].name;
    } else if (originId <= 4) {
      return this.viewData.messageOrignList[2].name;
    } else if (originId <= 8) {
      return this.viewData.messageOrignList[3].name;
    }
    return "-";
  }

  //刷新
  refresh() {
    this.queryMessageListByOrigin();
  }

  //批量已读
  batchRead() {
    let messageIds = this.viewData.messageList.map(item => {
      return item.id;
    });
    if (messageIds.length <= 0) {
      return;
    }
    let messageBacthUpdateStatusForm: BUserMessageBatchUpdateStatusForm = new BUserMessageBatchUpdateStatusForm();
    messageBacthUpdateStatusForm.messageIds = messageIds;
    messageBacthUpdateStatusForm.status = MessageStatusEnum.Read;

    this.viewData.messageList = [];
    this.service.batchUpdateStatue(messageBacthUpdateStatusForm, () => {
      this.queryMessageListByOrigin(); //刷新列表
    });
  }

  //标记已读
  markItReaded(id: number) {
    let messageUpdateStatusForm: BUserMessageUpdateStatusForm = new BUserMessageUpdateStatusForm();
    messageUpdateStatusForm.messageId = id;
    messageUpdateStatusForm.status = MessageStatusEnum.Read;

    this.service.updateStatue(messageUpdateStatusForm, () => {
      this.queryMessageListByOrigin(); //刷新列表
    });
  }

  //查看
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
        AppRouter.goFindClerk(1);
      }
        break;
      case TriggerTypeEnum.APPLY_CLERK_SUCCESS: {
        AppRouter.goFindClerk(0);
      }
        break;

      case TriggerTypeEnum.APPLY_CLERK_FAILURE: {
        AppRouter.goFindClerk(0);
      }
        break;
      case TriggerTypeEnum.NEW_MY_APPOINTMENT: {
        AppRouter.goAppointmentList();
      }
        break;
      case TriggerTypeEnum.NEW_MY_WORKFLOW: {
        AppRouter.goBillDetail(bUserMessage.messageObjId);
      }
        break;
      case TriggerTypeEnum.PASS_APPLY_CHAIN: {
        AppRouter.goPullData();
      }
        break;
      case TriggerTypeEnum.CHAIN_ALLOT_CLERK: {
        AppRouter.goPullData();
      }
        break;
      case TriggerTypeEnum.CHAIN_PRODUCT_UPDATE: {
        AppRouter.goPullProduct();
      }
        break;
      case TriggerTypeEnum.CHAIN_PRODUCT_UP: {
        AppRouter.goPullProduct();
      }
        break;
    }
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    let data = this.viewData.messageList;
    let pageData = AppUtils.getPageData(curPage, data);
    this.viewData.messageList = pageData;
  }

  /**
   * 根据类型查询消息 点击事件
   */
  queryMessageListByOrigin() {
    this.service.queryMessageListReq(this.viewData, (viewDataTmp: BuserMessageListViewData) => {
      this.handleResult(viewDataTmp)
    });

    //更新头部显示数量
    let buserId = SessionUtil.getInstance().getUserId();
    this.bUserMessageClientMgr.findUnreadMessageCount(buserId).then((msgUnReadCount: MsgUnReadCount)=>{
      let mainViewData = MainViewData.getInstance();
      mainViewData.messageBadge = msgUnReadCount.count;
      MainViewDataMgr.getInstance().notifyDataChanged();
    });
  }

  private handleResult(viewDataTmp: BuserMessageListViewData) {
    if (!AppUtils.isNullObj(viewDataTmp)) {
      this.viewData.messageList = viewDataTmp.messageList;
      this.viewData.recordCount = viewDataTmp.recordCount;
      this.viewData.curPage = 1;
    }
    this.buserMessageViewDataMgr.setBuserMessageListViewData(this.viewData);
  }

}

export class BuserMessageListService {

  constructor(private bUserMessageClientMgr: BUserMessageClientMgr,
              private buserMessageViewDataMgr: BuserMessageViewDataMgr,) {
  }

  public initViewData() {
    let viewDataTmp = new BuserMessageListViewData();
    this.buserMessageViewDataMgr.setBuserMessageListViewData(viewDataTmp);

    this.buildViewData((viewDataP: BuserMessageListViewData) => {
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: BuserMessageListViewData) {
    this.buserMessageViewDataMgr.setBuserMessageListViewData(viewDataP);
  }

  public async buildViewData(callback: (viewDataP: BuserMessageListViewData) => void) {
    let viewDataTmp = new BuserMessageListViewData();
    //请求店铺所有消息
    viewDataTmp.messageQueryForm = this.buildMessageQueryForm(1, viewDataTmp);
    let pageResp: PageResp = await this.bUserMessageClientMgr.findMessagePageInfo(viewDataTmp.messageQueryForm);
    viewDataTmp.messageList = pageResp.list;
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.curPage = 1;
    viewDataTmp.loadingFinish = true;
    callback(viewDataTmp);
  }

  /**
   * 获取分页数据
   * @param curPage
   * @param viewData
   * @returns {Promise<void>}
   */
  public async getPageData(curPage, viewData: BuserMessageListViewData) {
    let viewDataTmp = new BuserMessageListViewData();
    AppUtils.copy(viewDataTmp, viewData);
    viewDataTmp.recordCount = 0;
    viewDataTmp.loadingFinish = false;
    viewDataTmp.messageList = [];
    //请求所有消息
    viewDataTmp.messageQueryForm = this.buildMessageQueryForm(curPage, viewDataTmp);
    let pageResp: PageResp = await this.bUserMessageClientMgr.findMessagePageInfo(viewDataTmp.messageQueryForm);

    viewDataTmp.curPage = curPage;
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.messageList = pageResp.list;

    viewDataTmp.loadingFinish = true;
    this.handleViewData(viewDataTmp);
  }

  private buildMessageQueryForm(curPage, viewData) {
    let buserId = SessionUtil.getInstance().getUserId();
    let messageQueryForm = new MessageQueryForm();
    messageQueryForm.buserId = buserId;
    if (viewData.origin == -1) {
      messageQueryForm.messageType = [];  //默认为空
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

  /**
   * 根据来源查询消息列表
   * @param viewData
   * @param {(viewDataTmp: BuserMessageListViewData) => void} handleCallBack
   */

  public async queryMessageListReq(viewData, handleCallBack: (viewDataTmp: BuserMessageListViewData) => void) {
    //请求店铺所有消息
    viewData.messageQueryForm = this.buildMessageQueryForm(1, viewData);
    let pageResp: PageResp = await this.bUserMessageClientMgr.findMessagePageInfo(viewData.messageQueryForm);
    viewData.messageList = pageResp.list;
    viewData.recordCount = pageResp.totalCount;
    viewData.curPage = 1;
    viewData.loadingFinish = true;
    handleCallBack(viewData);
  }

  /**根据来源过滤消息列表*/
  private filterListByOrigin(origin, messageListTmp) {
    messageListTmp = messageListTmp.filter(itemTmp => {
      if (itemTmp.messageType == origin || origin < 0) {
        return true;
      } else {
        return false;
      }
    });
    return messageListTmp;
  }

  async updateStatue(updateMessage: BUserMessageUpdateStatusForm, callBack: () => void) {
    let success: boolean = await this.bUserMessageClientMgr.updateMessageStatue(updateMessage.messageId,updateMessage);
    if (success) {
      AppUtils.showSuccess('温馨提示', '标识已读' + "成功");
      callBack();
    } else {
      AppUtils.showError('温馨提示', '标记已读' + "失败");
    }
  }

  async batchUpdateStatue(batchUpdateMessage: BUserMessageBatchUpdateStatusForm, callBack: () => void) {
    //messageId 批量的时候可以不传
    let success: boolean = await this.bUserMessageClientMgr.updateBatchMessageStatue(batchUpdateMessage.messageIds[0],batchUpdateMessage);
    if (success) {
      AppUtils.showSuccess('温馨提示', '批量已读' + "成功");
      callBack();
    } else {
      AppUtils.showError('温馨提示', '标记已读' + "失败");
    }
  }

}

export class BuserMessageListViewData {

  public messageList: Array<BUserMessage> = new Array<BUserMessage>();
  public messageQueryForm: MessageQueryForm = new MessageQueryForm();
  public messageOrignList: Array<MessageOriginModel> = new Array<MessageOriginModel>();
  public messageNameList: Array<string> = ['员工审核通知', '预约通知', '店务通知', '总部通知'];

  //消息 过滤参数
  public origin: number = -1;
  public minTime: any;
  public maxTime: any;

  public curPage: number;//当前页码
  public recordCount: number;//总记录数
  public loadingFinish: boolean = false;

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
    //初始化来源列表
    for (let i in this.messageNameList) {
      let messageOriginModel = new MessageOriginModel(Number(i), this.messageNameList[i]);
      if (messageOriginModel) {
        this.messageOrignList.push(messageOriginModel);
      }
    }
  }
}

export class MessageOriginModel {

  public id: number;
  public name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }


}

