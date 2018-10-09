import {Component, ChangeDetectorRef, Inject} from '@angular/core';
import {PromptMsg} from "../../common/Util/PromptMsg";
import {ChainProductViewDataMgr} from "../chainProductViewDataMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {OperationEnum} from "../../../comModule/enum/OperationEnum";
import {AddProductTypeData} from "../../../bsModule/chainProduct/apiData/AddProductTypeData";
import {UpdateProductTypeData} from "../../../bsModule/chainProduct/apiData/UpdateProductTypeData";
import {ProductType} from "../../../bsModule/chainProduct/data/ProductType";
import {ChainProductMgr} from "../../../bsModule/chainProduct/chainProductMgr";
import {ChainProductSynDataHolder} from "../../../bsModule/chainProduct/chainProductSynDataHolder";
import {ChainProduct} from "../../../bsModule/chainProduct/data/ChainProduct";
import {ChainProductUpdateType} from "../../../bsModule/chainProduct/apiData/ChainProductUpdateType";
import {ChainProductUpdateForm} from "../../../bsModule/chainProduct/apiData/ChainProductUpdateForm";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'ngx-modal',
  template: `
     <div animation-modal>
      <h2 mat-dialog-title>
        {{modalHeader}}
      </h2>
      <mat-dialog-content>
       <div class="modal-body input-group  form-group c-input-group " fxLayout="row wrap"  fxLayoutGap="20px" fxLayoutAlign="start center" >
          <label style="margin-bottom: 0;"><span class="font-c3"> *</span>分类名称</label>
          <input type="text" placeholder="请输入8个字以内的名称" [ngClass]="{'form-valid-error':typeName.invalid && (typeName.touched)}" name="typeName"  class="mg-l-10 form-control "  required #typeName ="ngModel" [(ngModel)]="viewData.name" 
                pattern="^\\s*([\u4E00-\u9FA5A-Za-z0-9-_ ]{1,8})\\s*$" maxlength="8">
       </div>
       
       <div style="height: 1.725rem;margin-left: 99px;line-height: 1.725rem;">
         <div class="font-c3 fz-12"  *ngIf="typeName.invalid && (typeName.touched)">
              <div *ngIf="typeName.errors.required">
                分类名称不能为空
             </div>
             <div *ngIf="typeName.errors.pattern">
                分类名称除- _ 外不能包含其他特殊字符
             </div>
         </div>
       
       </div>
      </mat-dialog-content>
      
      <mat-dialog-actions fxLayout="row wrap"  fxLayoutGap="20px" fxLayoutAlign="end">
           <zm_btn  [stroked]="true" (click)="closeModal()" name="取消"></zm_btn>
           <zm_btn notRepeatSubmit *ngIf="typeId == null" [disabled]="typeName.invalid" (click)="addPrdType()" name="保存"></zm_btn>
           <zm_btn notRepeatSubmit *ngIf="typeId != null" [disabled]="typeName.invalid" (click)="editPrdType(typeId)" name="保存"></zm_btn>
      </mat-dialog-actions>
  </div>
  `,
  styles: [`
   
    .c-input-group{
      align-items: center !important;
      .form-control{
        border-radius: 0.375rem !important;
      }
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

    .c-close-btn-modal{
      border: 2px solid #4678fa !important;
      color: #4678fa !important;
      background-color: #fff;
      cursor: pointer;
    }
    .c-md-btn-modal{
      width: 140px;
      padding: 12px 0 !important;
      outline: none;
      cursor: pointer;
    } 
    .c-btn-blue{
      color: #fff;
      border-color: #4678fa !important;
      background-color: #4678fa !important;
      cursor: pointer;
    }
    .form-control:focus{
      box-shadow: none;
    }
  `]
})
export class ProductTypeComp {
  public viewDataSub: any;
  public viewData: EditProductTypeViewData = new EditProductTypeViewData();
  private service: EditProductTypeService;

  modalHeader: string;
  modalCloseFunc: () => void;//回调函数
  activeModal;
  typeId: string;

