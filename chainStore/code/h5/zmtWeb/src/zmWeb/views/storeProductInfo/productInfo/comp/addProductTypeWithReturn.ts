import {Component, ChangeDetectorRef, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {StoreProductInfoMgr} from "../../../../bsModule/StoreProductInfo/StoreProductInfoMgr";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreProductInfoViewDataMgr} from "../../storeProductViewDataMgr";
import {AddProductTypeData} from "../../../../bsModule/StoreProductInfo/apiData/AddProductTypeData";
import {StoreProductInfo} from "../../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {ProductType} from "../../../../bsModule/StoreProductInfo/data/ProductType";
import {StoreProductInfoUpdateForm} from "../../../../bsModule/StoreProductInfo/apiData/StoreProductInfoUpdateForm";
import {StoreProductInfoUpdateType} from "../../../../bsModule/StoreProductInfo/apiData/StoreProductInfoUpdateType";


@Component({
  selector: 'ngx-modal',
  template: `
     <div animation-modal>
      <h2 mat-dialog-title>
        {{modalHeader}}
      </h2>
      <mat-dialog-content>
       <div class="form-group " fxLayout="row wrap"  fxLayoutGap="20px" fxLayoutAlign="start center" >
          <label style="margin-bottom: 0;"><span class="font-c3"> *</span>分类名称</label>
          <input type="text" placeholder="请输入分类名称" [ngClass]="{'form-valid-error':typeName.invalid && (typeName.touched)}" name="typeName"  class="mg-l-10 form-control "  required #typeName ="ngModel" [(ngModel)]="viewData.name" 
                pattern="^\\s*([\u4E00-\u9FA5A-Za-z0-9-_ ]{1,8})\\s*$" maxlength="8">
       </div>
       
       <div style="height: 1.725rem;margin-left: 99px;line-height: 1.725rem;">
         <div class="font-c3 fz-12"  *ngIf="typeName.invalid && (typeName.touched)">
              <div *ngIf="typeName.errors.required">
                分类名称不能为空
             </div>
             <div *ngIf="typeName.errors.pattern">
                分类名称不能超过8个字,且不能包含特殊字符
             </div>
         </div>
       
       </div>
      </mat-dialog-content>
      
      <mat-dialog-actions fxLayout="row wrap"  fxLayoutGap="20px" fxLayoutAlign="end">
          <zm-btn [stroked]="true" (click)="closeModal()" name="取消"></zm-btn>
          <zm-btn [disabled]="typeName.invalid" (click)="addProductType()" name="保存"></zm-btn>
      </mat-dialog-actions>
  </div>
  `,
  styles: [`
  .form-valid-error{
    border: 2px solid #FF4c6a !important;
  }
  .form-control{
    padding: 0.75rem 0.75rem;
    border: 2px solid #ced4da;
  }
  .font-c3{
    color: #FF4c6a;
  } 
  .mg-l-10{
    margin-left:10px;
  } 
  .fz-12{
    font-size: 12px;
  } 
  
  .form-control:focus{
    box-shadow: none;
  }
  `]
})
export class AddProductTypeWithReturnComp {
  public viewDataSub: any;
  public viewData: AddTypeWithReturnViewData = new AddTypeWithReturnViewData();
  private service: AddTypeWithReturnService;

  public modalHeader: string;
  public activeModal;
  public modalCloseFunc: (typeId) => void;//回调函数

