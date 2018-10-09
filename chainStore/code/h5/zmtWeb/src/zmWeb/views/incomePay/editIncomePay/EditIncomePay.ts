import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, Input} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {StoreIncomePayMgr} from "../../../bsModule/incomePay/StoreIncomePayMgr";
import {StoreIncomePayViewDataMgr} from "../StoreIncomePayViewDataMgr";
import {StoreIncomePaySynDataHolder} from "../../../bsModule/incomePay/StoreIncomePaySynDataHolder";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreIncomePay} from "../../../bsModule/incomePay/data/StoreIncomePay";
import {IncomePayType} from "../../../bsModule/incomePay/data/IncomePayType";
import {IncomePay} from "../../../bsModule/incomePay/data/IncomePay";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {AppRouter} from "../../../comModule/AppRouter";
import {IncomePayMgr} from "../../../bsModule/incomePay/IncomePayMgr";
import {RestResp} from "../../../comModule/RestResp";
import {FollowClerk, IncomeOrPay} from "../addIncomPay/AddIncomePay";
import {IncomePayCategoryEnum} from "../../../bsModule/incomePay/apiData/IncomePayCategoryEnum";
import {StoreAdminRole} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {ClerkInfo} from "../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {BUserCacheMgr} from "../../../bsModule/buser/BUserCacheMgr";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {IncomePayBuserPopup} from "../Comp/incomePayUserPopup/IncomePayUserPopup";
import {MatDialog} from "@angular/material";
import {IncomePayUpdateInfoForm} from "../../../bsModule/incomePay/apiData/IncomePayUpdateInfoForm";
import {IncomePayTypeComponent} from "../incomePayType/incomePayTypeModule";


