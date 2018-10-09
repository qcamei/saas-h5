import {Component, Input, Inject} from '@angular/core';
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreGoodsMgr} from "../../../bsModule/storeGoods/StoreGoodsMgr";
import {Store} from "../../../bsModule/store/apiData/Store";
import {StoreGoods} from "../../../bsModule/storeGoods/data/StoreGoods";
import {StoreGoodsSynDataHolder} from "../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {AppUtils} from "../../../comModule/AppUtils";
import {GoodsTmp} from "../../../bsModule/storeGoods/data/GoodsTmp";
import {ImportSuccessPopup} from "../popup/ImportSuccessPopup";
import {RestResp} from "../../../comModule/RestResp";
import {setPopup} from "../popup/setPopup";
import {ImportDataViewData} from "../comp/importDataComponent";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";

/**从店铺导入商品组件**/

@Component({
  selector: 'goodsLead_modal',
  template: `


       <div animation-modal >
            <h2 mat-dialog-title>
               店铺商品导入
            </h2>
            <mat-dialog-content fusePerfectScrollbar>
                                              
                  <zm-select [noAll]="true" [label]="'选择商品来源'" name="name" value="id"  [selectList]="data.storeList" [(zmValue)]="data.storeId" (selectCallback)="queryListByStoreId()"></zm-select>            
                           
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
                   <ng-template #tdF let-item="item"><i class="fa fa-yen mr-1"></i>{{item.cost |number:'1.2-2'}}</ng-template>

                          
                   <zm-mat-table-checkbox  [tdTemplateList]="[tdA,tdB,tdC,tdD,tdE,tdF]" [thNameList]="['图片','商品编号','商品名称','商品分类','售价','成本']" [itemList]="data.goodsList"></zm-mat-table-checkbox>
                      
                      
                   <no-data [loadingFinish]="viewData.loadingFinish" [dataList]="data.goodsList" [text]=" '没有数据' " [showImg]="'noData'"></no-data>
            
            </mat-dialog-content>
            <mat-dialog-actions fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
                  <zm-btn-md  [stroked] = "true"(click)="closeModal()" name="取消"></zm-btn-md>
                <zm-btn-md  (click)="importData()" name="批量导入"></zm-btn-md>
            </mat-dialog-actions>
      </div>

  `,
  styleUrls: ['./modal.scss']
})
export class GoodsLeadModal {

  @Input() data: GoodsLeadViewData;
  public viewData: GoodsLeadViewData = new GoodsLeadViewData();
  public isSlectedAll: boolean = false;

  private activeModal: any;
  private modalService: ZmModalMgr;
  constructor(
              private storeGoodsMgr: StoreGoodsMgr,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,
              @Inject(MAT_DIALOG_DATA) dataInput:any,
              matDialog: MatDialog) {
    this.activeModal = dataInput.modalCtrl;
    this.modalService = ZmModalMgr.newInstance(matDialog);
  }

  public selectAll() {
    let goodsListTmp: Array<GoodsTmp> = new Array<GoodsTmp>();
    let list = this.data.goodsList;
    for (let item of list) {
      let goodsTmp = new GoodsTmp();
      AppUtils.copy(goodsTmp, item);
      goodsTmp.checked = this.isSlectedAll;
      goodsListTmp.push(goodsTmp);
    }
    this.data.goodsList = goodsListTmp;
  }

  public checkList() {
    let checkList = new Array<boolean>();
    for (let item of  this.data.goodsList) {
      checkList.push(item.checked);
    }
    if (AppUtils.arrayContains(checkList, false)) {
      this.isSlectedAll = false;
    } else {
      this.isSlectedAll = true;
    }
  }


  public closeModal() {
    this.activeModal.close();
  }

  public async queryListByStoreId() {
    let storeId = this.data.storeId;
    console.log(storeId);
    let storeGoods: StoreGoods = await this.storeGoodsSynDataHolder.getData(storeId);
    let goodsList = storeGoods.getValidGoodsList();
    let goodsListTmp: Array<GoodsTmp> = AppUtils.cloneArray(goodsList);
    let typeMapTmp = storeGoods.getTypeMap();
    for (let item of goodsListTmp) {
      item.typeName = typeMapTmp.get(item.typeId + "");
      item.checked = false;
    }
    this.data.goodsList = goodsListTmp;

  }

  public async importData() {

    this.buildTargetList();
    if (this.viewData.targetList.length > 0) {
      this.activeModal.close();
      let storeId: string = SessionUtil.getInstance().getStoreId();
      let restResp: RestResp = await this.storeGoodsMgr.addGoodsListFromStore(storeId, this.viewData.targetList);
      this.handleResult(restResp);
    } else {
      AppUtils.showWarn("提示", "请至少选择一条数据");
    }

  }

  private buildTargetList() {
    this.viewData.targetList = this.data.goodsList.filter(
      (item) => {
        if (item.checked == true) {
          return true;
        }
      }
    );
  }

  private handleResult(restResp: RestResp) {
    if(restResp.code == 200){
      // const activeModal = this.modalService.open(ImportSuccessPopup, {backdrop: 'static'});
      const activeModal = this.modalService.newModal(ImportSuccessPopup, null,null);
      activeModal.componentInstance.setContent = "商品" + "数据导入完成";
      activeModal.componentInstance.tips = restResp.tips;
      if(restResp.tips == "成功"){
        activeModal.componentInstance.tips = "";
      }
      activeModal.componentInstance.section = "商品";
    }else {
      this.failModal();
    }
  }

  private failModal() {
    // const activeModal = this.modalService.open(setPopup, {backdrop: 'static'});
    const activeModal = this.modalService.newModal(setPopup, null,null);
    activeModal.componentInstance.title = "导入失败";
    activeModal.componentInstance.setContent = "数据有误，请重新导入";
    activeModal.componentInstance.btnText = "";
    activeModal.componentInstance.confirmBtn = "确定";
  }
}
export class GoodsLeadViewData {
  public storeList: Array<Store> = new Array<Store>();
  public goodsList: Array<GoodsTmp> = new Array<GoodsTmp>();

  public targetList: Array<GoodsTmp> = new Array<GoodsTmp>();
  public storeId: string;
  public loadingFinish: boolean = true;

  constructor() {
  }

  public static fromParentComp(viewData: ImportDataViewData) {
    let goodsLeadViewData = new GoodsLeadViewData();
    goodsLeadViewData.storeId = viewData.defaultStoreId;
    goodsLeadViewData.storeList = viewData.storeList;
    goodsLeadViewData.goodsList = viewData.goodsListTmp;
    return goodsLeadViewData;
  }
}
