import {ActivatedRoute} from '@angular/router';
import {
  Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild,
  ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ComponentRef, OnDestroy
} from '@angular/core';
import {BillViewDataMgr} from "../billViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {WorkFlowSynDataHolder} from "../../../bsModule/workFlow/WorkFlowSynDataHolder";
import {WorkFlowData} from "../../../bsModule/workFlow/data/WorkFlowData";
import {AppointDetailComp} from "../../appointment/appointmentDetails/appointDetailComp";
import {ConsumeComp} from "../../storeflow/storeConsume/consumeComp";
import {ShowCompEnum} from "./showCompEnum";
import {WorkFlowDataStatusEnum} from "../../../bsModule/workFlow/data/WorkFlowDataStatusEnum";
import {OrderConsumeDetailComp} from "../../order/orderConsumeDetail/orderConsumeDetailComp";
import {EditConsumeBonusComp} from "../../order/editConsumeBonus/editConsumeBonusComp";
import {AddRecordComp} from "../../storeLeaguerInfo/leaguerDetail/addRecord/addRecordComp";
import {RecordListComp} from "../comp/recordListComp/recordListComp";
import {EditRecordComp} from "../../storeLeaguerInfo/leaguerDetail/editRecord/editRecordComp";

/**
 * 开单详情
 */
