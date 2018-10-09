import {Component, OnInit, ChangeDetectorRef, Inject} from '@angular/core';
import {ChainPackageProjectMgr} from "../../../../bsModule/chainPackageProject/chainPackageProjectMgr";
import {ChainPackageProjectSynDataHolder} from "../../../../bsModule/chainPackageProject/chainPackageProjectSynDataHolder";
import {ChainPackageProjectViewDataMgr} from "../../StorePackageProjectViewDataMgr";
import {MAT_DIALOG_DATA} from "@angular/material";
import {PackageProjectTypeAddForm} from "../../../../bsModule/chainPackageProject/apiData/PackageProjectTypeAddForm";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {ChainPackageProject} from "../../../../bsModule/chainPackageProject/data/ChainPackageProject";
import {PackageProjectType} from "../../../../bsModule/chainPackageProject/data/PackageProjectType";


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
          <zm_btn notRepeatSubmit  [disabled]="typeName.invalid" (click)="addPackageType()" name="保存"></zm_btn>

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
export class AddPackageTypeWithReturnComp implements OnInit {

  public viewDataSub: any;
  public viewData: AddTypeWithReturnViewData = new AddTypeWithReturnViewData();
  private service: AddTypeWithReturnService;

  public modalHeader: string;
  public modalCloseFunc: (typeId) => void;//回调函数
  public activeModal;

  constructor(private chainPackageProjectMgr: ChainPackageProjectMgr,
              private chainPackageProjectSynDataHolder: ChainPackageProjectSynDataHolder,
              private chainPackageProjectViewDataMgr: ChainPackageProjectViewDataMgr,
              private cdRef: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public dataInput: any) {

    this.activeModal = dataInput.modalCtrl;
    this.modalHeader = dataInput.modalData.modalHeader;
    this.modalCloseFunc = dataInput.callBack;

    this.service = new AddTypeWithReturnService(this.chainPackageProjectMgr, this.chainPackageProjectSynDataHolder, this.chainPackageProjectViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainPackageProjectViewDataMgr.subscribeAddTypeWithReturnVD((viewDataP: AddTypeWithReturnViewData) => {
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
    let chainId = SessionUtil.getInstance().getChainId();
    let name = AppUtils.trimBlank(this.viewData.name);
    if (!AppUtils.isNullOrWhiteSpace(name)) {
      if (AppUtils.arrayContains(this.viewData.typeNameList, this.viewData.name)) {
        AppUtils.showWarn(PromptMsg.PROMPT, "套餐分类已存在");
        return;
      } else {
        let packageTypeIdIndex: number = await this.service.getPackageTypeIdIndex(chainId);
        this.addFormData.index = parseInt(packageTypeIdIndex.toString()) + 1;
        this.viewData.addTypeId = this.addFormData.index;
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
  addTypeId: number;
}


class AddTypeWithReturnService {

  constructor(private chainPackageProjectMgr: ChainPackageProjectMgr,
              private chainPackageProjectSynDataHolder: ChainPackageProjectSynDataHolder,
              private chainPackageProjectViewDataMgr: ChainPackageProjectViewDataMgr) {
  }

  public initViewData() {
    this.chainPackageProjectViewDataMgr.setAddTypeWithReturnViewData(new AddTypeWithReturnViewData());
    this.buildViewData().then(
      (viewDataTmp: AddTypeWithReturnViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: AddTypeWithReturnViewData) {
    this.chainPackageProjectViewDataMgr.setAddTypeWithReturnViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param chainId:string
   * @returns Promise<StorePackageTypeListViewData>
   */
  public async buildViewData(): Promise<AddTypeWithReturnViewData> {

    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp: AddTypeWithReturnViewData = new AddTypeWithReturnViewData();

    let chainPackageProject: ChainPackageProject = await this.chainPackageProjectSynDataHolder.getData(chainId);
    let packageTypeMap: ZmMap<PackageProjectType> = chainPackageProject.getValidPackageTypeMap();
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