  constructor(
    private chainProductMgr: ChainProductMgr,
    private chainProductSynDataHolder: ChainProductSynDataHolder,
    private chainProductViewDataMgr: ChainProductViewDataMgr,
    private cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public dataInput:any) {

    this.activeModal = dataInput.modalCtrl;
    this.modalHeader = dataInput.modalData.modalHeader;
    this.typeId =  dataInput.modalData.typeId;
    this.modalCloseFunc = dataInput.callBack ;

    this.service = new EditProductTypeService(
      this.chainProductMgr,
      this.chainProductSynDataHolder,
      this.chainProductViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainProductViewDataMgr.subscribeEditProductTypeVD((viewDataP: EditProductTypeViewData) => {
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
    let chainId = SessionUtil.getInstance().getChainId();
    let name = AppUtils.trimBlank(this.viewData.name);
    if (!AppUtils.isNullOrWhiteSpace(name)) {
      if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
        AppUtils.showWarn(PromptMsg.PROMPT, "项目分类已存在");
        return;
      } else {
        let prdTypeIdIndex: number = await this.service.getPrdTypeIdIndex(chainId);
        this.addFormData.index = parseInt(prdTypeIdIndex.toString()) + 1;
        this.addFormData.name = AppUtils.trimBlank(this.viewData.name);
        this.service.addProductType(chainId, this.addFormData).then(
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
    let chainId = SessionUtil.getInstance().getChainId();
    let name = AppUtils.trimBlank(this.viewData.name);
    if (!AppUtils.isNullOrWhiteSpace(name)) {
      if (this.viewData.name == this.viewData.productType.name) {
        AppUtils.showSuccess(PromptMsg.PROMPT, "编辑成功");
        this.closeModal();
      } else {
        if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
          AppUtils.showWarn(PromptMsg.PROMPT, "项目分类已存在");
          return;
        } else {
          this.editFormData.id = typeId;
          this.editFormData.name = this.viewData.name;
          let success: boolean = await this.service.updateProductType(chainId, this.editFormData);
          if (success) {
            this.handleResult(success, OperationEnum.EDIT);
          }
        }

      }
    } else {
      AppUtils.showWarn(PromptMsg.PROMPT, "请输入有效字符！");
    }
  }


  private handleResult(successP: boolean, flag: number): void{
    let content = "";
    flag === OperationEnum.ADD ? content = "新增" : content = "编辑";
    this.closeModal();
    if (successP) {
      AppUtils.showSuccess("提示", content + "成功");
    } else {
      AppUtils.showError("提示", content + "失败");
    }
  }


}

export class EditProductTypeViewData {
  productType: ProductType = new ProductType();
  name: string;
  typeNameList: Array<string> = new Array<string>();
}


class EditProductTypeService {

  constructor(private chainProductMgr: ChainProductMgr,
              private chainProductSynDataHolder: ChainProductSynDataHolder,
              private chainProductViewDataMgr: ChainProductViewDataMgr) {
  }

  public initViewData(typeId) {
    this.chainProductViewDataMgr.setEditProductTypeViewData(new EditProductTypeViewData());
    this.buildViewData(typeId).then(
      (viewDataTmp: EditProductTypeViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: EditProductTypeViewData) {
    this.chainProductViewDataMgr.setEditProductTypeViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param chainId:string
   * @returns Promise<StorePrdTypeListViewData>
   */
  public async buildViewData(typeId: string): Promise<EditProductTypeViewData> {

    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp: EditProductTypeViewData = new EditProductTypeViewData();
    let chainProduct: ChainProduct = await this.chainProductSynDataHolder.getData(chainId);

    let productTypeMap: ZmMap<ProductType> = chainProduct.getValidProductTypeMap();
    if(typeId){
      let targetType: ProductType = productTypeMap.get(typeId);
      viewDataTmp.productType = targetType;
      viewDataTmp.name = targetType.name;
    }
    viewDataTmp.typeNameList = this.getTypeNameList(productTypeMap.values());
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
   * @param chainId:string
   * @param formData:AddPrdTypeData
   * @return Promise<boolean>
   */
  public addProductType(chainId: string, formData: AddProductTypeData): Promise<boolean> {
    let updateForm = new ChainProductUpdateForm();
    updateForm.updateType = ChainProductUpdateType.AddProductType;
    updateForm.addProductTypeData = formData;
    return new Promise<boolean>(resolve => {
      this.chainProductMgr.updateProduct(chainId, updateForm).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  /**
   * 修改项目分类
   * @param chainId:string
   * @param formData:AddPrdTypeData
   * @return Promise<boolean>
   */
  public updateProductType(chainId: string, formData: UpdateProductTypeData): Promise<boolean> {
    let updateForm = new ChainProductUpdateForm();
    updateForm.updateType = ChainProductUpdateType.UpdateProductType;
    updateForm.updateProductTypeData = formData;
    return new Promise<boolean>(resolve => {
      this.chainProductMgr.updateProduct(chainId, updateForm).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  public getPrdTypeIdIndex(chainId): Promise<number> {
    return new Promise<number>(resolve => {
      this.chainProductSynDataHolder.getData(chainId).then(
        (storePrd) => {
          resolve(storePrd.productTypeIdIndex);
        }
      );
    });
  }
}


