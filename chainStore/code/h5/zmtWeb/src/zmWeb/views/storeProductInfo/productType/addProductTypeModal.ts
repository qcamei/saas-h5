import {Component, ChangeDetectorRef, Inject} from '@angular/core';
import {PromptMsg} from "../../common/Util/PromptMsg";
import {StoreProductInfoViewDataMgr} from "../storeProductViewDataMgr";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreProductInfoMgr} from "../../../bsModule/StoreProductInfo/StoreProductInfoMgr";
import {AddProductTypeData} from "../../../bsModule/StoreProductInfo/apiData/AddProductTypeData";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppUtils} from "../../../comModule/AppUtils";
import {UpdateProductTypeData} from "../../../bsModule/StoreProductInfo/apiData/UpdateProductTypeData";
import {ProductType} from "../../../bsModule/StoreProductInfo/data/ProductType";
import {StoreProductInfo} from "../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {StoreProductInfoUpdateForm} from "../../../bsModule/StoreProductInfo/apiData/StoreProductInfoUpdateForm";
import {StoreProductInfoUpdateType} from "../../../bsModule/StoreProductInfo/apiData/StoreProductInfoUpdateType";
import {OperationEnum} from "../../../comModule/enum/OperationEnum";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  template: `

	<div animation-modal>
      <h2 mat-dialog-title>
        {{modalHeader}}
      </h2>
      <mat-dialog-content>
       <div class=" form-group" fxLayout="row wrap"  fxLayoutGap="20px" fxLayoutAlign="start center" >
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
        <zm-btn  [stroked]="true" (click)="closeModal()" name="取消"></zm-btn>
        <zm-btn *ngIf="typeId == null" [disabled]="false" (click)="addPrdType()" name="保存"></zm-btn>
        <zm-btn *ngIf="typeId != null" [disabled]="false" (click)="editPrdType(typeId)" name="保存"></zm-btn>
      </mat-dialog-actions>
  </div>
    <!--<div animation-modal>-->
      <!--<div class="modal-header">-->
        <!--<h4 class="modal-title">{{modalHeader}}</h4>-->
        <!--<button class="close" aria-label="Close"  (click)="closeModal()">-->
          <!--<span aria-hidden="true">&times;</span>-->
        <!--</button>-->
      <!--</div>-->
       <!--<div class="modal-body input-group  form-group c-input-group " style="vertical-align: middle; padding-top:1.725rem;padding-bottom:0;margin-bottom: 0">-->
          <!--<label style="margin-bottom: 0;"><span class="font-c3"> *</span>分类名称</label>-->
          <!--<input type="text" placeholder="请输入分类名称" [ngClass]="{'form-valid-error':typeName.invalid && (typeName.touched)}" name="typeName"  class="mg-l-10 form-control "  required #typeName ="ngModel" [(ngModel)]="viewData.name" -->
                <!--pattern="^\\s*([\u4E00-\u9FA5A-Za-z0-9-_ ]{1,8})\\s*$" maxlength="8">-->
       <!--</div>-->
       <!--<div style="height: 1.725rem;margin-left: 99px;line-height: 1.725rem;">-->
         <!--<div class="font-c3 fz-12"  *ngIf="typeName.invalid && (typeName.touched)">-->
              <!--<div *ngIf="typeName.errors.required">-->
                <!--分类名称不能为空-->
             <!--</div>-->
             <!--<div *ngIf="typeName.errors.pattern">-->
                <!--分类名称不能超过8个字,且不能包含特殊字符-->
             <!--</div>-->
         <!--</div>-->
       <!---->
       <!--</div>-->
      <!--<div class="modal-footer">-->
          <!--<button class="btn c-md-btn-modal c-close-btn-modal" (click)="closeModal()" style="margin-right: 20px;">取消</button>-->
          <!--<button notRepeatSubmit class="btn c-btn-blue c-md-btn-modal" [disabled]="typeName.invalid" *ngIf="typeId== null "  (submit)="addPrdType()">保存</button>-->
          <!--<button notRepeatSubmit class="btn c-md-btn-modal c-btn-blue" [disabled]="typeName.invalid" *ngIf="typeId!= null " (submit)="editPrdType(typeId)">保存</button>-->
      <!--</div>-->
    <!--</div>-->
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
export class AddOrEditTypeModal {


  public viewDataSub: any;
  public viewData: EditProductTypeViewData = new EditProductTypeViewData();

  private service: EditProductTypeService;

  modalHeader: string;
  modalCloseFunc: () => void;//回调函数
  activeModal;
  typeId: string;

  constructor(
              private storePrdMgr: StoreProductInfoMgr,
              private storePrdSynDataHolder: StoreProductInfoSynDataHolder,
              private storePrdViewDataMgr: StoreProductInfoViewDataMgr,
              private cdRef: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public dataInput:any) {

    this.activeModal = dataInput.modalCtrl;
    this.modalHeader = dataInput.modalData.modalHeader;
    this.typeId =  dataInput.modalData.typeId;
    this.modalCloseFunc = dataInput.callBack ;

    this.service = new EditProductTypeService(this.storePrdMgr, this.storePrdSynDataHolder, this.storePrdViewDataMgr);


  }

  ngOnInit() {
    this.viewDataSub = this.storePrdViewDataMgr.subscribeEditProductTypeVD((viewDataP: EditProductTypeViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData(this.typeId);
  }

  closeModal() {
    this.activeModal.close();
    this.modalCloseFunc();
  }


  /**
   * 添加项目分类 点击事件
   */
  public addFormData = new AddProductTypeData();
  public async addPrdType() {
    let storeId = SessionUtil.getInstance().getStoreId();
    let name = AppUtils.trimBlank(this.viewData.name);
    if (!AppUtils.isNullOrWhiteSpace(name)) {
      if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
        AppUtils.showWarn(PromptMsg.PROMPT, "项目分类已存在");
        return;
      }else{
        let prdTypeIdIndex: number = await this.service.getPrdTypeIdIndex(storeId);
        this.addFormData.storeId = storeId;
        this.addFormData.index = parseInt(prdTypeIdIndex.toString())+1;
        this.addFormData.name = AppUtils.trimBlank(this.viewData.name);
        this.service.addProductType(storeId, this.addFormData).then(
          (success) => {
            this.handleResult(success, OperationEnum.ADD);
          }
        );
      }
    } else {
      AppUtils.showWarn(PromptMsg.PROMPT, "请输入有效字符！");
    }
  }

  /**
   * 编辑项目分类 点击事件
   */
  public editFormData = new UpdateProductTypeData();
  public async editPrdType(typeId: string) {
    let storeId = SessionUtil.getInstance().getStoreId();
    let name = AppUtils.trimBlank(this.viewData.name);
    if (!AppUtils.isNullOrWhiteSpace(name)) {
      if (this.viewData.name == this.viewData.prdType.name) {
        AppUtils.showSuccess(PromptMsg.PROMPT, "编辑成功");
        this.closeModal();
      } else{
        if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
          AppUtils.showWarn(PromptMsg.PROMPT, "项目分类已存在");
          return;
        }else{
          this.editFormData.storeId = storeId;
          this.editFormData.id = typeId;
          this.editFormData.name = this.viewData.name;
          let success: boolean = await this.service.updateProductType(storeId, this.editFormData);
          if (success) {
            this.handleResult(success, OperationEnum.EDIT);
          }
        }

      }
    } else {
      AppUtils.showWarn(PromptMsg.PROMPT, "请输入有效字符！");
    }
  }


  private handleResult(successP: boolean, flag: number): void {
    let title = PromptMsg.PROMPT;
    let content = "";
    flag === OperationEnum.ADD ? content = "新增" : content = "编辑";
    this.closeModal();
    if (successP) {
      AppUtils.showSuccess(title, content + "成功");
    } else {
      AppUtils.showError(title, content + "失败");
    }
  }


}

export class EditProductTypeViewData {
  prdType: ProductType = new ProductType();
  name: string;
  typeNameList: Array<string> = new Array<string>();
}


class EditProductTypeService {

  constructor(private storePrdMgr: StoreProductInfoMgr,
              private storePrdSynDataHolder: StoreProductInfoSynDataHolder,
              private storePrdViewDataMgr: StoreProductInfoViewDataMgr) {
  }

  public initViewData(typeId) {
    this.storePrdViewDataMgr.setEditProductTypeViewData(new EditProductTypeViewData());
    this.buildViewData(typeId).then(
      (viewDataTmp: EditProductTypeViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: EditProductTypeViewData) {
    this.storePrdViewDataMgr.setEditProductTypeViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param storeId:string
   * @returns Promise<StorePrdTypeListViewData>
   */
  public async buildViewData(typeId: string): Promise<EditProductTypeViewData> {

    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp: EditProductTypeViewData = new EditProductTypeViewData();

    let storeProductInfo: StoreProductInfo = await this.storePrdSynDataHolder.getData(storeId);
    let prdTypeList: Array<ProductType> = storeProductInfo.getValidProductTypeList();
    let targetPrdType: ProductType = storeProductInfo.getPrdTypeDetail(typeId);
    viewDataTmp.prdType = targetPrdType;
    viewDataTmp.name = targetPrdType.name;
    viewDataTmp.typeNameList = this.getTypeNameList(prdTypeList);
    return new Promise<EditProductTypeViewData>(resolve => {
      resolve(viewDataTmp);
    });

  };

  /**所有分类名 列表*/
  private getTypeNameList(prdTypeList) {
    let typeNameListTmp: Array<string> = new Array<string>();
    for (let itemTmp of prdTypeList) {
      typeNameListTmp.push(itemTmp.name);
    }
    return typeNameListTmp;
  }

  /**
   * 添加项目分类
   * @param storeId:string
   * @param formData:AddPrdTypeData
   * @return Promise<boolean>
   */
  public addProductType(storeId: string, formData: AddProductTypeData): Promise<boolean> {
    let updateForm = new StoreProductInfoUpdateForm();
    updateForm.updateType = StoreProductInfoUpdateType.AddProductType;
    updateForm.addProductTypeData = formData;
    return new Promise<boolean>(resolve => {
      this.storePrdMgr.updateProduct(storeId, updateForm).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  /**
   * 修改项目分类
   * @param storeId:string
   * @param formData:AddPrdTypeData
   * @return Promise<boolean>
   */
  public updateProductType(storeId: string, formData: UpdateProductTypeData): Promise<boolean> {
    let updateForm = new StoreProductInfoUpdateForm();
    updateForm.updateType = StoreProductInfoUpdateType.UpdateProductType;
    updateForm.updateProductTypeData = formData;
    return new Promise<boolean>(resolve => {
      this.storePrdMgr.updateProduct(storeId, updateForm).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  public getPrdTypeIdIndex(storeId): Promise<number> {
    return new Promise<number>(resolve => {
      this.storePrdSynDataHolder.getData(storeId).then(
        (storePrd) => {
          resolve(storePrd.productTypeIdIndex);
        }
      );
    });
  }
}


