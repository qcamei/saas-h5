import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {MatDialog} from "@angular/material";

import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {StoreIncomePayMgr} from "../../../bsModule/incomePay/StoreIncomePayMgr";
import {StoreIncomePaySynDataHolder} from "../../../bsModule/incomePay/StoreIncomePaySynDataHolder";
import {AppUtils} from "../../../comModule/AppUtils";
import {StoreIncomePayViewDataMgr} from "../StoreIncomePayViewDataMgr";
import {IncomePayType} from "../../../bsModule/incomePay/data/IncomePayType";
import {BusinessUtil} from "../../common/Util/BusinessUtil";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {IncomePayTypeRemoveForm} from "../../../bsModule/incomePay/apiData/IncomePayTypeRemoveForm";
import {Popup} from "../../common/popup/popup";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {IncomePayMgr} from "../../../bsModule/incomePay/IncomePayMgr";
import {IncomePayQueryForm} from "../../../bsModule/incomePay/apiData/IncomePayQueryForm";
import {PageResp} from "../../../comModule/PageResp";

import {IncomePayTypeComponent} from "./incomePayTypeModule";
import {IncomePayCategoryEnum} from "../../../bsModule/incomePay/apiData/IncomePayCategoryEnum";
import {Constants} from "../../common/Util/Constants";
@Component({
  selector: 'incomePayType-page',
  templateUrl: 'incomePayType.html',

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

  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncomePayTypeListPage implements OnInit, OnDestroy {

  private service: IncomePayTypeListService;
  public viewData: IncomePayTypeListViewData;
  private viewDataSub: any;
  public catogery:number = IncomePayCategoryEnum.PAY;

  constructor(
    private storeIncomePayMgr: StoreIncomePayMgr,
    private incomePayMgr: IncomePayMgr,
    private storeIncomePaySynDataHolder: StoreIncomePaySynDataHolder,
    private storeIncomePayViewDataMgr: StoreIncomePayViewDataMgr,
    private cdRef: ChangeDetectorRef,
    matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new IncomePayTypeListService(
      this.storeIncomePayMgr, this.incomePayMgr, this.storeIncomePaySynDataHolder, this.storeIncomePayViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeIncomePayViewDataMgr.subscribeStoreIncomePayTypeListVD((viewDataP: IncomePayTypeListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData(this.catogery);
  }

  ngOnDestroy(): void {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 新建模态框
   */
  newModal() {
    const activeModel = ZmModalMgr.getInstance().newSmallModal(IncomePayTypeComponent, null, null);
    activeModel.componentInstance.category = this.viewData.category;
    activeModel.componentInstance.modalHeader = '新建分类';
    let tmp = this;
    activeModel.componentInstance.action = () =>{
      tmp.service.initViewData(this.catogery);//回调刷新列表
    }
  }

  /**
   * 编辑模态框
   */
  compileModal(typeId) {
   const activeModel = ZmModalMgr.getInstance().newSmallModal(IncomePayTypeComponent, null, null);
   activeModel.componentInstance.category = this.viewData.category;
   activeModel.componentInstance.modalHeader = '编辑分类';
   activeModel.componentInstance.typeId = typeId;
   let tmp = this;
   activeModel.componentInstance.action = () =>{
     tmp.service.initViewData(this.catogery);//回调刷新列表
   }
  }

  /**
   * 删除收支分类
   */
  deleteType(type: IncomePayType) {
    let tmp = this;
    Popup.getInstance().open("删除收支分类", "确定删除#" + type.name + "#?", () => {

      //判断收支分类下面是否有收支
      this.checkHasUsed(type).then(
        (canDelete) => {
          if (canDelete) {//true
            tmp.removeType(type);
          } else {
            tmp.showMsg();
          }
        }
      );

    });
  }

  private async checkHasUsed(incomePayType: IncomePayType) {
    var canDelete = true;//可以删
    let storeId = SessionUtil.getInstance().getStoreId();

    var queryForm: IncomePayQueryForm = new IncomePayQueryForm();
    queryForm.category = Constants.DEFAULT_STATE_VALUE;
    queryForm.buserId = Constants.DEFAULT_STATE_VALUE;
    queryForm.storeId = storeId;
    queryForm.minMoney = 0;
    queryForm.maxMoney = 0;
    queryForm.pageNo = 1;
    queryForm.pageItemCount = 1;
    let pageResp: PageResp = await this.incomePayMgr.findIncomePayPageInfo(queryForm);
    let totalCount = pageResp.totalCount;
    canDelete = totalCount <= 0;
    return canDelete;
  }

  private removeType(type: IncomePayType) {
    let storeId = SessionUtil.getInstance().getStoreId();
    let removeTypeData = new IncomePayTypeRemoveForm();
    removeTypeData.incomePayTypeId = type.id;
    this.service.deleteIncomePayType(removeTypeData).then(
      (success) => {
        if (success) {
          AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.DELETE_SUCCESS);
          this.service.initViewData(this.catogery);
        } else {
          AppUtils.showError(PromptMsg.PROMPT, PromptMsg.DELETE_ERROR);
        }
      }
    );
  }

  private showMsg() {
    Popup.getInstance().open("提示", "该分类下还有收支，请移除后再进行删除", () => {
    });
  }


  /**
   * 根据名称查询收支分类 点击事件
   */
  queryTypeListByName() {
    let queryParam : string;
    if (this.viewData.category == IncomePayCategoryEnum.PAY) {
      this.viewData.payTypeName = AppUtils.isNullOrWhiteSpace(this.viewData.payTypeName)?'':AppUtils.trimBlank(this.viewData.payTypeName);
      queryParam = this.viewData.payTypeName;
    } else if (this.viewData.category == IncomePayCategoryEnum.INCOME) {
      this.viewData.incomeTypeName = AppUtils.isNullOrWhiteSpace(this.viewData.incomeTypeName)?'':AppUtils.trimBlank(this.viewData.incomeTypeName);
      queryParam = this.viewData.incomeTypeName;
    }
    this.service.queryTypeListReq(this.viewData, queryParam, (viewDataTmp: IncomePayTypeListViewData) => {
      this.handleResult(viewDataTmp)
    });
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    let data = this.viewData.incomePayTypeListTmp;
    let incomeData = this.viewData.incomeTypeListTmp;
    let payData = this.viewData.payTypeListTmp;
    let pageData = AppUtils.getPageData(curPage, data);
    this.viewData.incomePayTypeListShow = pageData;
    this.viewData.incomeTypeListShow = incomeData;
    this.viewData.payTypeListShow = payData;
  }

  private handleResult(viewDataTmp: IncomePayTypeListViewData) {
    if (!AppUtils.isNullObj(viewDataTmp)) {
      this.viewData.incomePayTypeListTmp = viewDataTmp.incomePayTypeListTmp;
      this.viewData.incomeTypeListTmp = viewDataTmp.incomeTypeListTmp;
      this.viewData.payTypeListTmp = viewDataTmp.payTypeListTmp;

      this.viewData.payRecordCount = viewDataTmp.payRecordCount;
      this.viewData.incomeRecordCount = viewDataTmp.incomeRecordCount;

      this.viewData.incomePayTypeListShow = viewDataTmp.incomePayTypeListShow;
      this.viewData.incomeTypeListShow = viewDataTmp.incomeTypeListShow;

      this.viewData.payTypeListShow = viewDataTmp.payTypeListShow;
      this.viewData.curPage = 1;
    }
    this.storeIncomePayViewDataMgr.setStoreIncomePayTypeListViewData(this.viewData);

  }

  onTabSelect(e) {
    this.catogery = e.index;
    this.viewData.category = e.index;
    this.queryTypeListByName();
  }
}

export class IncomePayTypeListService {
  constructor(private storeIncomePayMgr: StoreIncomePayMgr,
              private incomePayMgr: IncomePayMgr,
              private storeIncomePaySynDataHolder: StoreIncomePaySynDataHolder,
              private storeIncomePayViewDataMgr: StoreIncomePayViewDataMgr) {
  }

  public initViewData(category:number) {
    this.storeIncomePayViewDataMgr.setStoreIncomePayTypeListViewData(new IncomePayTypeListViewData());

    this.buildViewData().then(
      (viewDataTmp: IncomePayTypeListViewData) => {
        viewDataTmp.category = category;
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: IncomePayTypeListViewData) {
    this.storeIncomePayViewDataMgr.setStoreIncomePayTypeListViewData(viewDataP);
  }

  /**
   * 组装IncomePayTypeListViewData
   * @param storeId:string
   * @returns Promise<IncomePayTypeListViewData>
   */
  public buildViewData(): Promise<IncomePayTypeListViewData> {
    return new Promise<IncomePayTypeListViewData>(resolve => {
      let storeId = SessionUtil.getInstance().getStoreId();
      let incomePayTypeListTmp: Array<IncomePayType> = new Array<IncomePayType>();
      let incomeTypeListTmp: Array<IncomePayType> = new Array<IncomePayType>();
      let payTypeListTmp: Array<IncomePayType> = new Array<IncomePayType>();
      let viewDataTmp: IncomePayTypeListViewData = new IncomePayTypeListViewData();
      this.storeIncomePayMgr.getStoreIncomePay(storeId).then(
        (storeIncomePay) => {
          incomePayTypeListTmp = storeIncomePay.getValidIncomePayTypeList();
          viewDataTmp.incomePayTypeList = incomePayTypeListTmp;//原始数据
          //赋值
          viewDataTmp.incomeTypeList = incomeTypeListTmp = incomePayTypeListTmp.filter((item :IncomePayType) =>{
            if (item.category == IncomePayCategoryEnum.INCOME) {
              return true;
            } else  {
              return false;
            }
          })

          viewDataTmp.payTypeList = payTypeListTmp = incomePayTypeListTmp.filter((item :IncomePayType) =>{
            if (item.category == IncomePayCategoryEnum.PAY) {
              return true;
            } else  {
              return false;
            }
          })

          incomePayTypeListTmp = BusinessUtil.sortListObject(incomePayTypeListTmp);//排序
          incomeTypeListTmp = BusinessUtil.sortListObject(incomeTypeListTmp);//排序
          payTypeListTmp = BusinessUtil.sortListObject(payTypeListTmp);//排序
          //赋值
          viewDataTmp.incomePayTypeListShow = AppUtils.getPageData(1, incomePayTypeListTmp);
          viewDataTmp.incomeTypeListShow = AppUtils.getPageData(1, incomeTypeListTmp);
          viewDataTmp.payTypeListShow = AppUtils.getPageData(1, payTypeListTmp);
          viewDataTmp.incomeRecordCount = viewDataTmp.incomeTypeList.length;
          viewDataTmp.payRecordCount = viewDataTmp.payTypeList.length;

          viewDataTmp.loadingFinish = true;
          resolve(viewDataTmp);
        }
      );
    });
  };

  /**
   * 根据名称查询分类列表
   * @param storeId:string
   * @param name:string
   * @param handleCallBack:(incomePayTypeListTmp:Array<IncomePayType>)
   **/

  public queryTypeListReq(viewData, name: string, handleCallBack: (viewDataTmp: IncomePayTypeListViewData) => void) {
    let incomePayTypeListTmp: Array<IncomePayType> = viewData.incomePayTypeList;
    let viewDataTmp: IncomePayTypeListViewData = new IncomePayTypeListViewData();
    incomePayTypeListTmp = this.filterListByName(name, incomePayTypeListTmp);
    incomePayTypeListTmp = BusinessUtil.sortListObject(incomePayTypeListTmp);//排序
    viewDataTmp.incomePayTypeListTmp = incomePayTypeListTmp;

    viewDataTmp.incomeTypeListTmp = viewDataTmp.incomePayTypeListTmp.filter((item :IncomePayType) =>{
      if (item.category == IncomePayCategoryEnum.INCOME) {
        return true;
      } else  {
        return false;
      }
    })

    viewDataTmp.payTypeListTmp = viewDataTmp.incomePayTypeListTmp.filter((item :IncomePayType) =>{
      if (item.category == IncomePayCategoryEnum.PAY) {
        return true;
      } else  {
        return false;
      }
    })

    viewDataTmp.payRecordCount = viewDataTmp.payTypeListTmp.length;
    viewDataTmp.incomeRecordCount = viewDataTmp.incomeTypeListTmp.length;
    viewDataTmp.incomePayTypeListShow = AppUtils.getPageData(1, incomePayTypeListTmp);
    viewDataTmp.incomeTypeListShow = AppUtils.getPageData(1, viewDataTmp.incomeTypeListTmp);
    viewDataTmp.payTypeListShow = AppUtils.getPageData(1, viewDataTmp.payTypeListTmp);
    handleCallBack(viewDataTmp);
  }

  /**
   *
   * @param viewData
   * @param {string} typeId
   */
  public async queryIncomePayListWithTypeId(typeId: string) {
    var queryForm: IncomePayQueryForm;
    queryForm.typeId = typeId;
    queryForm.pageNo = 1;
    queryForm.pageItemCount = 1;
    queryForm.category = Constants.DEFAULT_STATE_VALUE;
    let pageResp: PageResp = await this.incomePayMgr.findIncomePayPageInfo(queryForm);
    return pageResp.totalCount;
  }

  /**根据名称过滤分类列表*/
  private filterListByName(name, incomePayTypeListTmp) {
    incomePayTypeListTmp = incomePayTypeListTmp.filter(itemTmp => {
      if (itemTmp.name == name || (itemTmp.name && itemTmp.name.indexOf(name) > -1)) {
        return true;
      } else {
        return false;
      }
    });
    return incomePayTypeListTmp;
  }

  /**
   * 删除收支分类
   */
  public deleteIncomePayType(removeData: IncomePayTypeRemoveForm) {
    return new Promise<boolean>(resolve => {
      this.storeIncomePayMgr.deleteIncomePayType(removeData).then(
        (success) => {
          resolve(success);
        });

    });
  }

}

export class IncomePayTypeListViewData {
  public incomePayTypeList: Array<IncomePayType> = new Array<IncomePayType>();//原始数据
  public incomeTypeList: Array<IncomePayType> = new Array<IncomePayType>();//原始数据 收入
  public payTypeList: Array<IncomePayType> = new Array<IncomePayType>();//原始数据 支出

  public incomePayTypeListTmp: Array<IncomePayType> = new Array<IncomePayType>();//临时数据
  public incomeTypeListTmp: Array<IncomePayType> = new Array<IncomePayType>();//临时数据 收入
  public payTypeListTmp: Array<IncomePayType> = new Array<IncomePayType>();//临时数据 支出

  public incomeRecordCount: number;//收入分页记录数
  public payRecordCount: number;//支出分页记录数
  public loadingFinish: boolean = false;

  public incomePayTypeListShow: Array<IncomePayType> = new Array<IncomePayType>();// 显示的所有数据
  public incomeTypeListShow: Array<IncomePayType> = new Array<IncomePayType>();//显示数据 收入分类
  public payTypeListShow: Array<IncomePayType> = new Array<IncomePayType>();//显示数据 支出分类

  public incomeTypeName: string = "";//查询输入框的值
  public payTypeName: string = "";//查询输入框的值
  public category:number; //IncomePayTypeCategoryEnum 收入还是支出

  public curPage = 1;

}
