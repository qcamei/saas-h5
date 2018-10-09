import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input} from "@angular/core";
import {IncomePayMgr} from "../../../bsModule/incomePay/IncomePayMgr";
import {IncomePayType} from "../../../bsModule/incomePay/data/IncomePayType";
import {ActivatedRoute} from "@angular/router";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";
import {StoreIncomePayViewDataMgr} from "../StoreIncomePayViewDataMgr";
import {StoreIncomePaySynDataHolder} from "../../../bsModule/incomePay/StoreIncomePaySynDataHolder";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {IncomePayAddForm} from "../../../bsModule/incomePay/apiData/IncomePayAddForm";
import {AppRouter} from "../../../comModule/AppRouter";
import {IncomePayCategoryEnum} from "../../../bsModule/incomePay/apiData/IncomePayCategoryEnum";
import {IncomePayBuserPopup} from "../Comp/incomePayUserPopup/IncomePayUserPopup";
import {StoreAdminRole} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {ClerkInfo} from "../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {BUserCacheMgr} from "../../../bsModule/buser/BUserCacheMgr";
import {StoreIncomePay} from "../../../bsModule/incomePay/data/StoreIncomePay";
import {IncomePayTypeComponent} from "../incomePayType/incomePayTypeModule";


@Component({
  selector: 'addIncomePay-page',
  templateUrl: 'addIncomePay.html',
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
export class AddIncomePayPage implements OnInit, OnDestroy {

  private viewDataSub: any;
  private paramsSub: any;
  private service: AddIncomePayService;
  public viewData: AddIncomePayViewData;
  public today: Date;
  @Input() category:number;

  private _incomePayDate: any;

  get incomePayDate(): any {
    return this._incomePayDate;
  }

  set incomePayDate(value: any) {
    this._incomePayDate = value;
    console.log(value);
  }


  public curIncomePayTime: any;

  constructor(private incomePayMgr: IncomePayMgr,
              private storeIncomePaySynDataHolder: StoreIncomePaySynDataHolder,
              private storeIncomePayViewDataMgr: StoreIncomePayViewDataMgr,
              private storeClerkInfoSynDataHolder: StoreClerkInfoSynDataHolder,
              private buserCacheMgr: BUserCacheMgr,
              private route: ActivatedRoute,
              private cdRef: ChangeDetectorRef,
              matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new AddIncomePayService(this.incomePayMgr, this.storeIncomePaySynDataHolder, this.storeIncomePayViewDataMgr, this.storeClerkInfoSynDataHolder, this.buserCacheMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeIncomePayViewDataMgr.subscribeAddIncomePayVD((viewDataP: AddIncomePayViewData) => {
      //初始化日历控件初始化
      this.initIncomePayTime();
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })

    this.paramsSub = this.route.params.subscribe(params =>{
      this.category = params['category'];
      this.service.initViewData(this.category);
    })
  }

  ngOnDestroy(): void {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  initIncomePayTime() {
    const now = new Date();
    this.today = now;
    this._incomePayDate = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    this.curIncomePayTime = {hour: now.getHours(), minute: now.getMinutes()};
  }

  /**
   * 组装收支时间
   * @return 时间戳
   */
  private getIncomePayTime(incomePayDateTmp,incomePayTimeTmp){
    let incomePayDate = this.formatDate(incomePayDateTmp);
    let incomePayTime = this.formatTime(incomePayTimeTmp);
    let date = new Date(incomePayDate + " " + incomePayTime);
    let time = date.getTime();
    return time;
  }

  /**收支日期格式*/
  private formatDate(incomePayDate: any):string{
    let arrTmp = [incomePayDate.year, incomePayDate.month, incomePayDate.day];
    let date:string = arrTmp.join("/");
    return date;
  }

  /**收支时间格式*/
  private formatTime(incomePayTime: any):string{
    let arrTmp = [incomePayTime.hour, incomePayTime.minute];
    let time:string = arrTmp.join(":");
    return time;
  }

  //返回
  goBack(){
    AppRouter.goIncomePayList();
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
    // //选择同一个
    // if (this.category == this.viewData.chooseIncomeOrPay.category){
    //   return;
    // }
    // this.viewData.chooseType.id = '0';
    // if (this.viewData.chooseIncomeOrPay.category == IncomePayCategoryEnum.INCOME) {
    //   this.viewData.typeListShow = this.viewData.typeList.filter(item=>{
    //     if (item.category == IncomePayCategoryEnum.INCOME) {
    //       return true;
    //     }
    //   })
    // } else if (this.viewData.chooseIncomeOrPay.category == IncomePayCategoryEnum.PAY){
    //   this.viewData.typeListShow = this.viewData.typeList.filter(item=>{
    //     if (item.category == IncomePayCategoryEnum.PAY) {
    //       return true;
    //     }
    //   })
    // }
  }

  /**
   * 新建收支点击事件
   */
  public incomePayAddForm = new IncomePayAddForm();

  public async addIncomePay() {
    this.buildAddForm();
    let checkSuccess = this.checkForm();
    if (checkSuccess) {
      let success = await this.service.addIncomePay(this.incomePayAddForm);
      this.handleResult(success);
    }
  }

  private buildAddForm() {
    this.incomePayAddForm.storeId = SessionUtil.getInstance().getStoreId();
    this.incomePayAddForm.remark = this.viewData.remark;
    this.incomePayAddForm.category = this.viewData.chooseIncomeOrPay.category;
    this.incomePayAddForm.incomePayTime = this.getIncomePayTime(this._incomePayDate,this.curIncomePayTime);
    this.incomePayAddForm.buserId = this.viewData.chooseClerk.id;
    if (this.incomePayAddForm.category == IncomePayCategoryEnum.PAY) {
      this.incomePayAddForm.typeId = this.viewData.payTypeId;
    } else if (this.incomePayAddForm.category == IncomePayCategoryEnum.INCOME) {
      this.incomePayAddForm.typeId = this.viewData.incomeTypeId;
    }
    this.incomePayAddForm.money = this.viewData.money;
    console.log(this.incomePayAddForm);
  }

  /**验证表单*/
  private checkForm(): boolean {
    if (this.viewData.chooseIncomeOrPay.category < 0
      || AppUtils.isNullObj(this.getIncomePayTime(this._incomePayDate,this.curIncomePayTime))
      || Number(this.viewData.chooseClerk.id) <= 0 || AppUtils.isNullObj(this.viewData.chooseClerk.id)
      || (AppUtils.isNullObj(this.incomePayAddForm.typeId) || Number(this.incomePayAddForm.typeId) <= 0)
      || this.viewData.money <= 0 || AppUtils.isNullObj (this.viewData.money)) {
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
      AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.NEW_SUCCESS);
      // history.go(-1);
      AppRouter.goIncomePayList();
    } else {
      AppUtils.showError(PromptMsg.PROMPT, PromptMsg.NEW_ERROR);
    }
  }

  /**
   * 选择分类change事件
   */
  changeType(target) {
    this.incomePayAddForm.typeId = target.value;
  }

  //增加收入分类
  public addIncomePayType () {
    const activeModel = ZmModalMgr.getInstance().newSmallModal(IncomePayTypeComponent, null, null);
    activeModel.componentInstance.category = this.viewData.chooseIncomeOrPay.category;
    activeModel.componentInstance.modalHeader = '新建分类';
    let tmp = this;
    activeModel.componentInstance.action = (typeId : number) =>{
      tmp.refreshTypeList(typeId.toString());
    }
  }

  private refreshTypeList(addTypeId: string) {
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeIncomePaySynDataHolder.getData(storeId).then(
      (storeIncomePay) => {
        this.viewData.typeList = storeIncomePay.getValidIncomePayTypeList();
        this.viewData.payTypeListShow = this.viewData.typeList.filter((item)=>{
          if (item.category == IncomePayCategoryEnum.PAY) {
            return true;
          } else  {
            return false;
          }
        });

        this.viewData.incomeTypeListShow = this.viewData.typeList.filter((item)=>{
          if (item.category == IncomePayCategoryEnum.INCOME) {
            return true;
          } else  {
            return false;
          }
        });
        let typeArray: Array<IncomePayType> = this.viewData.typeList.filter((item) => {
          if (item.category == this.viewData.chooseIncomeOrPay.category && item.id == addTypeId) {
            return true;
          }
        })
        if (this.viewData.chooseIncomeOrPay.category == IncomePayCategoryEnum.INCOME) {
          this.viewData.incomeTypeId = typeArray && typeArray.length > 0 ? typeArray[0].id : '0';
        } else if (this.viewData.chooseIncomeOrPay.category == IncomePayCategoryEnum.PAY) {
          this.viewData.payTypeId = typeArray && typeArray.length > 0 ? typeArray[0].id : '0';
        }
        this.service.handleViewData(this.viewData);
      });
  }

  //返回
  close() {
    AppRouter.goIncomePayList();
  }

  // 保存
  addIncomepay() {
    this.addIncomePay();
  }

}

class AddIncomePayService {
  constructor(private incomePayMgr: IncomePayMgr,
              private storeIncomePaySynDataHolder: StoreIncomePaySynDataHolder,
              private storeIncomePayViewDataMgr: StoreIncomePayViewDataMgr,
              private storeClerkInfoSynDataHolder: StoreClerkInfoSynDataHolder,
              private buserCacheMgr: BUserCacheMgr,) {
  }

  public initViewData(category:number) {
    let viewDataTmp = new AddIncomePayViewData();
    this.storeIncomePayViewDataMgr.setAddIncomePayViewData(viewDataTmp);

    this.buildViewData(category,(viewDataP: AddIncomePayViewData) => {
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP) {
    this.storeIncomePayViewDataMgr.setAddIncomePayViewData(viewDataP);
  }

  /**
   *新建收支方法
   *@param formData:incomePayAddForm
   *@returns Promise<boolean>
   */
  public addIncomePay(formData: IncomePayAddForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.incomePayMgr.addIncomePay(formData).then(
        (incomePay) => {
          resolve(incomePay != null);
        }
      )
    });
  }

  /**
   * 查询员工信息
   * @param {(viewDataP: AddIncomePayViewData) => void} callback
   * @returns {Promise<void>}
   */
  public async buildViewData(category:number,callback: (viewDataP: AddIncomePayViewData) => void) {

    let viewDataTmp = new AddIncomePayViewData();
    let storeId = SessionUtil.getInstance().getStoreId();
    //请求分类
    let storeIncomePay: StoreIncomePay = await this.storeIncomePaySynDataHolder.getData(storeId);
    let incomePayTypeList: Array<IncomePayType> = storeIncomePay.getValidIncomePayTypeList();
    viewDataTmp.typeList = incomePayTypeList;
    viewDataTmp.payTypeListShow = incomePayTypeList.filter((item)=>{
      if (item.category == IncomePayCategoryEnum.PAY) {
        return true;
      } else  {
        return false;
      }
    });

    viewDataTmp.incomeTypeListShow = incomePayTypeList.filter((item)=>{
      if (item.category == IncomePayCategoryEnum.INCOME) {
        return true;
      } else  {
        return false;
      }
    });

    viewDataTmp.chooseIncomeOrPay = viewDataTmp.incomeOrPayList[category];

    let typeArray: Array<IncomePayType> = incomePayTypeList.filter((item) => {
      if (item.category == viewDataTmp.chooseIncomeOrPay.category) {
        return true;
      }
    })
    if (viewDataTmp.chooseIncomeOrPay.category == IncomePayCategoryEnum.INCOME) {
      viewDataTmp.incomeTypeId = typeArray && typeArray.length > 0 ? typeArray[0].id : '0';
    } else if (viewDataTmp.chooseIncomeOrPay.category == IncomePayCategoryEnum.PAY) {
      viewDataTmp.payTypeId = typeArray && typeArray.length > 0 ? typeArray[0].id : '0';
    }

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
    callback(viewDataTmp);
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

}

export class AddIncomePayViewData {
  public incomeOrPayList: Array<IncomeOrPay> = new Array<IncomeOrPay>();
  public typeList: Array<IncomePayType> = new Array<IncomePayType>();
  public incomeTypeListShow: Array<IncomePayType> = new Array<IncomePayType>();
  public payTypeListShow: Array<IncomePayType> = new Array<IncomePayType>();

  public chooseIncomeOrPay: IncomeOrPay = new IncomeOrPay();

  public chooseClerk: FollowClerk = new FollowClerk();

  public incomePayTime: any;
  public buserId: string;
  public incomeTypeId: string = '0';
  public payTypeId: string = '0';
  public money: number;
  public remark: string;

  public buserMap: ZmMap<BUser>;
  public clerkMap: ZmMap<ClerkInfo>;
  public roleMap: ZmMap<StoreAdminRole>;

  //选中的员工
  public followClerkMap: ZmMap<FollowClerk> = new ZmMap<FollowClerk>();
  public clerkList: Array<FollowClerk> = new Array<FollowClerk>();

  constructor() {
    this.incomeOrPayList = [];

    let pay: IncomeOrPay = new IncomeOrPay();
    pay.category = IncomePayCategoryEnum.PAY;
    pay.name = '支出';
    this.incomeOrPayList.push(pay);

    let income: IncomeOrPay = new IncomeOrPay();
    income.category = IncomePayCategoryEnum.INCOME;
    income.name = '收入';
    this.incomeOrPayList.push(income);

    }

}

export class AddFormData {
  catergry: number;
  time: string;
  buserId: string;
  typeId: string;
  price: number;
  descript: string;
}

export class IncomeOrPay {
  category: number;
  name: string;
}

//对应跟进人员bean
export class FollowClerk {
  public id: string;
  public name: string;
  public phone: string;
}


