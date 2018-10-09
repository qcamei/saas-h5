import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {GoodsTypeAddForm} from '../../../bsModule/chainGoods/apiData/GoodsTypeAddForm';
import {GoodsTypeUpdateForm} from '../../../bsModule/chainGoods/apiData/GoodsTypeUpdateForm';
import {GoodsType} from '../../../bsModule/chainGoods/data/GoodsType';
import {ChainGoodsViewDataMgr} from '../ChainGoodsViewDataMgr';
import {AppUtils} from '../../../comModule/AppUtils';
import {ChainGoods} from '../../../bsModule/chainGoods/data/ChainGoods';
import {OperationEnum} from "../../../comModule/enum/OperationEnum";
import {ChainGoodsMgr} from "../../../bsModule/chainGoods/chainGoodsMgr";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'ngx-modal',
  template: `
    <div animation-modal>
      <h2 mat-dialog-title>
        {{ modalHeader }}
      </h2>
      <mat-dialog-content>
        <div class="modal-body input-group  form-group c-input-group " style="margin-bottom: 0;padding-top: 1.725rem;padding-bottom: 0;">
      <label style="margin-bottom: 0;"><span style="color:#ff355d;"> *</span>分类名称</label>
      <input type="text" placeholder="请输入8个字以内的名称" [ngClass]="{'form-valid-error':typeName.invalid && (typeName.touched)}" name="typeName" #typeName="ngModel" required [(ngModel)]="viewData.name" class="mg-l-10 form-control" 
              pattern="^\\s*([\u4E00-\u9FA5A-Za-z0-9-_ ]{1,8})\\s*$" maxlength="8" />
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
        <zm_btn notRepeatSubmit *ngIf="typeId == null" [disabled]="typeName.invalid" (click)="addGoodsType()" name="保存"></zm_btn>
        <zm_btn notRepeatSubmit *ngIf="typeId != null" [disabled]="typeName.invalid" (click)="editGoodsType(typeId)" name="保存"></zm_btn>
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
    .form-control:focus{
      box-shadow: none;
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
    .c-btn-blue {
      color: #fff;
      border-color: #4678fa !important;
      background-color: #4678fa !important;
      cursor: pointer;
    }
    .mg-l-10{
      margin-left:10px;
    } 
    .mg-r-20{
      margin-right:20px;
    }
    .font-c3{
      color: #FF4c6a;
    } 
    .fz-12{
      font-size: 14px;
    } 
  `]
})
export class GoodsTypeComp {
  public viewDataSub: any;
  public viewData: UpdateChainGoodsTypeViewData = new UpdateChainGoodsTypeViewData();
  private service: AddChainGoodsTypeService;

  modalHeader: string;
  modalCloseFunc: () => void;//回调函数
  activeModal;
  typeId: string;

  constructor(private chainGoodsMgr: ChainGoodsMgr,
              private chainGoodsViewDataMgr: ChainGoodsViewDataMgr,
              private cdRef: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public dataInput: any) {

    this.activeModal = dataInput.modalCtrl;
    this.modalHeader = dataInput.modalData.modalHeader;
    this.typeId = dataInput.modalData.typeId;
    this.modalCloseFunc = dataInput.callBack;

    this.service = new AddChainGoodsTypeService(this.chainGoodsMgr, this.chainGoodsViewDataMgr);
  }

