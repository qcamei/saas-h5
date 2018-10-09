import {Component, OnInit, ChangeDetectorRef, Input, Output, Inject} from '@angular/core';
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {MAT_DIALOG_DATA} from "@angular/material";
import {StoreIncomePayMgr} from "../../../bsModule/incomePay/StoreIncomePayMgr";
import {StoreIncomePaySynDataHolder} from "../../../bsModule/incomePay/StoreIncomePaySynDataHolder";
import {StoreIncomePayViewDataMgr} from "../StoreIncomePayViewDataMgr";
import {StoreIncomePay} from "../../../bsModule/incomePay/data/StoreIncomePay";
import {IncomePayType} from "../../../bsModule/incomePay/data/IncomePayType";
import {IncomePayTypeAddForm} from "../../../bsModule/incomePay/apiData/IncomePayTypeAddForm";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {OperationEnum} from "../../../comModule/enum/OperationEnum";
import {IncomePayTypeUpdateForm} from "../../../bsModule/incomePay/apiData/IncomePayTypeUpdateForm";

@Component({
  selector: 'incomePayType-model',
  template: `

  <div animation-modal>
      <h2 mat-dialog-title>
        {{modalHeader}}
      </h2>
      <mat-dialog-content>
        <div class="modal-body input-group  form-group c-input-group " fxLayout="row wrap"  fxLayoutGap="20px" fxLayoutAlign="start center" >
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
      <mat-dialog-actions fxLayout="row wrap" class="mt-20"  fxLayoutGap="20px" fxLayoutAlign="end">
      <zm-btn  [stroked] = "true" (click)="closeModal()" name="取消"></zm-btn>
      <zm-btn  [stroked] = "!true"  *ngIf="typeId== null " (click)="addIncomePayType()" name="保存"></zm-btn>
      <zm-btn  [stroked] = "!true"  *ngIf="typeId!= null " (click)="editIncomePayType(typeId)" name="保存"></zm-btn>

       </mat-dialog-actions>
  </div>
    `,
  styles: [`
  
  .modal-title{
    font-size: 18px;
    font-weight: bold !important;
    color: #333 !important;
  }  
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
  .font-c3 {
    color: #FF4c6a;
  }
  .mg-l-10{
    margin-left:10px;
  } 
  .fz-12{
    font-size: 12px;
  }
  
  .c-close-btn-modal{
    border: 2px solid#03a9f4 !important;
    color:#03a9f4 !important;
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
    border-color:#03a9f4 !important;
    background-color:#03a9f4 !important;
    cursor: pointer;
  }
  .form-control:focus{
    box-shadow: none;
  }
  `]
})
export class IncomePayTypeComponent implements OnInit {

  @Input() modalHeader :string;
  @Input() typeId:string;
  @Input() category:number;  //IncomePayTypeCategoryEnum;
  @Input() action:any;

  activeModal;

  public viewDataSub: any;
  public viewData: EditIncomePayTypeViewData = new EditIncomePayTypeViewData();

  private service: EditIncomePayTypeService;

  constructor(
    private storeIncomePayMgr: StoreIncomePayMgr,
    private storeIncomePaySynDataHolder: StoreIncomePaySynDataHolder,
    private storeIncomePayViewDataMgr: StoreIncomePayViewDataMgr,
    private cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public dataInput:any) {

    this.activeModal = dataInput.modalCtrl;
    this.service = new EditIncomePayTypeService(this.storeIncomePayMgr, this.storeIncomePaySynDataHolder, this.storeIncomePayViewDataMgr);
  }


