import {Component, ChangeDetectorRef, Inject} from '@angular/core';
import {ChainCardMgr} from "../../../../bsModule/chainCard/chainCardMgr";
import {ChainCardSynDataHolder} from "../../../../bsModule/chainCard/chainCardSynDataHolder";
import {ChainCardViewDataMgr} from "../../ChainCardViewDataMgr";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {ChainCard} from "../../../../bsModule/chainCard/data/ChainCard";
import {PrdCardType} from "../../../../bsModule/chainCard/data/PrdCardType";
import {PrdCardTypeAddForm} from "../../../../bsModule/chainCard/apiData/PrdCardTypeAddForm";
import {PrdCardTypeUpdateForm} from "../../../../bsModule/chainCard/apiData/PrdCardTypeUpdateForm";
import {OperationEnum} from "../../../../comModule/enum/OperationEnum";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'ngx-modal',
  template: `
    <div animation-modal>
        <h2 mat-dialog-title>
          {{modalHeader}}
        </h2>
        <mat-dialog-content>
            <div class="modal-body input-group  form-group c-input-group "  fxLayout="row wrap"  fxLayoutGap="20px" fxLayoutAlign="start center">
                <label style="margin-bottom: 0;"><span class="font-c3"> *</span>分类名称</label>
               <input type="text" placeholder="请输入8个字以内的名称"  [ngClass]="{'form-valid-error':typeName.invalid && (typeName.touched)}" name="typeName"  class="mg-l-10 form-control "  required #typeName ="ngModel" [(ngModel)]="viewData.name" 
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
              <zm_btn notRepeatSubmit *ngIf="typeId == null" [disabled]="typeName.invalid" (click)="addProductCardType()" name="保存"></zm_btn>
              <zm_btn notRepeatSubmit *ngIf="typeId != null" [disabled]="typeName.invalid" (click)="editProductCardType(typeId)" name="保存"></zm_btn>
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
  .font-c3{
    color: #FF4c6a;
  } 
  .mg-l-10{
    margin-left:10px;
  } 
  .form-control{
    padding: 0.75rem 0.75rem;
    border: 2px solid #ced4da;
  }
  .fz-12{
    font-size: 12px;
  }

  .c-md-btn-modal{
    width: 140px;
    padding: 12px 0 !important;
    outline: none;
  } 
  .c-close-btn-modal{
    border: 2px solid #4678fa !important;
    color: #4678fa !important;
    background-color: #fff;
  } 
  .c-btn-blue{
    color: #fff;
    border-color: #4678fa !important;
    background-color: #4678fa !important;
  }
  .form-control:focus{
    box-shadow: none;
  }
  `]
})
export class AddProductCardTypeModal {

  public viewDataSub: any;
  public viewData: EditProductCardTypeViewData = new EditProductCardTypeViewData();
  private service: EditProductCardTypeService;

  modalHeader: string;
  modalCloseFunc: () => void;//回调函数
  activeModal;
  typeId: string;

  constructor(private chainCardMgr: ChainCardMgr,
              private chainCardSynDataHolder: ChainCardSynDataHolder,
              private chainCardViewDataMgr: ChainCardViewDataMgr,
              private cdRef: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public dataInput: any) {

    this.activeModal = dataInput.modalCtrl;
    this.modalHeader = dataInput.modalData.modalHeader;
    this.typeId = dataInput.modalData.typeId;
    this.modalCloseFunc = dataInput.callBack;
    this.service = new EditProductCardTypeService(this.chainCardMgr, this.chainCardSynDataHolder, this.chainCardViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainCardViewDataMgr.subscribeEditProductCardTypeVD((viewDataP: EditProductCardTypeViewData) => {
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
   * 添加次卡分类 点击事件
   */
  public addFormData = new PrdCardTypeAddForm();
  public async addProductCardType() {
    let chainId = SessionUtil.getInstance().getChainId();
    let name = AppUtils.trimBlank(this.viewData.name);
    if (!AppUtils.isNullOrWhiteSpace(name)) {
      if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
        AppUtils.showWarn(PromptMsg.PROMPT, "次卡分类已存在");
        return;
      } else {
        let productCardTypeIdIndex: number = await this.service.getProductCardTypeIdIndex(chainId);
        this.addFormData.index = parseInt(productCardTypeIdIndex.toString()) + 1;
        this.addFormData.name = AppUtils.trimBlank(this.viewData.name);
        this.service.addProductCardType(chainId, this.addFormData).then(
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
    let chainId = SessionUtil.getInstance().getChainId();
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
          let success: boolean = await this.service.updateProductCardType(chainId, this.editFormData);
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

export class EditProductCardTypeViewData {
  productCardType: PrdCardType = new PrdCardType();
  name: string;
  typeNameList: Array<string> = new Array<string>();
}


class EditProductCardTypeService {

  constructor(private chainCardMgr: ChainCardMgr,
              private chainCardSynDataHolder: ChainCardSynDataHolder,
              private chainCardViewDataMgr: ChainCardViewDataMgr) {
  }

  public initViewData(typeId) {
    this.chainCardViewDataMgr.setEditProductCardTypeViewData(new EditProductCardTypeViewData());
    this.buildViewData(typeId).then(
      (viewDataTmp: EditProductCardTypeViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: EditProductCardTypeViewData) {
    this.chainCardViewDataMgr.setEditProductCardTypeViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param chainId:string
   * @returns Promise<StoreProductCardTypeListViewData>
   */
  public async buildViewData(typeId: string): Promise<EditProductCardTypeViewData> {
    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp: EditProductCardTypeViewData = new EditProductCardTypeViewData();

    let storeProductCardInfo: ChainCard = await this.chainCardMgr.getChainCard(chainId);
    let productCardTypeMap: ZmMap<PrdCardType> = storeProductCardInfo.getValidProductCardTypeMap();
    if (productCardTypeMap && typeId) {
      let targetProductCardType: PrdCardType = productCardTypeMap.get(typeId);
      viewDataTmp.productCardType = targetProductCardType;
      viewDataTmp.name = targetProductCardType.name;
    }
    viewDataTmp.typeNameList = this.getTypeNameList(productCardTypeMap.values());

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
   * @param chainId:string
   * @param formData:AddProductCardTypeData
   * @return Promise<boolean>
   */
  public addProductCardType(chainId: string, formData: PrdCardTypeAddForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.chainCardMgr.addProductCardType(chainId, formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  /**
   * 修改次卡分类
   * @param chainId:string
   * @param formData:AddProductCardTypeData
   * @return Promise<boolean>
   */
  public updateProductCardType(chainId: string, formData: PrdCardTypeUpdateForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.chainCardMgr.updateProductCardType(chainId, formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  public getProductCardTypeIdIndex(chainId): Promise<number> {
    return new Promise<number>(resolve => {
      this.chainCardSynDataHolder.getData(chainId).then(
        (chainCard) => {
          resolve(chainCard.prdCardTypeIndex);
        }
      );
    });
  }
}


