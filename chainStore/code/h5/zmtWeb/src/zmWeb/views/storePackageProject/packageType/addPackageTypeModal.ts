import {Component, OnInit, ChangeDetectorRef, Inject} from '@angular/core';
import {PackageProjectType} from "../../../bsModule/storePackageProject/data/PackageProjectType";
import {StorePackageProjectSynDataHolder} from "../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {StorePackageProjectMgr} from "../../../bsModule/storePackageProject/StorePackageProjectMgr";
import {StorePackageProjectViewDataMgr} from "../StorePackageProjectViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {SessionUtil} from "../../../comModule/session/SessionUtil";

import {PackageProjectTypeAddForm} from "../../../bsModule/storePackageProject/apiData/PackageProjectTypeAddForm";
import {PackageProjectTypeUpdateForm} from "../../../bsModule/storePackageProject/apiData/PackageProjectTypeUpdateForm";
import {StorePackageProject} from "../../../bsModule/storePackageProject/data/StorePackageProject";
import {OperationEnum} from "../../../comModule/enum/OperationEnum";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'undefined-packageType',
  template: `

  <div animation-modal>
      <h2 mat-dialog-title>
        {{modalHeader}}
      </h2>
      <mat-dialog-content>
        <div class="form-group " fxLayout="row wrap"  fxLayoutGap="20px" fxLayoutAlign="start center" >
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
        <zm-btn  *ngIf="typeId == null" [disabled]="false" (click)="addPackageType()" name="保存"></zm-btn>
        <zm-btn  *ngIf="typeId != null" [disabled]="false" (click)="editPackageType(typeId)" name="保存"></zm-btn>
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
export class AddPackageTypeComponent implements OnInit {

  public viewDataSub: any;
  public viewData: EditPackageTypeViewData = new EditPackageTypeViewData();

  private service: EditPackageTypeService;

  modalHeader: string;
  typeId: string;
  editFunc: () => void;//回调函数
  addFunc:(typeId) => void;//回调函数
  activeModal;

  constructor(
              private storePackageProjectMgr: StorePackageProjectMgr,
              private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private storePackageProjectViewDataMgr: StorePackageProjectViewDataMgr,
              private cdRef: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public dataInput:any) {

    this.activeModal = dataInput.modalCtrl;
    this.modalHeader = dataInput.modalData.modalHeader;
    this.typeId =  dataInput.modalData.typeId;
    this.editFunc = dataInput.callBack ;
    this.addFunc = dataInput.callBack ;


    this.service = new EditPackageTypeService(this.storePackageProjectMgr, this.storePackageProjectSynDataHolder, this.storePackageProjectViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.storePackageProjectViewDataMgr.subscribeEditPackageTypeVD((viewDataP: EditPackageTypeViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData(this.typeId);
  }

  closeModal() {
    this.activeModal.close();
  }


  /**
   * 添加套餐分类 点击事件
   */
  public addFormData = new PackageProjectTypeAddForm();

  public async addPackageType() {
    let storeId = SessionUtil.getInstance().getStoreId();
    let name = AppUtils.trimBlank(this.viewData.name);
    if (!AppUtils.isNullOrWhiteSpace(name)) {
      if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
        AppUtils.showWarn(PromptMsg.PROMPT, "套餐分类已存在");
        return;
      } else {
        let packageTypeIdIndex: number = await this.service.getPackageTypeIdIndex(storeId);
        this.addFormData.index = parseInt(packageTypeIdIndex.toString()) + 1;
        this.viewData.addTypeId = this.addFormData.index;
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
      this.addFunc(this.viewData.addTypeId);
    } else {
      this.editFunc();
    }
  }


}

export class EditPackageTypeViewData {
  packageType: PackageProjectType = new PackageProjectType();
  name: string;
  typeNameList: Array<string> = new Array<string>();

  addTypeId: number;
}


class EditPackageTypeService {

  constructor(private storePackageProjectMgr: StorePackageProjectMgr,
              private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private storePackageProjectViewDataMgr: StorePackageProjectViewDataMgr) {
  }

  public initViewData(typeId) {
    this.storePackageProjectViewDataMgr.setEditPackageTypeViewData(new EditPackageTypeViewData());
    this.buildViewData(typeId).then(
      (viewDataTmp: EditPackageTypeViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: EditPackageTypeViewData) {
    this.storePackageProjectViewDataMgr.setEditPackageTypeViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param storeId:string
   * @returns Promise<StorePackageTypeListViewData>
   */
  public async buildViewData(typeId: string): Promise<EditPackageTypeViewData> {

    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp: EditPackageTypeViewData = new EditPackageTypeViewData();

    let storePackageProject: StorePackageProject = await this.storePackageProjectSynDataHolder.getData(storeId);
    let packageTypeList: Array<PackageProjectType> = storePackageProject.getValidPackageTypeMap().values();
    let targetPackageType: PackageProjectType = storePackageProject.getPackageTypeDetail(typeId);
    viewDataTmp.packageType = targetPackageType;
    viewDataTmp.name = targetPackageType.name;
    viewDataTmp.typeNameList = this.getTypeNameList(packageTypeList);
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
   * @param storeId:string
   * @param formData:AddPackageTypeData
   * @return Promise<boolean>
   */
  public addPackageType(formData: PackageProjectTypeAddForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.storePackageProjectMgr.addPackageProjectType(formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  /**
   * 修改项目分类
   * @param storeId:string
   * @param formData:AddPackageTypeData
   * @return Promise<boolean>
   */
  public updatePackageType(formData: PackageProjectTypeUpdateForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.storePackageProjectMgr.updatePackageProjectType(formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  public getPackageTypeIdIndex(storeId): Promise<number> {
    return new Promise<number>(resolve => {
      this.storePackageProjectSynDataHolder.getData(storeId).then(
        (storePackageProject: StorePackageProject) => {
          resolve(storePackageProject.packageProjectTypeIndex);
        }
      );
    });
  }
}

