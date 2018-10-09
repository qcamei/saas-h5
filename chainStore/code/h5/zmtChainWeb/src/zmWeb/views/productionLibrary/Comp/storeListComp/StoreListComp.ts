import {Component, OnInit, OnDestroy,Inject} from '@angular/core';
import {AppUtils} from "../../../../comModule/AppUtils";
import {StoreVD} from "../../../chainPackageProject/packageProject/addPackage/addPackage";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'distribution-list',
  template: `
  <!--选择门店-->
      <div animation-modal>
          <h2 mat-dialog-title>
              选择门店
          </h2>
           <mat-dialog-content>
             <mat-toolbar style="padding-top:15px;margin-bottom:15px;">
               <mat-toolbar-row fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="20px" class="zmFullWidth">
                  <div fxLayout="row "  fxLayoutGap="20px" >
        
                    <div  fxFlexAlign="center"  >
                      <zm_search_box [label]=" ''" [placeholder]="'输入店铺名称'" [(zmValue)]="queryName" (callBack)="getStoreByName()"></zm_search_box>
                    </div>
                  </div>
     
              </mat-toolbar-row>

          </mat-toolbar>
       <!--<mat-selection-list >
          <mat-list-option *ngFor="let item of storeListTmp">
            {{item.name}}
            <div *ngIf="storeListTmp&&storeListTmp.length==0" style="height:125px;"><p style="margin-top:90px;text-align:center;color:#999;">选择门店为空</p></div>
          </mat-list-option>
          </mat-selection-list>-->

 

            <ng-template #tdA let-item="item">{{item.name}}</ng-template>
              <zm-mat-table-checkbox  [tdTemplateList]="[tdA]" [thNameList]="['店铺名称']" [itemList]="storeListTmp"></zm-mat-table-checkbox>
               
              <div *ngIf="storeListTmp&&storeListTmp.length==0" style="height:125px;"><p style="margin-top:90px;text-align:center;color:#999;">选择门店为空</p></div>
         
            </mat-dialog-content>
            
            <mat-dialog-actions fxLayout="row" fxLayoutGap="20px" fxLayoutAlign="end" style="mt-20">
                  <zm_btn_md  [stroked] = "true" (click)="closeModal()" name="取消"></zm_btn_md>
                  
                  <zm_btn_md  (click)="confirmSelect()" name="确定"></zm_btn_md>
            </mat-dialog-actions>
      </div>

  <!--选择门店-->
  


`,
styles:[`
::-webkit-scrollbar{
  width: 3px !important;
}
::-webkit-scrollbar-thumb
{
  border-radius: 10px !important;
  background-color: #03a9f4 !important;
}
`]
})
export class StoreListComp implements OnInit,OnDestroy {

  storeList: Array<StoreVD>;
  callback: (storeList) => void;
  activeModal;

  private selectedStoreList: Array<StoreVD> = new Array<StoreVD>();
  public queryName: string;
  public storeListTmp: Array<StoreVD> = new Array<StoreVD>();


  constructor(@Inject(MAT_DIALOG_DATA) public dataInput:any){
    this.activeModal = dataInput.modalCtrl;
    this.storeList =  dataInput.modalData.storeList;
    this.callback = dataInput.callBack ;
  }

  ngOnInit() {
    this.storeListTmp = this.storeList;
  }

  ngOnDestroy(): void {

  }


  getStoreByName() {
    let storeList = this.storeList;
    if (!AppUtils.isNullOrWhiteSpace(this.queryName)) {
      storeList = this.storeListTmp.filter((item) => {
        if (item.name == this.queryName || item.name.indexOf(this.queryName) > -1) {
          return true;
        } else {
          return false;
        }
      });
    }
    this.storeListTmp = storeList;
  }

  changeClick(item) {
    item.checked = !item.checked;
  }

  confirmSelect() {
    this.selectedStoreList = this.storeList.filter((item) => {
      if (item.checked == true) {
        return true;
      } else {
        return false;
      }
    });
    this.callback(this.selectedStoreList);
    this.closeModal();

  }

  closeModal() {
    this.activeModal.close();
  }


}

