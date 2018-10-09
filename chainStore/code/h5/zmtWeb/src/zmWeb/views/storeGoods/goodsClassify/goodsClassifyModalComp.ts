import {ChangeDetectorRef, Component,  Inject} from '@angular/core';
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreGoodsMgr} from '../../../bsModule/storeGoods/StoreGoodsMgr';
import {GoodsTypeAddForm} from '../../../bsModule/storeGoods/apiData/GoodsTypeAddForm';
import {GoodsTypeUpdateForm} from '../../../bsModule/storeGoods/apiData/GoodsTypeUpdateForm';
import {GoodsType} from '../../../bsModule/storeGoods/data/GoodsType';
import {StoreGoodsViewDataMgr} from '../StoreGoodsViewDataMgr';
import {AppUtils} from '../../../comModule/AppUtils';
import {StoreGoods} from '../../../bsModule/storeGoods/data/StoreGoods';
import {StoreGoodsSynDataHolder} from "../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {OperationEnum} from "../../../comModule/enum/OperationEnum";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  template: `
  
  <div animation-modal>
      <h2 mat-dialog-title>
        {{modalHeader}}
      </h2>
      <mat-dialog-content>
          <div class="form-group " fxLayout="row wrap"  fxLayoutGap="20px" fxLayoutAlign="start center" >
                  <label style="margin-bottom: 0;"><span style="color:#ff355d;"> *</span>分类名称</label>
                  <input type="text" placeholder="请输入分类名称" [ngClass]="{'form-valid-error':typeName.invalid && (typeName.touched)}" name="typeName" #typeName="ngModel" required [(ngModel)]="viewData.name" class="mg-l-10 form-control" 
                          pattern="^\\s*([\u4E00-\u9FA5A-Za-z0-9-_ ]{1,8})\\s*$" maxlength="8" />
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
          <zm-btn  *ngIf="typeId == null" [disabled]="false" (click)="addGoodsType()" name="保存"></zm-btn>
          <zm-btn  *ngIf="typeId != null" [disabled]="false" (click)="editGoodsType(typeId)" name="保存"></zm-btn>
      </mat-dialog-actions>
  </div>
  
  
   
  `,
  styles:[`
 
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
export class ModalComponent {

  modalHeader: string;
  typeId: string;
  modalCloseFunc: () => void;//回调函数
  activeModal;

  public viewDataSub: any;
  public viewData: UpdateStoreGoodsTypeViewData = new UpdateStoreGoodsTypeViewData();

  private service: AddStoreGoodsTypeService;

