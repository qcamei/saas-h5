import {Component, ChangeDetectorRef, Inject} from '@angular/core';
import {ChainProductMgr} from "../../../../bsModule/chainProduct/chainProductMgr";
import {ChainProductSynDataHolder} from "../../../../bsModule/chainProduct/chainProductSynDataHolder";
import {ChainProductViewDataMgr} from "../../chainProductViewDataMgr";
import {MAT_DIALOG_DATA} from "@angular/material";
import {AddProductTypeData} from "../../../../bsModule/chainProduct/apiData/AddProductTypeData";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {ProductType} from "../../../../bsModule/chainProduct/data/ProductType";
import {ChainProduct} from "../../../../bsModule/chainProduct/data/ChainProduct";
import {ChainProductUpdateForm} from "../../../../bsModule/chainProduct/apiData/ChainProductUpdateForm";
import {ChainProductUpdateType} from "../../../../bsModule/chainProduct/apiData/ChainProductUpdateType";


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
           <zm_btn notRepeatSubmit [disabled]="typeName.invalid" (click)="addPrdType()" name="保存"></zm_btn>
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
export class AddProdcutTypeWithReturnComp {
  public viewDataSub: any;
  public viewData: AddTypeWithReturnViewData = new AddTypeWithReturnViewData();
  private service: AddTypeWithReturnService;

  public modalHeader: string;
  public activeModal;
  public modalCloseFunc: (typeId) => void;//回调函数

  constructor(
    private chainProductMgr: ChainProductMgr,
    private chainProductSynDataHolder: ChainProductSynDataHolder,
    private chainProductViewDataMgr: ChainProductViewDataMgr,
    private cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public dataInput:any) {

    this.activeModal = dataInput.modalCtrl;
    this.modalHeader = dataInput.modalData.modalHeader;
    this.modalCloseFunc = dataInput.callBack ;

    this.service = new AddTypeWithReturnService(
      this.chainProductMgr,
      this.chainProductSynDataHolder,
      this.chainProductViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainProductViewDataMgr.subscribeAddTypeWithReturnVD((viewDataP: AddTypeWithReturnViewData) => {
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
  public async addPrdType() {
    let chainId = SessionUtil.getInstance().getChainId();
    let name = AppUtils.trimBlank(this.viewData.name);
    if (!AppUtils.isNullOrWhiteSpace(name)) {
      if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
        AppUtils.showWarn("提示", "项目分类已存在");
        return;
      } else {
        let prdTypeIdIndex: number = await this.service.getPrdTypeIdIndex(chainId);
        this.addFormData.index = parseInt(prdTypeIdIndex.toString()) + 1;
        this.viewData.addTypeId = this.addFormData.index.toString();
        this.addFormData.name = AppUtils.trimBlank(this.viewData.name);
        this.service.addProductType(chainId, this.addFormData).then(
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
    this.closeModal();
    if (successP) {
      AppUtils.showSuccess("提示", "新增成功");
    }else{
      AppUtils.showError("提示", "新增失败");
    }
  }


}

export class AddTypeWithReturnViewData {
  name: string;

  typeNameList: Array<string> = new Array<string>();
  addTypeId:string;
}


class AddTypeWithReturnService {

  constructor(private chainProductMgr: ChainProductMgr,
              private chainProductSynDataHolder: ChainProductSynDataHolder,
              private chainProductViewDataMgr: ChainProductViewDataMgr) {
  }

  public initViewData() {
    this.chainProductViewDataMgr.setAddTypeWithReturnViewData(new AddTypeWithReturnViewData());
    this.buildViewData().then(
      (viewDataTmp: AddTypeWithReturnViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: AddTypeWithReturnViewData) {
    this.chainProductViewDataMgr.setAddTypeWithReturnViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param chainId:string
   * @returns Promise<StorePrdTypeListViewData>
   */
  public async buildViewData(): Promise<AddTypeWithReturnViewData> {

    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp: AddTypeWithReturnViewData = new AddTypeWithReturnViewData();
    let chainProduct: ChainProduct = await this.chainProductSynDataHolder.getData(chainId);

    let productTypeMap: ZmMap<ProductType> = chainProduct.getValidProductTypeMap();
    viewDataTmp.typeNameList = this.getTypeNameList(productTypeMap.values());
    return new Promise<AddTypeWithReturnViewData>(resolve => {
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


