import {Component, ChangeDetectorRef,Inject} from '@angular/core';

import {StoreCardInfoMgr} from "../../../../bsModule/storeCardInfo/StoreCardInfoMgr";
import {StoreCardInfoSynDataHolder} from "../../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {StoreCardInfoViewDataMgr} from "../../StoreCardInfoViewDataMgr";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {StoreCardInfo} from "../../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {PrdCardType} from "../../../../bsModule/storeCardInfo/data/PrdCardType";
import {PrdCardTypeAddForm} from "../../../../bsModule/storeCardInfo/apiData/PrdCardTypeAddForm";
import {PrdCardTypeUpdateForm} from "../../../../bsModule/storeCardInfo/apiData/PrdCardTypeUpdateForm";
import {OperationEnum} from "../../../../comModule/enum/OperationEnum";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  template: `

  
    <div animation-modal>
        <h2 mat-dialog-title>
          {{modalHeader}}
        </h2>
        <mat-dialog-content>
            <div class="form-group "  fxLayout="row wrap"  fxLayoutGap="20px" fxLayoutAlign="start center">
                <label style="margin-bottom: 0;"><span class="font-c3"> *</span>分类名称</label>
               <input type="text" placeholder="请输入分类名称" [ngClass]="{'form-valid-error':typeName.invalid && (typeName.touched)}" name="typeName"  class="mg-l-10 form-control "  required #typeName ="ngModel" [(ngModel)]="viewData.name" 
                      pattern="^\\s*([\u4E00-\u9FA5A-Za-z0-9-_ ]{1,8})\\s*$">
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
        <zm-btn  *ngIf="typeId == null" [disabled]="false" (click)="addProductCardType()" name="保存"></zm-btn>
        <zm-btn  *ngIf="typeId != null" [disabled]="false" (click)="editProductCardType(typeId)" name="保存"></zm-btn>
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
export class AddProductCardTypeModal {

  activeModal;
  modalHeader: string;
  typeId: string;
  editFunc:() => void;//回调函数
  addFunc:(typeId) => void;//回调函数

  public viewDataSub: any;
  public viewData: EditProductCardTypeViewData = new EditProductCardTypeViewData();

  private service: EditProductCardTypeService;

  constructor(
              private storeCardInfoMgr: StoreCardInfoMgr,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr,
              private cdRef: ChangeDetectorRef,
             @Inject(MAT_DIALOG_DATA) dataInput:any) {
    this.activeModal = dataInput.modalCtrl;

    this.service = new EditProductCardTypeService(this.storeCardInfoMgr, this.storeCardInfoSynDataHolder, this.storeCardInfoViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.storeCardInfoViewDataMgr.subscribeEditProductCardTypeVD((viewDataP: EditProductCardTypeViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData(this.typeId);
  }

  closeModal() {
    this.activeModal.close();
  }


  /**
   * 添加次卡分类 点击事件
   */
  public addFormData = new PrdCardTypeAddForm();

  public async addProductCardType() {
    let storeId = SessionUtil.getInstance().getStoreId();
    let name = AppUtils.trimBlank(this.viewData.name);
    if (!AppUtils.isNullOrWhiteSpace(name)) {
      if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
        AppUtils.showWarn(PromptMsg.PROMPT, "次卡分类已存在");
        return;
      } else {
        let productCardTypeIdIndex: number = await this.service.getProductCardTypeIdIndex(storeId);
        this.addFormData.index = parseInt(productCardTypeIdIndex.toString()) + 1;
        this.viewData.addTypeId = this.addFormData.index.toString();
        this.addFormData.name = AppUtils.trimBlank(this.viewData.name);
        this.service.addProductCardType(storeId, this.addFormData).then(
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
   * 编辑次卡分类 点击事件
   */
  public editFormData = new PrdCardTypeUpdateForm();

  public async editProductCardType(typeId: string) {
    let storeId = SessionUtil.getInstance().getStoreId();
    let name = AppUtils.trimBlank(this.viewData.name);
    if (!AppUtils.isNullOrWhiteSpace(name)) {
      if (this.viewData.name == this.viewData.productCardType.name) {
        AppUtils.showSuccess(PromptMsg.PROMPT, "编辑成功");
        this.closeModal();
      } else {
        if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
          AppUtils.showWarn(PromptMsg.PROMPT, "次卡分类已存在");
          return;
        } else {
          this.editFormData.id = typeId;
          this.editFormData.name = this.viewData.name;
          let success: boolean = await this.service.updateProductCardType(storeId, this.editFormData);
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

    this.closeModal();
    if (flag == OperationEnum.ADD) {
      this.addFunc(this.viewData.addTypeId);
    } else {
      this.editFunc();
    }

    let content = "";
    flag === OperationEnum.ADD ? content = "新增" : content = "编辑";
    this.closeModal();
    if (successP) {
      AppUtils.showSuccess(PromptMsg.PROMPT, content + "成功");
    } else {
      AppUtils.showError(PromptMsg.PROMPT, content + "失败");
    }
  }


}

export class EditProductCardTypeViewData {
  productCardType: PrdCardType = new PrdCardType();
  name: string;
  typeNameList: Array<string> = new Array<string>();
  addTypeId: string;

}


class EditProductCardTypeService {

  constructor(private storeCardInfoMgr: StoreCardInfoMgr,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr) {
  }

  public initViewData(typeId) {
    this.storeCardInfoViewDataMgr.setEditProductCardTypeViewData(new EditProductCardTypeViewData());
    this.buildViewData(typeId).then(
      (viewDataTmp: EditProductCardTypeViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: EditProductCardTypeViewData) {
    this.storeCardInfoViewDataMgr.setEditProductCardTypeViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param storeId:string
   * @returns Promise<StoreProductCardTypeListViewData>
   */
  public async buildViewData(typeId: number): Promise<EditProductCardTypeViewData> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp: EditProductCardTypeViewData = new EditProductCardTypeViewData();

    let storeProductCardInfo: StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
    let productCardTypeMap: ZmMap<PrdCardType> = storeProductCardInfo.getValidProductCardTypeMap();
    if (productCardTypeMap && typeId) {
      let targetProductCardType: PrdCardType = productCardTypeMap.get(typeId.toString());
      viewDataTmp.productCardType = targetProductCardType;
      viewDataTmp.name = targetProductCardType.name;
      viewDataTmp.typeNameList = this.getTypeNameList(productCardTypeMap.values());
    }

    return new Promise<EditProductCardTypeViewData>(resolve => {
      resolve(viewDataTmp);
    });

  };

  /**所有分类名 列表*/
  private getTypeNameList(productCardTypeList) {
    let typeNameListTmp: Array<string> = new Array<string>();
    for (let itemTmp of productCardTypeList) {
      typeNameListTmp.push(itemTmp.name);
    }
    return typeNameListTmp;
  }

  /**
   * 添加次卡分类
   * @param storeId:string
   * @param formData:AddProductCardTypeData
   * @return Promise<boolean>
   */
  public addProductCardType(storeId: string, formData: PrdCardTypeAddForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.storeCardInfoMgr.addProductCardType(storeId, formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  /**
   * 修改次卡分类
   * @param storeId:string
   * @param formData:AddProductCardTypeData
   * @return Promise<boolean>
   */
  public updateProductCardType(storeId: string, formData: PrdCardTypeUpdateForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.storeCardInfoMgr.updateProductCardType(storeId, formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  public getProductCardTypeIdIndex(storeId): Promise<number> {
    return new Promise<number>(resolve => {
      this.storeCardInfoSynDataHolder.getData(storeId).then(
        (storeCardInfo) => {
          resolve(storeCardInfo.prdCardTypeIndex);
        }
      );
    });
  }
}