  ngOnInit() {

    this.viewDataSub = this.chainGoodsViewDataMgr.subscribeUpdateChainGoodsTypeVD((viewDataP: UpdateChainGoodsTypeViewData) => {
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
    let chainId = SessionUtil.getInstance().getChainId();
    if (this.viewData.name != null) {
      if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
        AppUtils.showWarn("提示", "商品分类已存在");
        return;
      } else {
        let goodsTypeIdIndex: number = await this.service.getGoodsTypeIdIndex(chainId);
        this.addFormData.index = parseInt(goodsTypeIdIndex.toString()) + 1;
        this.addFormData.name = this.viewData.name.trim();
        let success = await this.service.addGoodsType(chainId, this.addFormData);
        this.handleResult(success, OperationEnum.ADD);
      }
    }
  }

  /**
   * 编辑商品分类 点击事件
   */
  public editFormData = new GoodsTypeUpdateForm();

  editGoodsType(typeId: string) {
    let chainId = SessionUtil.getInstance().getChainId();
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
          this.editFormData.id = typeId;
          this.editFormData.name = this.viewData.name.trim();

          this.service.updateGoodsType(chainId, this.editFormData).then(
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
      AppUtils.showSuccess("提示", content + "成功");
    } else {
      AppUtils.showError("提示", content + "失败");
    }
  }


}

export class UpdateChainGoodsTypeViewData {
  goodsType: GoodsType = new GoodsType();
  name: string;

  typeNameList: Array<string> = new Array<string>();
}

class AddChainGoodsTypeService {

  constructor(private chainGoodsMgr: ChainGoodsMgr,
              private chainGoodsViewDataMgr: ChainGoodsViewDataMgr) {

  }


  public initViewData(typeId) {
    this.chainGoodsViewDataMgr.setUpdateChainGoodsTypeViewData(new UpdateChainGoodsTypeViewData());
    this.buildViewData(typeId).then(
      (viewDataTmp: UpdateChainGoodsTypeViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: UpdateChainGoodsTypeViewData) {
    this.chainGoodsViewDataMgr.setUpdateChainGoodsTypeViewData(viewDataP);
  }

  /**
   * 组装typeListViewData
   * @param chainId:string
   * @returns Promise<StorePrdTypeListViewData>
   */
  public async buildViewData(typeId: string): Promise<UpdateChainGoodsTypeViewData> {

    let chainId = SessionUtil.getInstance().getChainId();

    let viewDataTmp: UpdateChainGoodsTypeViewData = new UpdateChainGoodsTypeViewData();

    let chainGoods: ChainGoods = await this.chainGoodsMgr.getChainGoods(chainId);
    let goodsTypeMap = chainGoods.getValidGoodsTypeMap();
    if (typeId) {
      let targetGoodsType: GoodsType = goodsTypeMap.get(typeId);
      if (targetGoodsType) {
        viewDataTmp.goodsType = targetGoodsType;
        viewDataTmp.name = targetGoodsType.name;
      }
    }
    viewDataTmp.typeNameList = this.getTypeNameList(goodsTypeMap.values());
    return new Promise<UpdateChainGoodsTypeViewData>(resolve => {
      resolve(viewDataTmp);
    });

  };

  /**所有分类名 列表*/
  private getTypeNameList(goodsTypeList: Array<GoodsType>) {
    let typeNameListTmp: Array<string> = new Array<string>();
    for (let itemTmp of goodsTypeList) {
      typeNameListTmp.push(itemTmp.name);
    }
    return typeNameListTmp;
  }

  /**
   * 添加商品分类
   * @param chainId:string
   * @param formData:GoodsTypeAddForm
   * @return Promise<boolean>
   */
  public addGoodsType(chainId: string, formData: GoodsTypeAddForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.chainGoodsMgr.addGoodsType(chainId, formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  /**
   * 修改商品分类
   * @param chainId:string
   * @param formData:GoodsTypeUpdateForm
   * @return Promise<boolean>
   */
  public updateGoodsType(chainId: string, formData: GoodsTypeUpdateForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.chainGoodsMgr.updateGoodsType(chainId, formData).then(
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

  public getGoodsTypeIdIndex(chainId): Promise<number> {
    return new Promise<number>(resolve => {
      this.chainGoodsMgr.getChainGoods(chainId).then(
        (chainGoods) => {
          resolve(chainGoods.goodsTypeIdIndex);
        }
      );
    });
  }
}