  constructor(
    private storeProductInfoMgr: StoreProductInfoMgr,
    private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
    private storeProductInfoViewDataMgr: StoreProductInfoViewDataMgr,
    private cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public dataInput:any) {

    this.activeModal = dataInput.modalCtrl;
    this.modalHeader = dataInput.modalData.modalHeader;
    this.modalCloseFunc = dataInput.callBack ;

    this.service = new AddTypeWithReturnService(
      this.storeProductInfoMgr,
      this.storeProductInfoSynDataHolder,
      this.storeProductInfoViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.storeProductInfoViewDataMgr.subscribeAddTypeWithReturnVD((viewDataP: AddTypeWithReturnViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData();
  }

  closeModal() {
    this.activeModal.close();
    this.modalCloseFunc(this.viewData.addTypeId);
  }


  /**
   * 添加项目分类 点击事件
   */
  public addFormData = new AddProductTypeData();
  public async addProductType() {
    let storeId = SessionUtil.getInstance().getStoreId();
    let name = AppUtils.trimBlank(this.viewData.name);
    if (!AppUtils.isNullOrWhiteSpace(name)) {
      if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
        AppUtils.showWarn("提示", "项目分类已存在");
        return;
      } else {
        let productTypeIdIndex: number = await this.service.getProductTypeIdIndex(storeId);
        this.addFormData.index = parseInt(productTypeIdIndex.toString()) + 1;
        this.viewData.addTypeId = this.addFormData.index.toString();
        this.addFormData.name = AppUtils.trimBlank(this.viewData.name);
        this.addFormData.storeId = storeId;
        this.service.addProductType(storeId, this.addFormData).then(
          (success) => {
            this.handleResult(success);
          }
        );
      }
    } else {
      AppUtils.showWarn("提示", "请输入有效字符！");
    }
  }

  private handleResult(successP: boolean): void {
    if (successP) {
      AppUtils.showSuccess("提示", "新增成功");
    }else{
      AppUtils.showError("提示", "新增失败");
    }
    this.closeModal();
  }


}

export class AddTypeWithReturnViewData {
  name: string;

  typeNameList: Array<string> = new Array<string>();
  addTypeId:string;
}


class AddTypeWithReturnService {

  constructor(private storeProductInfoMgr: StoreProductInfoMgr,
              private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeProductInfoViewDataMgr: StoreProductInfoViewDataMgr) {
  }

  public initViewData() {
    this.storeProductInfoViewDataMgr.setAddTypeWithReturnViewData(new AddTypeWithReturnViewData());
    this.buildViewData().then(
      (viewDataTmp: AddTypeWithReturnViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: AddTypeWithReturnViewData) {
    this.storeProductInfoViewDataMgr.setAddTypeWithReturnViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param storeId:string
   * @returns Promise<StoreProductTypeListViewData>
   */
  public async buildViewData(): Promise<AddTypeWithReturnViewData> {

    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp: AddTypeWithReturnViewData = new AddTypeWithReturnViewData();
    let storeProductInfo: StoreProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);

    let productTypeMap: ZmMap<ProductType> = storeProductInfo.getProductTypeMap();
    viewDataTmp.typeNameList = this.getTypeNameList(productTypeMap.values());
    return new Promise<AddTypeWithReturnViewData>(resolve => {
      resolve(viewDataTmp);
    });

  };

  /**所有分类名 列表*/
  private getTypeNameList(productTypeList) {
    let typeNameListTmp: Array<string> = new Array<string>();
    for (let itemTmp of productTypeList) {
      typeNameListTmp.push(itemTmp.name);
    }
    return typeNameListTmp;
  }

  /**
   * 添加项目分类
   * @param storeId:string
   * @param formData:AddProductTypeData
   * @return Promise<boolean>
   */
  public addProductType(storeId: string, formData: AddProductTypeData): Promise<boolean> {
    let updateForm = new StoreProductInfoUpdateForm();
    updateForm.updateType = StoreProductInfoUpdateType.AddProductType;
    updateForm.addProductTypeData = formData;
    return this.storeProductInfoMgr.updateProduct(storeId, updateForm);
  }

  public getProductTypeIdIndex(storeId): Promise<number> {
    return new Promise<number>(resolve => {
      this.storeProductInfoSynDataHolder.getData(storeId).then(
        (storeProduct) => {
          resolve(storeProduct.productTypeIdIndex);
        }
      );
    });
  }
}


