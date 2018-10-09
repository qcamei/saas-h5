import {Component, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {LeaguerRecordMgr} from "../../../../bsModule/leaguerRecord/LeaguerRecordMgr";
import {StoreLeaguerInfoViewDataMgr} from "../../StoreLeaguerInfoViewDataMgr";
import {ActivatedRoute} from "@angular/router";
import {LeaguerRecordAddForm} from "../../../../bsModule/leaguerRecord/apiData/LeaguerRecordAddForm";
import {LeaguerRecord} from "../../../../bsModule/leaguerRecord/data/LeaguerRecord";
import {AppUtils} from "../../../../comModule/AppUtils";
import {AppCfg} from "../../../../comModule/AppCfg";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {AppRouter} from "../../../../comModule/AppRouter";
import {LeaguerDetailTabEnum} from "../leaguerDetailTabEnum";
import { RelateProductPopup } from "../../comp/relateProductPopup/relateProductPopup";
import {RelateOrderPopup} from "../../comp/relateOrderPopup/relateOrderPopup";
import {SimpleOrderItem} from "../../comp/relateOrderPopup/relateOrderViewData";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {SimpleProductItem} from "../../comp/relateProductPopup/simpleProductItem";

/**
 * 添加会员跟进记录
 */
@Component({
  selector:'add-record',
  templateUrl:'addRecord.html',
  styleUrls:['addRecord.scss'],
})
export class AddRecordPage implements OnInit,OnDestroy {

  private viewDataSub:any;
  private paramSub:any;
  private service:AddRecordService;
  public viewData:AddRecordViewData;

  constructor(
              private leaguerRecordMgr:LeaguerRecordMgr,
              private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr,
              private route:ActivatedRoute,
              private cdRef:ChangeDetectorRef,
              matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new AddRecordService(this.leaguerRecordMgr,this.storeLeaguerInfoViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeLeaguerInfoViewDataMgr.subscribeAddRecordVD((viewDataP:AddRecordViewData)=>{
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })

    this.paramSub = this.route.params.subscribe((params)=>{
      let leaguerId = params['leaguerId'];
      this.service.initViewData(leaguerId);
    })
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 删除订单
   */
  clearOrder(){
    this.viewData.selectedOrder = undefined;
    this.viewData.selectedProductList = undefined;
  }

  /**
   * 删除项目
   */
  clearProducts(){
    this.viewData.selectedProductList = undefined;
  }

  /**
   * 选择关联项目
   */
  selectProduct(){
    if(!AppUtils.isNullObj(this.viewData.selectedOrder)){
      const activeModal = ZmModalMgr.getInstance().newModal(RelateProductPopup,null,null);
      activeModal.componentInstance.data = this.viewData.selectedOrder;
      activeModal.componentInstance.selectedProductList = this.viewData.selectedProductList;
      activeModal.componentInstance.action = (selectedProductList:Array<SimpleProductItem>)=>{
        this.viewData.selectedProductList = selectedProductList;
        this.storeLeaguerInfoViewDataMgr.setAddRecordViewData(this.viewData);
      };
    }else{
      AppUtils.showWarn("提示","请先添加关联订单");
    }
  }

  /**
   * 选择关联订单 弹框
   */
  selectOrder(){
    const activeModal = ZmModalMgr.getInstance().newModal(RelateOrderPopup,null,null);
    activeModal.componentInstance.leaguerId = this.viewData.addForm.leaguerId;
    activeModal.componentInstance.orderId = this.viewData.selectedOrder?this.viewData.selectedOrder.id:undefined;
    activeModal.componentInstance.action = (item:SimpleOrderItem)=>{
      if(this.viewData.selectedOrder && (item.id != this.viewData.selectedOrder.id)){
        this.clearProducts();
      }
      this.viewData.selectedOrder = item;
      this.storeLeaguerInfoViewDataMgr.setAddRecordViewData(this.viewData);
    };
  }

  /**
   * 点击事件 添加跟进记录
   */
  addLeaguerRecord(){
    let addForm = this.viewData.addForm;
    // if(AppUtils.isNullObj(addForm.title) || (!AppUtils.isNullObj(addForm.title) && AppUtils.isNullOrWhiteSpace(addForm.title))){
    //   AppUtils.showWarn("提示","标题不能为空");
    // }else
    if((AppUtils.isNullObj(addForm.content) || (!AppUtils.isNullObj(addForm.content) && AppUtils.isNullOrWhiteSpace(addForm.content)))
      && (addForm.imgPaths.length == 0)){
      AppUtils.showWarn("提示","内容和图片不能同时为空");
    }else{
      if(!AppUtils.isNullObj(this.viewData.selectedOrder)){
        addForm.orderId = this.viewData.selectedOrder.id;
        addForm.orderContent = this.viewData.selectedOrder.content;
      }
      if(!AppUtils.isNullObj(this.viewData.selectedProductList) && (this.viewData.selectedProductList.length > 0)){
        addForm.prdIds = this.viewData.selectedProductList.map((item:SimpleProductItem)=>{
          return item.pgId;
        });
      }else{
        addForm.prdIds = [];
      }
      addForm.title = AppUtils.trimBlank(addForm.title);
      this.service.addLeaguerRecord(addForm).then((leaguerRecord:LeaguerRecord)=>{
        if(!AppUtils.isNullObj(leaguerRecord)){
          AppUtils.showSuccess("提示","添加成功");
          AppRouter.goLeaguerDetailByTab(this.viewData.addForm.leaguerId,LeaguerDetailTabEnum.RECORD);
        }else{
          AppUtils.showError("提示","添加失败");
        }
      })
    }
  }

  /**
   * 获取可上传图片数量
   * @returns {number}
   */
  getLimitCount():number{
    return 9-this.viewData.addForm.imgPaths.length;
  }

  /**
   * 上传图片回调
   * @param imgArr
   */
  setImgUrl(imgArr: Array<string>) {
    if (imgArr && (imgArr.length > 0) && (this.viewData.addForm.imgPaths.length <= 9)){
      imgArr.forEach((item:string)=>{
        this.viewData.addForm.imgPaths.push(item);
      })
    }
  }

  goLeaguerList(){
    AppRouter.goFindLeaguer();
  }

  goLeaguerDetail(){
    let leaguerId = this.route.snapshot.params["leaguerId"];
    AppRouter.goLeaguerDetail(leaguerId);
  }

}

export class AddRecordService{
  constructor(private leaguerRecordMgr:LeaguerRecordMgr,private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr,){}

  public initViewData(leaguerId:string){
    let viewDataTmp = new AddRecordViewData();
    viewDataTmp.addForm.leaguerId = leaguerId;
    this.storeLeaguerInfoViewDataMgr.setAddRecordViewData(viewDataTmp);
  }

  /**
   * 添加跟进记录
   * @param addForm
   * @returns {Promise<LeaguerRecord>}
   */
  public addLeaguerRecord(addForm:LeaguerRecordAddForm):Promise<LeaguerRecord>{
    return this.leaguerRecordMgr.addLeaguerRecord(addForm);
  }

}

export class AddRecordViewData{
  public selectedProductList:Array<SimpleProductItem>;
  public selectedOrder: SimpleOrderItem;
  public addForm:LeaguerRecordAddForm = new LeaguerRecordAddForm()
  public requestUrl:string = AppCfg.getInstance().getServiceAddress() + "/img/saveImgs/img/leaguerRecord/" + SessionUtil.getInstance().getStoreId();
  constructor(){
    this.addForm.imgPaths = new Array<string>();
  }
}
