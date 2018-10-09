import {Component, ChangeDetectorRef} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {VipLevelTypeMgr} from "../../../bsModule/vipLevelType/VipLevelTypeMgr";
import {VipLevelTypeViewDataMgr} from "../vipLevelTypeViewDataMgr";
import {AddVipLevelTypeForm} from "../../../bsModule/vipLevelType/apiData/AddVipLevelTypeForm";
import {AppUtils} from "../../../comModule/AppUtils";
import {UpdateVipLevelTypeForm} from "../../../bsModule/vipLevelType/apiData/UpdateVipLevelTypeForm";
import {OperationEnum} from "../../common/Enum/OperationEnum";
import {VipLevelType} from "../../../bsModule/vipLevelType/data/VipLevelType";
import {QueryVipLevelTypeForm} from "../../../bsModule/vipLevelType/apiData/QueryVipLevelTypeForm";
import {PageResp} from "../../../comModule/PageResp";

@Component({
  selector: 'ngx-modal',
  template: `
    <div animation-modal>
      <div class="modal-header">
        <h4 class="modal-title">{{modalHeader}}</h4>
        <button class="close" aria-label="Close"  (click)="closeModal()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body input-group  form-group c-input-group " style="vertical-align: middle; padding-top:1.725rem;padding-bottom:0;margin-bottom: 0">
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
      <div class="modal-footer">
     <button class="btn c-md-btn-modal c-close-btn-modal" (click)="closeModal()" style="margin-right: 20px;">取消</button>
      <button notRepeatSubmit class="btn c-btn-blue c-md-btn-modal" [disabled]="typeName.invalid" *ngIf="typeId== null "  (click)="addType()">保存</button>
      <button notRepeatSubmit class="btn c-md-btn-modal c-btn-blue" [disabled]="typeName.invalid" *ngIf="typeId!= null " (click)="editType(typeId)">保存</button>
    </div>
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
export class VipLevelTypeComp {
  public modalHeader: string;
  public typeId: string;
  public callback: () => void;//回调函数

  public viewDataSub: any;
  public viewData: EditVipLevelTypeViewData = new EditVipLevelTypeViewData();
  private service: EditVipLevelTypeService;

  constructor(private activeModal: NgbActiveModal,
              private vipLevelTypeMgr: VipLevelTypeMgr,
              private vipLevelTypeViewDataMgr: VipLevelTypeViewDataMgr,
              private cdRef: ChangeDetectorRef) {
    this.service = new EditVipLevelTypeService(
      this.vipLevelTypeMgr, this.vipLevelTypeViewDataMgr)
  }

  ngOnInit() {
    this.viewDataSub = this.vipLevelTypeViewDataMgr.subscribeEditVipLevelTypeVD((viewDataP: EditVipLevelTypeViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData(this.typeId);
  }

  closeModal() {
    this.activeModal.close();
    this.callback();
  }


  /**
   * 添加等级分类 点击事件
   */

  public async addType() {
    let name = AppUtils.trimBlank(this.viewData.name);
    if (!AppUtils.isNullOrWhiteSpace(name)) {
      if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
        AppUtils.showWarn("提示", "等级分类已存在");
        return;
      } else {
        await this.add();
      }
    } else {
      AppUtils.showWarn("提示", "请输入有效字符！");
    }

  }

  private async add() {
    let addFormData = new AddVipLevelTypeForm();
    addFormData.name = AppUtils.trimBlank(this.viewData.name);

    let vipLevelType = await this.service.addVipLevelType(addFormData);
    this.closeModal();
    if (!AppUtils.isNullObj(vipLevelType)) {
      AppUtils.showSuccess("提示", "新增成功");
    } else {
      AppUtils.showError("提示", "新增失败");
    }


  }

  /**
   * 编辑等级分类 点击事件
   */


  public async editType(typeId: number) {
    let name = AppUtils.trimBlank(this.viewData.name);
    if (!AppUtils.isNullOrWhiteSpace(name)) {
      if (this.viewData.name == this.viewData.vipLevelType.name) {
        AppUtils.showSuccess("提示", "编辑成功");
        this.closeModal();
      } else {
        if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
          AppUtils.showWarn("提示", "等级分类已存在");
          return;
        } else {
          await this.edit(typeId);
        }
      }
    } else {
      AppUtils.showWarn("提示", "请输入有效字符！");
    }
  }

  private async edit(typeId) {
    let editFormData = new UpdateVipLevelTypeForm();
    editFormData.id = typeId;
    editFormData.name = this.viewData.name;
    let success: boolean = await this.service.updateVipLevelType(typeId, editFormData);
    this.closeModal();
    if (success) {
      AppUtils.showSuccess("提示", "编辑成功");
    } else {
      AppUtils.showError("提示", "编辑失败");
    }
  }


}

export class EditVipLevelTypeViewData {
  vipLevelType: VipLevelType = new VipLevelType();
  name: string;
  typeNameList: Array<string> = new Array<string>();
}


class EditVipLevelTypeService {

  constructor(private vipLevelTypeMgr: VipLevelTypeMgr,
              private vipLevelTypeViewDataMgr: VipLevelTypeViewDataMgr) {
  }

  public initViewData(typeId) {
    this.vipLevelTypeViewDataMgr.setEditVipLevelTypeViewData(new EditVipLevelTypeViewData());
    this.buildViewData(typeId).then(
      (viewDataTmp: EditVipLevelTypeViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: EditVipLevelTypeViewData) {
    this.vipLevelTypeViewDataMgr.setEditVipLevelTypeViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param chainId:string
   * @returns Promise<StorePrdTypeListViewData>
   */
  public async buildViewData(typeId: number): Promise<EditVipLevelTypeViewData> {
    let viewDataTmp: EditVipLevelTypeViewData = new EditVipLevelTypeViewData();
    if (typeId) {
      let vipLevelType: VipLevelType = await this.vipLevelTypeMgr.getVipLevelType(typeId);
      viewDataTmp.vipLevelType = vipLevelType;
      viewDataTmp.name = vipLevelType.name;
    }

    let queryForm: QueryVipLevelTypeForm = new QueryVipLevelTypeForm();
    let pageResp: PageResp = await this.vipLevelTypeMgr.getAllList(queryForm);
    viewDataTmp.typeNameList = this.getTypeNameList(pageResp.list);
    return new Promise<EditVipLevelTypeViewData>(resolve => {
      resolve(viewDataTmp);
    });

  };

  /**所有分类名 列表*/
  private getTypeNameList(typeList) {
    let typeNameListTmp: Array<string> = new Array<string>();
    for (let itemTmp of typeList) {
      typeNameListTmp.push(itemTmp.name);
    }
    return typeNameListTmp;
  }


  public addVipLevelType(formData: AddVipLevelTypeForm): Promise<VipLevelType> {
    return this.vipLevelTypeMgr.addVipLevelType(formData);
  }


  public updateVipLevelType(typeId: number, formData: UpdateVipLevelTypeForm): Promise<boolean> {
    return this.vipLevelTypeMgr.updateVipLevelType(typeId, formData);
  }

}


