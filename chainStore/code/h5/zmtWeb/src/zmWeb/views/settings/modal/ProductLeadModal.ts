import {Component, Input, Inject} from '@angular/core';

import {Store} from "../../../bsModule/store/apiData/Store";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {ImportSuccessPopup} from "../popup/ImportSuccessPopup";
import {RestResp} from "../../../comModule/RestResp";
import {setPopup} from "../popup/setPopup";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreProductInfoMgr} from "../../../bsModule/StoreProductInfo/StoreProductInfoMgr";
import {ProductInfoTmp} from "../../../bsModule/StoreProductInfo/data/ProductInfoTmp";
import {StoreProductInfo} from "../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {ImportDataViewData} from "../comp/importDataComponent";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";

/**从店铺导入项目组件**/

@Component({
  selector: 'productLead_modal',
  template: `

      <div animation-modal >
            <h2 mat-dialog-title>
               店铺项目导入
            </h2>
            <mat-dialog-content fusePerfectScrollbar>
                                              
                  <zm-select [noAll]="true" [label]="'选择项目来源'" name="name" value="id"  [selectList]="data.storeList" [(zmValue)]="data.storeId" (selectCallback)="queryListByStoreId()"></zm-select>            
                           
                   <ng-template #tdA let-item="item">
                         <div style="width:120px; height:92px; margin: 0 auto;">
                           <img *ngIf="item.defaultImg=='' " src="assets/images/pore.png" style="width: 100%; height:100%;"/>
                           <img *ngIf="item.defaultImg!='' " :src="{{item.defaultImg|imgPrePath}}" style="width: 100%; height:100%;"/>
                         </div>
                   </ng-template>
                   <ng-template #tdB let-item="item">{{item.number}}</ng-template>
                   <ng-template #tdC let-item="item">{{item.name}}</ng-template>
                   <ng-template #tdD let-item="item">{{item.typeName}}</ng-template>
                   <ng-template #tdE let-item="item"><i class="fa fa-yen mr-1"></i>{{item.price |number:'1.2-2'}}</ng-template>
                          
                   <zm-mat-table-checkbox  [tdTemplateList]="[tdA,tdB,tdC,tdD,tdE]" [thNameList]="['图片','项目编号','项目名称','项目分类','售价']" [itemList]="data.productList"></zm-mat-table-checkbox>
                      
                      
                   <no-data [loadingFinish]="viewData.loadingFinish" [dataList]="data.productList" [text]=" '没有数据' " [showImg]="'noData'"></no-data>
            
            </mat-dialog-content>
            <mat-dialog-actions fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
                  <zm-btn-md  [stroked] = "true"(click)="closeModal()" name="取消"></zm-btn-md>
                <zm-btn-md  (click)="importData()" name="批量导入"></zm-btn-md>
            </mat-dialog-actions>
      </div>

  `,
  styleUrls: ['./modal.scss']
})
export class ProductLeadModal{

  @Input() data:ProductLeadViewData;
  public viewData: ProductLeadViewData = new ProductLeadViewData();
  public isSlectedAll:boolean = false;

  private activeModal: any;
  private modalService:ZmModalMgr;
  constructor(
              private storePrdMgr: StoreProductInfoMgr,
              private storePrdSynDataHolder: StoreProductInfoSynDataHolder,
              @Inject(MAT_DIALOG_DATA) dataInput:any,
              matDialog: MatDialog) {
  this.activeModal = dataInput.modalCtrl;
  this.modalService = ZmModalMgr.newInstance(matDialog);
}

  public selectAll(){
    let productListTmp:Array<ProductInfoTmp> = new Array<ProductInfoTmp>();
    let list = this.data.productList;
    if(list.length>0){
      for(let item of list){
        let prdTmp = new ProductInfoTmp();
        AppUtils.copy(prdTmp,item);
        prdTmp.checked = this.isSlectedAll;
        productListTmp.push(prdTmp);
      }
    }

    this.data.productList = productListTmp;
  }

  public checkList(){
    let checkList = new Array<boolean>();
    for(let item of  this.data.productList){
      checkList.push(item.checked);
    }
    if(AppUtils.arrayContains(checkList,false)){
      this.isSlectedAll = false;
    }else{
      this.isSlectedAll = true;
    }
  }


  public closeModal() {
    this.activeModal.close();
  }

  public async queryListByStoreId(){
    let storeId = this.data.storeId;
    let storePrd:StoreProductInfo = await this.storePrdSynDataHolder.getData(storeId);
    let productList = storePrd.getValidProductInfoList();

    let productListTmp:Array<ProductInfoTmp> = AppUtils.cloneArray(productList);
    let typeMapTmp = storePrd.getTypeMap();
    for(let item of productListTmp){
      item.typeName = typeMapTmp.get(item.typeId+"");
      item.checked = false;
    }
    this.data.productList = productListTmp;
  }

  public async importData(){
    this.buildTargetList();
    if(this.viewData.targetList.length>0){
      this.activeModal.close();

      let storeId:string = SessionUtil.getInstance().getStoreId();
      let restResp:RestResp = await this.storePrdMgr.addProductListFromStore(storeId,this.viewData.targetList);
      this.handleResult(restResp);
    }else{
      AppUtils.showWarn("提示","请至少选择一条数据");
    }

  }

  private buildTargetList(){
    this.viewData.targetList = this.data.productList.filter(
      (item)=>{
        if(item.checked == true){
          return true;
        }
      }
    );
  }

  private handleResult(restResp:RestResp){
    if(restResp.code == 200){
      // const activeModal = this.modalService.open(ImportSuccessPopup, {backdrop: 'static'});
      const activeModal = this.modalService.newModal(ImportSuccessPopup, null,null);
      activeModal.componentInstance.setContent = "项目" + "数据导入成功";
      activeModal.componentInstance.tips = restResp.tips;
      if(restResp.tips == "成功"){
        activeModal.componentInstance.tips = "";
      }
      activeModal.componentInstance.section = "项目";
    }else {
     this.failModal();
    }
  }

  private failModal(){
    // const activeModal = this.modalService.open(setPopup,{backdrop: 'static'});
    const activeModal = this.modalService.newModal(setPopup, null,null);
    activeModal.componentInstance.title = "导入失败";
    activeModal.componentInstance.setContent = "数据有误，请重新导入";
    activeModal.componentInstance.btnText = "";
    activeModal.componentInstance.confirmBtn = "确定";
  }
}

export class ProductLeadViewData{
  public storeList:Array<Store> = new Array<Store>();
  public productList:Array<ProductInfoTmp> = new Array<ProductInfoTmp>();

  public targetList:Array<ProductInfoTmp> =  new Array<ProductInfoTmp>();
  public storeId:string;
  public loadingFinish:boolean = true;

  constructor(){

  }

  public static fromParentComp(viewData:ImportDataViewData){
    let productLeadViewData = new ProductLeadViewData();
    productLeadViewData.storeId = viewData.defaultStoreId;
    productLeadViewData.storeList = viewData.storeList;
    productLeadViewData.productList = viewData.productListTmp;
    return productLeadViewData;
  }
}