@Component({
  selector: 'bill-detail',
  templateUrl: 'billDetail.html',
  styleUrls: ['billDetail.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class BillDetailPage implements OnInit,OnDestroy {

  public viewDataSub:any;
  public paramSub:any;
  public viewData:BillDetailViewData;
  public service:BillDetailService;
  @ViewChild("compContainer", { read: ViewContainerRef }) compContainer: ViewContainerRef;
  componentRef: ComponentRef<any>;

  constructor(private workFlowSynDataHolder:WorkFlowSynDataHolder,
              private billViewDataMgr:BillViewDataMgr,
              private resolver: ComponentFactoryResolver,
              private cdRef: ChangeDetectorRef,
              private route:ActivatedRoute) {
    this.service = new BillDetailService(this.workFlowSynDataHolder,this.billViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.billViewDataMgr.subscribeDetailVD((viewData:BillDetailViewData)=>{
      this.viewData = viewData;
      this.cdRef.markForCheck();
    })
    this.paramSub = this.route.params.subscribe((params) =>{
      let workFlowId = params["workFlowId"];
      let compIndex = params["compIndex"];
      this.service.initViewData(workFlowId,(viewData:BillDetailViewData)=>{
        if(!AppUtils.isNullObj(viewData.workFlowData)){
          if(compIndex){
            if(compIndex == ShowCompEnum.Record){
              this.showCallback(ShowCompEnum.Record);
            }else if(compIndex == ShowCompEnum.Bonus){
              this.showCallback(ShowCompEnum.Bonus);
            }else if(compIndex == ShowCompEnum.Appoint){
              this.showCallback(ShowCompEnum.Appoint);
            }
          }else{
            if(viewData.workFlowData.status == WorkFlowDataStatusEnum.CANCEL){
              this.showCallback(ShowCompEnum.Cancel);
            }else if(viewData.workFlowData.orderInfo) {
              this.showCallback(ShowCompEnum.OrderDetail);
            }else{
              this.showCallback(ShowCompEnum.Consume);
            }
          }
        }
      });
    })
  }

  /**
   * 显示对应组件视图
   * @param index
   */
  showCallback(index:number,param?:any){
    if(this.viewData.showCompEnum == index){
      return;
    }
    this.showSavePopup().then((success:boolean)=>{
      if(success){
        this.viewData.showCompEnum = index;
        this.compContainer.clear();
        if(index == ShowCompEnum.Appoint){
          const factory: ComponentFactory<AppointDetailComp> = this.resolver.resolveComponentFactory(AppointDetailComp);
          this.componentRef = this.compContainer.createComponent(factory);
          this.componentRef.instance.appointId = this.viewData.workFlowData.appointInfo.appointId;
        }else if(index == ShowCompEnum.Consume){
          const factory: ComponentFactory<ConsumeComp> = this.resolver.resolveComponentFactory(ConsumeComp);
          this.componentRef = this.compContainer.createComponent(factory);
          this.componentRef.instance.workFlowId = this.viewData.workFlowData.id;
          this.componentRef.instance.saveCallback.subscribe(() => {
            this.service.refreshViewData(this.viewData);
          });
        }else if(index == ShowCompEnum.Cancel){
          const factory: ComponentFactory<ConsumeComp> = this.resolver.resolveComponentFactory(ConsumeComp);
          this.componentRef = this.compContainer.createComponent(factory);
          this.componentRef.instance.workFlowId = this.viewData.workFlowData.id;
        }else if(index == ShowCompEnum.OrderDetail){
          const factory: ComponentFactory<OrderConsumeDetailComp> = this.resolver.resolveComponentFactory(OrderConsumeDetailComp);
          this.componentRef = this.compContainer.createComponent(factory);
          this.componentRef.instance.orderId = this.viewData.workFlowData.orderInfo.orderId;
        }else if(index == ShowCompEnum.Bonus){
          const factory: ComponentFactory<EditConsumeBonusComp> = this.resolver.resolveComponentFactory(EditConsumeBonusComp);
          this.componentRef = this.compContainer.createComponent(factory);
          this.componentRef.instance.orderId = this.viewData.workFlowData.orderInfo.orderId;
          this.componentRef.instance.callback.subscribe(() => {

          });
        }else if(index == ShowCompEnum.Record){
          const factory: ComponentFactory<RecordListComp> = this.resolver.resolveComponentFactory(RecordListComp);
          this.componentRef = this.compContainer.createComponent(factory);
          this.componentRef.instance.leaguerId = this.viewData.workFlowData.leaguerInfo.leaguerId;
          this.componentRef.instance.workFlowDataId = this.viewData.workFlowData.id;
          if(this.viewData.workFlowData.orderInfo){
            this.componentRef.instance.orderId = this.viewData.workFlowData.orderInfo.orderId;
          }
          this.componentRef.instance.addCallback.subscribe(()=>{
            this.showCallback(ShowCompEnum.AddRecord);
          });
          this.componentRef.instance.editCallback.subscribe((leaguerRecordId)=>{
            this.showCallback(ShowCompEnum.EditRecord,leaguerRecordId);
          });
        }else if(index == ShowCompEnum.AddRecord){
          const factory: ComponentFactory<AddRecordComp> = this.resolver.resolveComponentFactory(AddRecordComp);
          this.componentRef = this.compContainer.createComponent(factory);
          this.componentRef.instance.leaguerId = this.viewData.workFlowData.leaguerInfo.leaguerId;
          this.componentRef.instance.workFlowDataId = this.viewData.workFlowData.id;
          if(this.viewData.workFlowData.orderInfo){
            this.componentRef.instance.orderId = this.viewData.workFlowData.orderInfo.orderId;
            this.componentRef.instance.editRelate = true;
          }else{
            this.componentRef.instance.editRelate = false;
          }
          this.componentRef.instance.callback.subscribe(()=>{
            this.showCallback(ShowCompEnum.Record);
          });
        }else if(index == ShowCompEnum.EditRecord){
          const factory: ComponentFactory<EditRecordComp> = this.resolver.resolveComponentFactory(EditRecordComp);
          this.componentRef = this.compContainer.createComponent(factory);
          this.componentRef.instance.leaguerRecordId = param;
          if(this.viewData.workFlowData.orderInfo){
            this.componentRef.instance.orderId = this.viewData.workFlowData.orderInfo.orderId;
            this.componentRef.instance.editRelate = true;
          }else{
            this.componentRef.instance.editRelate = false;
          }
          this.componentRef.instance.callback.subscribe(()=>{
            this.showCallback(ShowCompEnum.Record);
          });
        }else if(index == ShowCompEnum.Refund){
        }
        this.billViewDataMgr.setDetailViewData(this.viewData);
      }else{
        return;
      }
    })
  }

  private async showSavePopup():Promise<boolean> {
    let success:boolean = true;
    // if (!AppUtils.isNullObj(this.componentRef) && this.componentRef.instance instanceof ConsumeComp) {
    //   success = await this.componentRef.instance.showSavePopup();
    // }
    return success;
  }

  ngOnDestroy() {
    if(!AppUtils.isNullObj(this.componentRef)){
      this.componentRef.destroy();
    }
  }

}

export class BillDetailService{
  constructor(private workFlowSynDataHolder:WorkFlowSynDataHolder,private billViewDataMgr:BillViewDataMgr,){}

  public initViewData(workFlowId:string,callback:(viewData:BillDetailViewData)=>void){
    let viewDataTmp = new BillDetailViewData();
    this.billViewDataMgr.setDetailViewData(viewDataTmp);

    this.workFlowSynDataHolder.getData(workFlowId).then((workFlowData:WorkFlowData)=>{
      if(!AppUtils.isNullObj(workFlowData)){
        viewDataTmp.workFlowData = workFlowData;
      }
      callback(viewDataTmp);
    })
  }

  /**
   * 刷新viewData
   * @param viewData
   */
  public refreshViewData(viewData:BillDetailViewData){
    this.workFlowSynDataHolder.getData(viewData.workFlowData.id).then((workFlowData:WorkFlowData)=>{
      if(!AppUtils.isNullObj(workFlowData)){
        viewData.workFlowData = workFlowData;
      }
      this.billViewDataMgr.setDetailViewData(viewData);
    })
  }


}

export class BillDetailViewData{
  public workFlowData:WorkFlowData;
  public showCompEnum:number;
}