@Component({
  selector: 'editIncomePay-page',
  templateUrl: 'editIncomePay.html',

  styles: [`

    @media (max-width: 599px) {
      .ml-20 {
        margin-left: 0 !important;
      }

      .mat-toolbar-row, .mat-toolbar-single-row {
        height: auto !important;
      }

      .mat-toolbar-row, .mat-toolbar-single-row {
        height: auto !important;
      }

    }

    
  .fz-16{
    font-size: 16px;
  } 

  .pos-a{
    position: absolute;
  }
  .pos-r{
    position: relative;
  } 
  
  .dib{
    display: inline-block;
  } 
   
  .nameDiv {
    display: inline-block;
    width: 200px;
    border: 1px solid #ced4da;
    border-radius: 6px;
    // padding: 8px 10px;
    padding-left:15px;
    height:35px;
    line-height: 31px;
    position: relative;
  }


  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditIncomePayPage implements OnInit, OnDestroy {

  private service: EditIncomePayService;
  public viewData: EditIncomePayViewData;
  private viewDataSub: any;
  private paramsSub: any;
  private incomePayId: string;
  public requestUrl: string;
  public state: number;

  constructor(private incomePayMgr: IncomePayMgr,
              private storeIncomePayMgr: StoreIncomePayMgr,
              private storeIncomePayViewDataMgr: StoreIncomePayViewDataMgr,
              private storeIncomePaySynDataHolder: StoreIncomePaySynDataHolder,
              private storeClerkInfoSynDataHolder: StoreClerkInfoSynDataHolder,
              private buserCacheMgr: BUserCacheMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              matDialog: MatDialog
  ) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new EditIncomePayService(
      this.incomePayMgr,
      this.storeIncomePayMgr,
      this.storeIncomePayViewDataMgr,
      this.storeIncomePaySynDataHolder,
      this.storeClerkInfoSynDataHolder,
      this.buserCacheMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeIncomePayViewDataMgr.subscribeEditIncomePayVD((viewDataP: EditIncomePayViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });

    this.paramsSub = this.route.params.subscribe(params => {
      this.incomePayId = params['incomePayId'];
      this.service.initViewData(this.incomePayId);
    });
  }

  ngOnDestroy(): void {

  }

  //返回
  goBack(){
    AppRouter.goIncomePayList();
  }

  //新增incomePayType
  addIncomePayType(){
    const activeModel = ZmModalMgr.getInstance().newSmallModal(IncomePayTypeComponent, null, null);
    activeModel.componentInstance.category = this.viewData.chooseIncomeOrPay.category;
    activeModel.componentInstance.modalHeader = '新建分类';
    let tmp = this;
    activeModel.componentInstance.action = (typeId:string) =>{
      tmp.refreshTypeList(typeId.toString());//回调刷新列表
    }
  }

  private refreshTypeList(addTypeId: string) {
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeIncomePaySynDataHolder.getData(storeId).then(
      (storeIncomePay) => {
        this.viewData.incomePayTypeList = storeIncomePay.getValidIncomePayTypeList();
        this.viewData.payTypeListShow = this.viewData.incomePayTypeList.filter((item)=>{
          if (item.category == IncomePayCategoryEnum.PAY) {
            return true;
          } else  {
            return false;
          }
        });

        this.viewData.incomeTypeListShow = this.viewData.incomePayTypeList.filter((item)=>{
          if (item.category == IncomePayCategoryEnum.INCOME) {
            return true;
          } else  {
            return false;
          }
        });
        let typeArray: Array<IncomePayType> = this.viewData.incomePayTypeList.filter((item) => {
          if (item.category == this.viewData.chooseIncomeOrPay.category && item.id == addTypeId) {
            return true;
          }
        })
        if (this.viewData.chooseIncomeOrPay.category == IncomePayCategoryEnum.INCOME) {
          this.viewData.chooseIncomeType = typeArray && typeArray.length > 0 ? typeArray[0] : new IncomePayType();
        } else if (this.viewData.chooseIncomeOrPay.category == IncomePayCategoryEnum.PAY) {
          this.viewData.choosePayType = typeArray && typeArray.length > 0 ? typeArray[0] : new IncomePayType();
        }
        this.service.handleViewData(this.viewData);
      });
  }

  /**选择人员模态框*/
  selectBuser() {
    const activeModal = ZmModalMgr.getInstance().newModal(IncomePayBuserPopup, null, null);
    activeModal.componentInstance.clerkMap = this.viewData.followClerkMap;
    activeModal.componentInstance.clerkListShow = this.viewData.clerkList;
    activeModal.componentInstance.callBack = (clerk: FollowClerk) => {
      this.viewData.chooseClerk = clerk;
      this.cdRef.markForCheck();
    };
  }

  categoryChange(){
    // if (this.viewData.chooseIncomeOrPay.category == IncomePayCategoryEnum.PAY) {
    //   this.viewData.chooseIncomeType.id = '0';
    // } else if (this.viewData.chooseIncomeOrPay.category == IncomePayCategoryEnum.INCOME) {
    //   this.viewData.choosePayType.id = '0';
    // }
  }

  /**
   * 编辑收支 点击事件
   * @param incomePayId:number
   */

  public async updateIncomepay() {
    let incomepayUpdateForm = this.buildUpdateForm(this.incomePayId);
    let checkSuccess = this.checkUpdateForm(incomepayUpdateForm);
    if (checkSuccess) {
      let success = await this.service.editIncomePay(incomepayUpdateForm);
      this.handleResult(success);
    }
  }

  private buildUpdateForm(incomePayId) {
    let incomepayUpdateForm = new IncomePayUpdateInfoForm();
    incomepayUpdateForm.storeId = SessionUtil.getInstance().getStoreId();
    incomepayUpdateForm.id = incomePayId;
    incomepayUpdateForm.category = this.viewData.chooseIncomeOrPay.category;
    if (incomepayUpdateForm.category == IncomePayCategoryEnum.PAY) {
      incomepayUpdateForm.typeId = this.viewData.choosePayType.id;
    } else if (incomepayUpdateForm.category == IncomePayCategoryEnum.INCOME){
      incomepayUpdateForm.typeId = this.viewData.chooseIncomeType.id;
    }
    incomepayUpdateForm.incomePayTime = this.service.getIncomePayTime(this.viewData.incomePayDate,this.viewData.curIncomePayTime)
    incomepayUpdateForm.remark = this.viewData.incomePay.remark;
    incomepayUpdateForm.buserId = this.viewData.chooseClerk.id;
    incomepayUpdateForm.money = this.viewData.incomePay.money;

    console.log(incomepayUpdateForm);
    return incomepayUpdateForm;
  }

  /**表单验证*/
  private checkUpdateForm(incomepayUpdateForm) {
    if (AppUtils.isNullObj(incomepayUpdateForm.category)
      || AppUtils.isNullObj(incomepayUpdateForm.incomePayTime)
      || (incomepayUpdateForm.buserId <= 0 || AppUtils.isNullObj(incomepayUpdateForm.buserId))
      || (AppUtils.isNullObj(incomepayUpdateForm.typeId) || incomepayUpdateForm.typeId <= 0)
      || incomepayUpdateForm.money <= 0 || AppUtils.isNullObj(incomepayUpdateForm.money)) {
      AppUtils.showWarn(PromptMsg.PROMPT, "必填项未按要求填写");
      return false;
    } else {
      return true;
    }
  }

  /**
   * 处理结果
   */
  private handleResult(successP: boolean): void {
    if (successP) {
      AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.EDIT_SUCCESS);
      AppRouter.goIncomePayList();
    } else {
      AppUtils.showError(PromptMsg.PROMPT, PromptMsg.EDIT_ERROR);
    }
  }
}

export class EditIncomePayService {
  constructor(private incomePayMgr: IncomePayMgr,
              private storeIncomePayMgr: StoreIncomePayMgr,
              private storeIncomePayViewDataMgr: StoreIncomePayViewDataMgr,
              private storeIncomePaySynDataHolder: StoreIncomePaySynDataHolder,
              private storeClerkInfoSynDataHolder: StoreClerkInfoSynDataHolder,
              private buserCacheMgr: BUserCacheMgr,) {
  }

  public initViewData(incomePayId: string): void {

    this.storeIncomePayViewDataMgr.setEditIncomePayViewData(new EditIncomePayViewData());

    this.buildViewData(incomePayId).then((viewDataTmp: EditIncomePayViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  public handleViewData(viewDataP: EditIncomePayViewData) {
    this.storeIncomePayViewDataMgr.setEditIncomePayViewData(viewDataP);
  }

  public async buildViewData(incomePayId: string): Promise<EditIncomePayViewData> {
    let viewDataTmp: EditIncomePayViewData = new EditIncomePayViewData();
    let storeId = SessionUtil.getInstance().getStoreId();
    let storeIncomePay: StoreIncomePay = await this.storeIncomePaySynDataHolder.getData(storeId);
    viewDataTmp.incomePayTypeList = storeIncomePay.getValidIncomePayTypeList();

    //请求storeClerkInfo
    //请求所有员工信息
    let clerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
    let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(clerkInfoId);
    let clerkInfoMap = storeClerkInfo.getValidClerkMap();
    viewDataTmp.clerkMap = storeClerkInfo.getValidClerkMap();
    viewDataTmp.roleMap = storeClerkInfo.getRoleMap();

    let clerkIdArray = clerkInfoMap.keys();
    let buserMap = await this.buserCacheMgr.getList(clerkIdArray);
    viewDataTmp.buserMap = buserMap;

    //组装跟进人员list
    viewDataTmp.followClerkMap = this.buildClerkMap(clerkIdArray, viewDataTmp);
    viewDataTmp.clerkList = viewDataTmp.followClerkMap.values();


    //初始化选中的东西  数据回显
    let incomePay: IncomePay = await this.incomePayMgr.get(storeId,incomePayId);
    viewDataTmp.incomePay = incomePay;

    viewDataTmp.chooseIncomeOrPay = viewDataTmp.incomeOrPayList[incomePay.category];

    viewDataTmp.chooseClerk = viewDataTmp.followClerkMap.get(incomePay.buserId.toString());
    let typeArray: Array<IncomePayType> = viewDataTmp.incomePayTypeList.filter((item) => {
      if (item.id == incomePay.typeId && item.category == incomePay.category) {
        return true;
      }
    })
    if (incomePay.category == IncomePayCategoryEnum.INCOME) {
      viewDataTmp.chooseIncomeType = typeArray && typeArray.length > 0 ? typeArray[0] : new IncomePayType();
    } else if (incomePay.category == IncomePayCategoryEnum.PAY) {
      viewDataTmp.choosePayType = typeArray && typeArray.length > 0 ? typeArray[0] : new IncomePayType();
    }

    viewDataTmp.incomeTypeListShow = viewDataTmp.incomePayTypeList.filter((item)=>{
      if (item.category == IncomePayCategoryEnum.INCOME) {
        return true;
      } else  {
        return false;
      }
    });

    viewDataTmp.payTypeListShow = viewDataTmp.incomePayTypeList.filter((item)=>{
      if (item.category == IncomePayCategoryEnum.PAY) {
        return true;
      } else  {
        return false;
      }
    });

    const date = new Date(Number(incomePay.incomePayTime));
    viewDataTmp.incomePayDate = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    viewDataTmp.curIncomePayTime = {hour:date.getHours(),minute:date.getMinutes()};

    return new Promise<EditIncomePayViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

  /**
   * 组装收支时间
   * @return 时间戳
   */
  public getIncomePayTime(incomePayDateTmp, incomePayTimeTmp) {
    let incomePayDate = this.formatDate(incomePayDateTmp);
    let incomePayTime = this.formatTime(incomePayTimeTmp);
    let date = new Date(incomePayDate + " " + incomePayTime);
    let time = date.getTime();
    return time;
  }

  /**收支日期格式*/
  public formatDate(incomePayDate: any): string {
    let arrTmp = [incomePayDate.year, incomePayDate.month, incomePayDate.day];
    let date: string = arrTmp.join("/");
    return date;
  }

  /**收支时间格式*/
  private formatTime(incomePayTime: any): string {
    let arrTmp = [incomePayTime.hour, incomePayTime.minute];
    let time: string = arrTmp.join(":");
    return time;
  }

  /**组装员工Map*/
  private buildClerkMap(clerkIdArray, viewDataTmp) {
    let followClerkMap: ZmMap<FollowClerk> = new ZmMap<FollowClerk>();
    for (let i = 0; i < clerkIdArray.length; i++) {
      let followClerk = new FollowClerk();
      followClerk.id = clerkIdArray[i];
      let user = viewDataTmp.buserMap.get(clerkIdArray[i]);
      if (user) {
        followClerk.name = user.name;
        followClerk.phone = user.phone;
      }
      followClerkMap.put(followClerk.id, followClerk);
    }
    return followClerkMap;
  }

  /**
   *编辑商品方法
   *@param storeId:string
   *@param formData:GoodsAddForm
   *@returns Promise<boolean>
   */
  public editIncomePay(formData: IncomePayUpdateInfoForm): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    return new Promise<boolean>(resolve => {
      this.incomePayMgr.updateIncomePayInfo(storeId,formData).then(
        (restResp: RestResp) => {
          resolve(restResp.code == 200);
        }
      )
    });
  }

}

export class EditIncomePayViewData {
  public incomePay: IncomePay = new IncomePay();
  public incomePayTypeList: Array<IncomePayType> = new Array<IncomePayType>();
  //收入
  public incomeTypeListShow: Array<IncomePayType> = new Array<IncomePayType>();
  //支出
  public payTypeListShow: Array<IncomePayType> = new Array<IncomePayType>();

  public incomeOrPayList: Array<IncomeOrPay> = new Array<IncomeOrPay>();

  public chooseIncomeOrPay: IncomeOrPay = new IncomeOrPay();
  public chooseClerk: FollowClerk = new FollowClerk();
  public chooseIncomeType: IncomePayType = new IncomePayType();
  public choosePayType: IncomePayType = new IncomePayType();

  public buserMap: ZmMap<BUser>;
  public clerkMap: ZmMap<ClerkInfo>;
  public roleMap: ZmMap<StoreAdminRole>;

  //选中的员工
  public followClerkMap: ZmMap<FollowClerk> = new ZmMap<FollowClerk>();
  public clerkList: Array<FollowClerk> = new Array<FollowClerk>();


  public today: Date;
  public incomePayDate: any;
  public curIncomePayTime: any;

  constructor() {
    let pay: IncomeOrPay = new IncomeOrPay();
    pay.category = IncomePayCategoryEnum.PAY;
    pay.name = '支出';
    this.incomeOrPayList.push(pay);

    let income: IncomeOrPay = new IncomeOrPay();
    income.category = IncomePayCategoryEnum.INCOME;
    income.name = '收入';
    this.incomeOrPayList.push(income);

    //初始化日历控件初始化
    this.initIncomePayTime();

  }

  initIncomePayTime() {
    const now = new Date();
    this.today = now;
    this.incomePayDate = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    this.curIncomePayTime = {hour: now.getHours(), minute: now.getMinutes()};
  }
}
