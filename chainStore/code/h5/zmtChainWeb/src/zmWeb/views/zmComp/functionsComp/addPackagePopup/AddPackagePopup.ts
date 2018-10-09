import {Component, OnInit, Input, Output, Inject} from "@angular/core";
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AppUtils} from "../../../../comModule/AppUtils";
import {MAT_DIALOG_DATA} from "@angular/material";
import {PackageProjectType} from "../../../../bsModule/chainPackageProject/data/PackageProjectType";
import {ProductData} from "../../../chainCard/Comp/productCardContentComp/ProductCardContentCompViewData";

/**
 * 添加套餐弹出框
 */
@Component({
  selector: 'add-package',
  template: `
    <div animation-modal >
            <h2 mat-dialog-title>
               添加套餐
            </h2>
            <mat-dialog-content fusePerfectScrollbar>
                    
                    <div fxLayout="row wrap">
                       <zm_select style="width: 200px;" [label]="'分类'" [selectList]="data.packageTypeList" [(zmValue)]="viewData.typeId" value="id" name="name" (selectCallback)="queryList()"></zm_select>
                   
                       <zm_search_box [label]=" '查询'" [placeholder]="'请输入套餐名称'" [(zmValue)]="viewData.name" (callBack)="queryList()"></zm_search_box>
                    </div>
                    
                    <div  fxLayout="row wrap" fxLayoutAlign="space-between start" fxLayoutGap="20px" class="zmFullWidth">
                                   
                                    <div fxFlex="1 1 35%">
                                    
                                            <ng-template #theadTemplate>
                                                <th>套餐名称</th>
                                           </ng-template>
                                          
                                           <ng-template #tbodyTemplate let-item="item">
                                               <td>{{item.name}}</td>
                                           </ng-template>
                                          
                                           <zm_table_detail_select_single [itemList]="data.packageDataList" (onSelected) = "choosePackage($event)"  
                                                                            [tbodyTemplate]="tbodyTemplate"  [theadTemplate]="theadTemplate" > </zm_table_detail_select_single>
                                           
                                          
                                    </div>
                                    <div fxFlex="1 1 auto" fxFlexAlign="center" style="text-align: center;height:50px;"><img src="assets/images/direction.png" alt=""/></div>
                                    <div fxFlex="1 1 58%">
                                    
                                         <zm_table class="c-table-title table table-bordered text-center">
                                                <thead >
                                                  <th style="width: 30%;">套餐名称</th>
                                                  <th style="width: 25%;">使用类型</th>
                                                  <th style="width: 25%;">次数</th>
                                                  <th style="width: 20%;">操作</th>
                                                </thead>
                                                <tbody>
                                                    <tr class="c-tr" *ngFor="let item of data.choosedPackageListTmp;let i =index;">
                                                        <td style="width: 30%">{{item.name}}</td>
                                                        <td style="width: 25%;position: relative;padding: 0;">
                                                          <select class="c-modal-se" [(ngModel)]="item.userType" [ngModelOptions]="{standalone: true}" (ngModelChange) = "changeCount(item)">
                                                            <option [value]="0">无限次</option>
                                                            <option [value]="1">限次数</option>
                                                          </select>
                                                          <span class="c-trigon"></span>
                                                        </td>
                                                        <td style="width: 25%;">
                                                                <div fxLayout="row"  fxLayoutAlign="center center" style="width:100%">
                                                                   <span  *ngIf="item.userType ==0" style="width: 38px;">(预估)</span>
                                                                    <i  style="color:#03a9f4;height:12px;min-height: 12px;" class="fa fa-pencil"></i>
                                                                    <input type="number" autofocus oninput="if(value<=0 || value>999)value = 1"  class="c-td-modal" style="width:35px;" value="10"  [(ngModel)]="item.count" [ngModelOptions]="{standalone: true}" required />
                                                                </div>
                                                        </td>
                                                        <td style="width: 20%">
                                                          <a class="zmCurHand" (click)="delChoosedPackage(i)" style="color:#03a9f4;">删除</a>
                                                        </td>
                                                    </tr>
                                                      <div *ngIf="data.choosedPackageListTmp.length == 0" style="margin: 120px 0;"><p class="font-c2 mg-b-0">请在左边选择套餐添加</p></div>
                                                </tbody>
                                          </zm_table>
                                        
                                    </div>
                    </div>
                
            
            </mat-dialog-content>
            <mat-dialog-actions>
                <div  fxLayout="row wrap" fxLayoutAlign="end" fxLayoutGap="20px" class="zmFullWidth">
                    <zm_btn_md  [stroked]="true" (click)="closeModal()" name="取消"></zm_btn_md>
                   <zm_btn_md  (click)="addPackageForCard()" name="确定"></zm_btn_md>
                </div>
            </mat-dialog-actions>
    </div>

  `,
})