  ngOnInit() {
    this.viewDataSub = this.storeIncomePayViewDataMgr.subscribeEditIncomePayTypeVD((viewDataP: EditIncomePayTypeViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData(this.typeId);
  }
  closeModal() {
    this.activeModal.close();
  }

  /**
   * 添加收支分类 点击事件
   */
  public addFormData = new IncomePayTypeAddForm();

  public async addIncomePayType() {
    let storeId = SessionUtil.getInstance().getStoreId();
    let name = AppUtils.trimBlank(this.viewData.name);
    if (!AppUtils.isNullOrWhiteSpace(name)) {
      // if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
      //   AppUtils.showWarn(PromptMsg.PROMPT, "收支分类已存在");
      //   return;
      // } else {
        let incomePayTypeIdIndex: number = await this.service.getIncomePayTypeIdIndex(storeId);
        this.addFormData.index = parseInt(incomePayTypeIdIndex.toString()) + 1;
        this.typeId = this.addFormData.index.toString();
        this.addFormData.category = this.category;
        this.addFormData.name = AppUtils.trimBlank(this.viewData.name);
        let success: boolean = await this.service.addIncomePayType(this.addFormData);
        this.handleResult(success, OperationEnum.ADD);
      // }
    } else {
      AppUtils.showWarn(PromptMsg.PROMPT, "请输入有效字符！");
    }
  }

  /**
   * 编辑收支分类 点击事件
   */
  public editFormData = new IncomePayTypeUpdateForm();

  public async editIncomePayType(typeId: string) {
    let name = AppUtils.trimBlank(this.viewData.name);
    if (!AppUtils.isNullOrWhiteSpace(name)) {
      if (this.viewData.name == this.viewData.incomePayType.name) {
        AppUtils.showSuccess(PromptMsg.PROMPT, "编辑成功");
        this.closeModal();
      } else {
        // if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
        //   AppUtils.showWarn(PromptMsg.PROMPT, "收支分类已存在");
        //   return;
        // } else {
          this.editFormData.id = typeId;
          this.editFormData.name = this.viewData.name;
          let success: boolean = await this.service.updateIncomePayType(this.editFormData);
          this.handleResult(success, OperationEnum.EDIT);
        // }
      }
    } else {
      AppUtils.showWarn(PromptMsg.PROMPT, "请输入有效字符！");
    }
  }


  private handleResult(successP: boolean, flag: number): void {
    this.closeModal();
    let title = PromptMsg.PROMPT;
    let content = "";
    flag === OperationEnum.ADD ? content = "新增" : content = "编辑";
    if (successP) {
      AppUtils.showSuccess(title, content + "成功");
    } else {
      AppUtils.showError(title, content + "失败");
    }

    if (flag == OperationEnum.ADD) {
      this.action(Number(this.typeId));
    } else {
      this.action();
    }
  }
}

class EditIncomePayTypeService {

  constructor(private storeIncomePayMgr: StoreIncomePayMgr,
              private storeIncomePaySynDataHolder: StoreIncomePaySynDataHolder,
              private storeIncomePayViewDataMgr: StoreIncomePayViewDataMgr) {
  }

  public initViewData(typeId) {
    this.storeIncomePayViewDataMgr.setEditIncomePayTypeViewData(new EditIncomePayTypeViewData());
    this.buildViewData(typeId).then(
      (viewDataTmp: EditIncomePayTypeViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: EditIncomePayTypeViewData) {
    this.storeIncomePayViewDataMgr.setEditIncomePayTypeViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param storeId:string
   * @returns Promise<StoreIncomePayTypeListViewData>
   */
  public async buildViewData(typeId: string): Promise<EditIncomePayTypeViewData> {

    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp: EditIncomePayTypeViewData = new EditIncomePayTypeViewData();

    let storeIncomePay: StoreIncomePay = await this.storeIncomePaySynDataHolder.getData(storeId);
    let incomePayTypeList: Array<IncomePayType> = storeIncomePay.getValidIncomePayTypeList();
    let targetIncomePayType: IncomePayType;
    for (let item of incomePayTypeList) {
      if (item.id == typeId) {
        targetIncomePayType = item;
        break;
      }
    }
    viewDataTmp.incomePayType = targetIncomePayType;
    viewDataTmp.name = targetIncomePayType.name;
    viewDataTmp.typeNameList = this.getTypeNameList(incomePayTypeList);
    return new Promise<EditIncomePayTypeViewData>(resolve => {
      resolve(viewDataTmp);
    });

  };

  /**所有分类名 列表*/
  private getTypeNameList(incomePayTypeList) {
    let typeNameListTmp: Array<string> = new Array<string>();
    for (let itemTmp of incomePayTypeList) {
      typeNameListTmp.push(itemTmp.name);
    }
    return typeNameListTmp;
  }

  /**
   * 添加收支分类
   * @param storeId:string
   * @param formData:AddIncomePayTypeData
   * @return Promise<boolean>
   */
  public addIncomePayType(formData: IncomePayTypeAddForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.storeIncomePayMgr.addIncomePayType(formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  /**
   * 修改收支分类
   * @param storeId:string
   * @param formData:IncomePayTypeUpdateForm
   * @return Promise<boolean>
   */
  public updateIncomePayType(formData: IncomePayTypeUpdateForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.storeIncomePayMgr.editIncomePayType(formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  public getIncomePayTypeIdIndex(storeId): Promise<number> {
    return new Promise<number>(resolve => {
      this.storeIncomePaySynDataHolder.getData(storeId).then(
        (storeIncomePay: StoreIncomePay) => {
          resolve(storeIncomePay.incomePayTypeIdIndex);
        }
      );
    });
  }
}

export class EditIncomePayTypeViewData {
  incomePayType: IncomePayType = new IncomePayType();
  name: string;
  typeNameList: Array<string> = new Array<string>();
  category:number; //IncomePayTypeCategoryEnum

  addTypeId: number;
}


