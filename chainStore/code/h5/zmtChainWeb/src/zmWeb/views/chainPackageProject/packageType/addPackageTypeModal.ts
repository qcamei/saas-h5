import {Component, OnInit, ChangeDetectorRef, Inject} from '@angular/core';
import {PackageProjectType} from "../../../bsModule/chainPackageProject/data/PackageProjectType";
import {ChainPackageProjectSynDataHolder} from "../../../bsModule/chainPackageProject/chainPackageProjectSynDataHolder";
import {ChainPackageProjectMgr} from "../../../bsModule/chainPackageProject/chainPackageProjectMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {PackageProjectTypeAddForm} from "../../../bsModule/chainPackageProject/apiData/PackageProjectTypeAddForm";
import {PackageProjectTypeUpdateForm} from "../../../bsModule/chainPackageProject/apiData/PackageProjectTypeUpdateForm";
import {ChainPackageProject} from "../../../bsModule/chainPackageProject/data/ChainPackageProject";
import {OperationEnum} from "../../../comModule/enum/OperationEnum";
import {ChainPackageProjectViewDataMgr} from "../StorePackageProjectViewDataMgr";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'undefined-packageType',
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
        <zm_btn notRepeatSubmit *ngIf="typeId == null" [disabled]="typeName.invalid" (click)="addPackageType()" name="保存"></zm_btn>
        <zm_btn notRepeatSubmit *ngIf="typeId != null" [disabled]="typeName.invalid" (click)="editPackageType(typeId)" name="保存"></zm_btn>
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
export class AddPackageTypeComponent implements OnInit {

  public viewDataSub: any;
  public viewData: EditPackageTypeViewData = new EditPackageTypeViewData();
  private service: EditPackageTypeService;

  modalHeader: string;
  modalCloseFunc: () => void;//回调函数
  activeModal;
  typeId: string;

  constructor(
              private chainPackageProjectMgr: ChainPackageProjectMgr,
              private chainPackageProjectSynDataHolder: ChainPackageProjectSynDataHolder,
              private chainPackageProjectViewDataMgr: ChainPackageProjectViewDataMgr,
              private cdRef: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public dataInput:any) {

    this.activeModal = dataInput.modalCtrl;
    this.modalHeader = dataInput.modalData.modalHeader;
    this.typeId =  dataInput.modalData.typeId;
    this.modalCloseFunc = dataInput.callBack ;

    this.service = new EditPackageTypeService(this.chainPackageProjectMgr, this.chainPackageProjectSynDataHolder, this.chainPackageProjectViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainPackageProjectViewDataMgr.subscribeEditPackageTypeVD((viewDataP: EditPackageTypeViewData) => {
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
   * 添加套餐分类 点击事件
   */
  public addFormData = new PackageProjectTypeAddForm();
  public async addPackageType() {
    let chainId = SessionUtil.getInstance().getChainId();
    let name = AppUtils.trimBlank(this.viewData.name);
    if (!AppUtils.isNullOrWhiteSpace(name)) {
      if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
        AppUtils.showWarn(PromptMsg.PROMPT, "套餐分类已存在");
        return;
      } else {
        let packageTypeIdIndex: number = await this.service.getPackageTypeIdIndex(chainId);
        this.addFormData.index = parseInt(packageTypeIdIndex.toString()) + 1;
        this.addFormData.name = AppUtils.trimBlank(this.viewData.name);
        let success: boolean = await this.service.addPackageType(this.addFormData);
        this.handleResult(success, OperationEnum.ADD);
      }
    } else {
      AppUtils.showWarn(PromptMsg.PROMPT, "请输入有效字符！");
    }
  }

  /**
   * 编辑套餐分类 点击事件
   */
  public editFormData = new PackageProjectTypeUpdateForm();
  public async editPackageType(typeId: string) {
    let name = AppUtils.trimBlank(this.viewData.name);
    if (!AppUtils.isNullOrWhiteSpace(name)) {
      if (this.viewData.name == this.viewData.packageType.name) {
        AppUtils.showSuccess(PromptMsg.PROMPT, "编辑成功");
        this.closeModal();
      } else {
        if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
          AppUtils.showWarn(PromptMsg.PROMPT, "套餐分类已存在");
          return;
        } else {
          this.editFormData.id = typeId;
          this.editFormData.name = this.viewData.name;
          let success: boolean = await this.service.updatePackageType(this.editFormData);
          this.handleResult(success, OperationEnum.EDIT);
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

export class EditPackageTypeViewData {
  packageType: PackageProjectType = new PackageProjectType();
  name: string;
  typeNameList: Array<string> = new Array<string>();
}


class EditPackageTypeService {

  constructor(private chainPackageProjectMgr: ChainPackageProjectMgr,
              private chainPackageProjectSynDataHolder: ChainPackageProjectSynDataHolder,
              private chainPackageProjectViewDataMgr: ChainPackageProjectViewDataMgr) {
  }

  public initViewData(typeId) {
    this.chainPackageProjectViewDataMgr.setEditPackageTypeViewData(new EditPackageTypeViewData());
    this.buildViewData(typeId).then(
      (viewDataTmp: EditPackageTypeViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: EditPackageTypeViewData) {
    this.chainPackageProjectViewDataMgr.setEditPackageTypeViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param chainId:string
   * @returns Promise<StorePackageTypeListViewData>
   */
  public async buildViewData(typeId: string): Promise<EditPackageTypeViewData> {

    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp: EditPackageTypeViewData = new EditPackageTypeViewData();

    let chainPackageProject: ChainPackageProject = await this.chainPackageProjectSynDataHolder.getData(chainId);
    let packageTypeMap: ZmMap<PackageProjectType> = chainPackageProject.getValidPackageTypeMap();
    if (typeId) {
      let targetPackageType: PackageProjectType = packageTypeMap.get(typeId);
      viewDataTmp.packageType = targetPackageType;
      viewDataTmp.name = targetPackageType.name;
    }
    viewDataTmp.typeNameList = this.getTypeNameList(packageTypeMap.values());
    return new Promise<EditPackageTypeViewData>(resolve => {
      resolve(viewDataTmp);
    });

  };

  /**所有分类名 列表*/
  private getTypeNameList(packageTypeList) {
    let typeNameListTmp: Array<string> = new Array<string>();
    for (let itemTmp of packageTypeList) {
      typeNameListTmp.push(itemTmp.name);
    }
    return typeNameListTmp;
  }

  /**
   * 添加套餐分类
   * @param chainId:string
   * @param formData:AddPackageTypeData
   * @return Promise<boolean>
   */
  public addPackageType(formData: PackageProjectTypeAddForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.chainPackageProjectMgr.addPackageProjectType(formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  /**
   * 修改项目分类
   * @param chainId:string
   * @param formData:AddPackageTypeData
   * @return Promise<boolean>
   */
  public updatePackageType(formData: PackageProjectTypeUpdateForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.chainPackageProjectMgr.updatePackageProjectType(formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  public getPackageTypeIdIndex(chainId): Promise<number> {
    return new Promise<number>(resolve => {
      this.chainPackageProjectSynDataHolder.getData(chainId).then(
        (chainPackageProject: ChainPackageProject) => {
          resolve(chainPackageProject.packageProjectTypeIndex);
        }
      );
    });
  }
}