export class AddPackagePopup implements OnInit {

  @Input() data: any;
  @Output() action: any;
  public viewData: AddPackagePopupViewData = new AddPackagePopupViewData();
  public ArtiveItem: number;

  private activeModal;

  constructor(@Inject(MAT_DIALOG_DATA) public dataInput: any) {
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit(): void {
    this.data.choosedPackageListTmp.splice(0, this.data.choosedPackageListTmp.length);
    this.data.choosedPackageList.forEach((item) => {
      if (!AppUtils.arrayContains(this.data.choosedPackageListTmp, item)) {
        this.data.choosedPackageListTmp.push(item);
      }
    });
  }

  changeCount(item: ProductData) {
    item.count = 1;
    // if(item.userType == UseTypeEnum.UNLIMIT_NUMBER){
    //   item.count = 0;
    // }
    // if(item.userType == UseTypeEnum.lIMIT_NUMBER){
    //   item.count = 1;
    // }
  }

  /**
   * 页面点击事件 取消关闭弹窗
   */
  closeModal() {
    this.activeModal.close();
    this.data.choosedPackageListTmp.splice(0, this.data.choosedPackageListTmp.length);
  }

  /**
   * 页面hover事件
   */
  ArtiveHover(index) {
    this.ArtiveItem = index;
  }

  /**
   * 选择套餐
   */
  choosePackage(itemP: ProductData) {

    let idArr = new Array<string>();
    this.data.choosedPackageListTmp.forEach(item => {
      idArr.push(item.id);
    });
    if (AppUtils.arrayContains(idArr, itemP.id)) {
      AppUtils.showWarn("提示", "已选择该项目");
    } else {
      this.data.choosedPackageListTmp.push(itemP);
    }
  }

  /**
   * 提交选择套餐
   */
  addPackageForCard() {
    this.data.choosedPackageList.splice(0, this.data.choosedPackageList.length);
    AppUtils.copy(this.data.choosedPackageList, this.data.choosedPackageListTmp);
    this.action();
    this.activeModal.close();

  }


  /**根据组合条件过滤套餐*/
  queryList() {
    let queryParam = AppUtils.trimBlank(this.viewData.name);
    let typeId = this.viewData.typeId;

    let packageDataListTmp = this.data.packageDataListTmp;
    if (!AppUtils.isNullOrWhiteSpace(queryParam)) {
      packageDataListTmp = this.filterByName(queryParam, packageDataListTmp);
    }
    packageDataListTmp = this.filterByType(typeId, packageDataListTmp);
    this.data.packageDataList = packageDataListTmp;
  }

  /**根据名称过滤次卡套餐*/
  private filterByName(queryParam, packageDataListTmp: Array<ProductData>) {
    packageDataListTmp = packageDataListTmp.filter((item) => {
      if (item.name && item.name.toString().indexOf(queryParam) > -1) {
        return true;
      } else {
        return false;
      }
    });
    return packageDataListTmp;
  }

  /**根据类别过滤次卡套餐*/
  private filterByType(typeId, packageDataListTmp: Array<ProductData>) {
    packageDataListTmp = packageDataListTmp.filter((item) => {
      if (typeId == -1 || item.typeId == typeId) {
        return true;
      } else {
        return false;
      }
    });
    return packageDataListTmp;
  }

  /**
   * 删除选中的套餐
   * @param index
   */
  delChoosedPackage(index) {
    this.data.choosedPackageListTmp.splice(index, 1);
  }

}

export class AddPackagePopupViewData {

  packageTypeList: Array<PackageProjectType> = new Array<PackageProjectType>();
  packageDataList: Array<ProductData> = new Array<ProductData>();
  packageDataListTmp: Array<ProductData> = new Array<ProductData>();

  choosedPackageList: Array<ProductData> = new Array<ProductData>();
  choosedPackageListTmp: Array<ProductData> = new Array<ProductData>();

  typeId: number = -1;
  name: string;

  public static fromParent(productCardContentCompViewData): AddPackagePopupViewData {
    let addPackageCardViewData = new AddPackagePopupViewData();

    addPackageCardViewData.packageDataList = productCardContentCompViewData.packageDataList;
    addPackageCardViewData.packageDataListTmp = productCardContentCompViewData.packageDataListTmp;
    addPackageCardViewData.packageTypeList = productCardContentCompViewData.packageTypeList;
    addPackageCardViewData.choosedPackageList = productCardContentCompViewData.choosedPackageList;
    addPackageCardViewData.choosedPackageListTmp = productCardContentCompViewData.choosedPackageListTmp;

    return addPackageCardViewData;
  }
}