  constructor(
              private storeGoodsMgr: StoreGoodsMgr,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,
              private storeGoodsViewDataMgr: StoreGoodsViewDataMgr,
              private cdRef: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) dataInput:any) {

    this.activeModal = dataInput.modalCtrl;
    this.modalHeader = dataInput.modalData.modalHeader;
    this.typeId =  dataInput.modalData.typeId;
    this.modalCloseFunc = dataInput.callBack ;

    this.service = new AddStoreGoodsTypeService(this.storeGoodsMgr, this.storeGoodsSynDataHolder, this.storeGoodsViewDataMgr);
  }

  ngOnInit() {

    this.viewDataSub = this.storeGoodsViewDataMgr.subscribeUpdateStoreGoodsTypeVD((viewDataP: UpdateStoreGoodsTypeViewData) => {
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
   * 添加商品分类 点击事件
   */
  public addFormData = new GoodsTypeAddForm();

  public async addGoodsType() {
    let storeId = SessionUtil.getInstance().getStoreId();
    if (this.viewData.name != null) {
      if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
        AppUtils.showWarn("提示", "商品分类已存在");
        return;
      } else {
        let goodsTypeIdIndex: number = await this.service.getGoodsTypeIdIndex(storeId);
        this.addFormData.index = parseInt(goodsTypeIdIndex.toString())+1;
        this.addFormData.name = this.viewData.name.trim();
        let success = await this.service.addGoodsType(storeId, this.addFormData);
        this.handleResult(success, OperationEnum.ADD);
      }
    }
  }

  /**
   * 编辑商品分类 点击事件
   */
  public editFormData = new GoodsTypeUpdateForm();

  editGoodsType(typeId: number) {
    let storeId = SessionUtil.getInstance().getStoreId();
    let name = AppUtils.trimBlank(this.viewData.name);
    if (!AppUtils.isNullOrWhiteSpace(name)) {
      if (this.viewData.name == this.viewData.goodsType.name) {
        AppUtils.showSuccess("提示", "编辑成功");
        this.closeModal();
      } else {
        if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
          AppUtils.showWarn("提示", "商品分类已存在");
          return;
        } else {
          this.editFormData.storeId = storeId;
          this.editFormData.id = typeId;
          this.editFormData.name = this.viewData.name.trim();

          this.service.updateGoodsType(storeId, this.editFormData).then(
            (success) => {
              this.handleResult(success, OperationEnum.EDIT);
            }
          );

        }

      }
    } else {
      AppUtils.showWarn("提示", "请输入有效字符！");
    }

  }


  private handleResult(successP: boolean, flag: number): void {
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

export class UpdateStoreGoodsTypeViewData {
  goodsType: GoodsType = new GoodsType();
  name: string;

  typeNameList: Array<string> = new Array<string>();
}

class AddStoreGoodsTypeService {

  constructor(private storeGoodsMgr: StoreGoodsMgr,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,
              private storeGoodsViewDataMgr: StoreGoodsViewDataMgr) {

  }


  public initViewData(typeId) {
    this.storeGoodsViewDataMgr.setUpdateStoreGoodsTypeViewData(new UpdateStoreGoodsTypeViewData());
    this.buildViewData(typeId).then(
      (viewDataTmp: UpdateStoreGoodsTypeViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: UpdateStoreGoodsTypeViewData) {
    this.storeGoodsViewDataMgr.setUpdateStoreGoodsTypeViewData(viewDataP);
  }

  /**
   * 组装typeListViewData
   * @param storeId:string
   * @returns Promise<StorePrdTypeListViewData>
   */
  public async buildViewData(typeId: string): Promise<UpdateStoreGoodsTypeViewData> {

    let storeId = SessionUtil.getInstance().getStoreId();

    let viewDataTmp: UpdateStoreGoodsTypeViewData = new UpdateStoreGoodsTypeViewData();

    let storeGoods: StoreGoods = await this.storeGoodsSynDataHolder.getData(storeId);
    let goodsTypeList = storeGoods.getValidGoodsList();
    let targetGoodsType: GoodsType = storeGoods.getGoodsTypeDetail(typeId);
    viewDataTmp.goodsType = targetGoodsType;
    viewDataTmp.name = targetGoodsType.name;
    viewDataTmp.typeNameList = this.getTypeNameList(goodsTypeList);
    return new Promise<UpdateStoreGoodsTypeViewData>(resolve => {
      resolve(viewDataTmp);
    });

  };

  /**所有分类名 列表*/
  private getTypeNameList(goodsTypeList) {
    let typeNameListTmp: Array<string> = new Array<string>();
    for (let itemTmp of goodsTypeList) {
      typeNameListTmp.push(itemTmp.name);
    }
    return typeNameListTmp;
  }

  /**
   * 添加商品分类
   * @param storeId:string
   * @param formData:GoodsTypeAddForm
   * @return Promise<boolean>
   */
  public addGoodsType(storeId: string, formData: GoodsTypeAddForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.storeGoodsMgr.addGoodsType(storeId, formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  /**
   * 修改商品分类
   * @param storeId:string
   * @param formData:GoodsTypeUpdateForm
   * @return Promise<boolean>
   */
  public updateGoodsType(storeId: string, formData: GoodsTypeUpdateForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.storeGoodsMgr.updateGoodsType(storeId, formData).then(
        (success) => {
          if (success) {
            resolve(success);
          } else {
            resolve(success);
          }
        }
      )
    });
  }

  public getGoodsTypeIdIndex(storeId): Promise<number> {
    return new Promise<number>(resolve => {
      this.storeGoodsMgr.getStoreGoods(storeId).then(
        (storeGoods) => {
          resolve(storeGoods.goodsTypeIdIndex);
        }
      );
    });
  }
}


