import {Component, OnInit, ChangeDetectorRef, Inject} from '@angular/core';
import {StorePackageProjectMgr} from "../../../bsModule/storePackageProject/StorePackageProjectMgr";
import {StorePackageProjectSynDataHolder} from "../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {StorePackageProjectViewDataMgr} from "../StorePackageProjectViewDataMgr";
import {MAT_DIALOG_DATA} from "@angular/material";
import {PackageProjectTypeAddForm} from "../../../bsModule/storePackageProject/apiData/PackageProjectTypeAddForm";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {PackageProjectType} from "../../../bsModule/storePackageProject/data/PackageProjectType";
import {StorePackageProject} from "../../../bsModule/storePackageProject/data/StorePackageProject";



@Component({
  selector: 'undefined-packageType',
  template: `
    <div animation-modal>
      <h2 mat-dialog-title>
        {{modalHeader}}
      </h2>
      <mat-dialog-content>
        <div class=" form-group" fxLayout="row wrap"  fxLayoutGap="20px" fxLayoutAlign="start center" >
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
        <zm-btn [disabled]="typeName.invalid" (click)="addPackageType()" name="保存"></zm-btn>
        
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
export class AddPackageTypeWithReturnComp implements OnInit {

  public viewDataSub: any;
  public viewData: AddTypeWithReturnViewData = new AddTypeWithReturnViewData();
  private service: AddTypeWithReturnService;

  public modalHeader: string;
  public modalCloseFunc: (typeId) => void;//回调函数
  public activeModal;

  constructor(private storePackageProjectMgr: StorePackageProjectMgr,
              private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private storePackageProjectViewDataMgr: StorePackageProjectViewDataMgr,
              private cdRef: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public dataInput: any) {

    this.activeModal = dataInput.modalCtrl;
    this.modalHeader = dataInput.modalData.modalHeader;
    this.modalCloseFunc = dataInput.callBack;

    this.service = new AddTypeWithReturnService(this.storePackageProjectMgr, this.storePackageProjectSynDataHolder, this.storePackageProjectViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.storePackageProjectViewDataMgr.subscribeAddTypeWithReturnVD((viewDataP: AddTypeWithReturnViewData) => {
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
        this.viewData.addTypeId = this.addFormData.index.toString();
        this.addFormData.name = AppUtils.trimBlank(this.viewData.name);
        let success: boolean = await this.service.addPackageType(this.addFormData);
        this.handleResult(success);
      }
    } else {
      AppUtils.showWarn(PromptMsg.PROMPT, "请输入有效字符！");
    }
  }


  private handleResult(successP: boolean): void {
    this.closeModal();
    if (successP) {
      AppUtils.showSuccess("提示", "新增成功");
    } else {
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

  constructor(private storePackageProjectMgr: StorePackageProjectMgr,
              private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private storePackageProjectViewDataMgr: StorePackageProjectViewDataMgr) {
  }

  public initViewData() {
    this.storePackageProjectViewDataMgr.setAddTypeWithReturnViewData(new AddTypeWithReturnViewData());
    this.buildViewData().then(
      (viewDataTmp: AddTypeWithReturnViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: AddTypeWithReturnViewData) {
    this.storePackageProjectViewDataMgr.setAddTypeWithReturnViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param storeId:string
   * @returns Promise<StorePackageTypeListViewData>
   */
  public async buildViewData(): Promise<AddTypeWithReturnViewData> {

    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp: AddTypeWithReturnViewData = new AddTypeWithReturnViewData();

    let storePackageProject: StorePackageProject = await this.storePackageProjectSynDataHolder.getData(storeId);
    let packageTypeMap: ZmMap<PackageProjectType> = storePackageProject.getValidPackageTypeMap();
    viewDataTmp.typeNameList = this.getTypeNameList(packageTypeMap.values());
    return new Promise<AddTypeWithReturnViewData>(resolve => {
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

