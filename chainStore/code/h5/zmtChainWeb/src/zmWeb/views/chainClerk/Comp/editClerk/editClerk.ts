import {Component, OnInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy, Inject} from '@angular/core';
import {ChainClerkViewDataMgr} from "../../ChainClerkViewDataMgr";
import {AppUtils} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {RadioItem} from "../../../zmComp/form/ZmInputRadio";
import {ChainClerkMgr} from "../../../../bsModule/chainClerk/ChainClerkMgr";
import {CrossClerkEnum} from "../../../../bsModule/chainUser/data/CrossClerkEnum";
import {ChainUser} from "../../../../bsModule/chainUser/data/ChainUser";
import {ChainClerkUpdateInfoForm} from "../../../../bsModule/chainClerk/apiData/ChainClerkUpdateInfoForm";
import {ChainUserSynDataHolder} from "../../../../bsModule/chainUser/ChainUserSynDataHolder";
import {GenderEnum} from "../../../../comModule/enum/GenderEnum";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'editClerk',
  template: `
  <div animation-modal>
      <h2 mat-dialog-title class="mb-4">
        编辑员工
      </h2>
      <mat-dialog-content>
        <div style="width:85%;margin:0 auto;">
        
        <zm-input-phone label="手机号"  placeholder="请输入手机号码" [disabled]="true"  [(zmValue)]="viewData.clerkInfo.phone" [(zmPass)]="viewData.clerkInfo.phonePass" [required]="true"></zm-input-phone>
        
        <zm_input_name label="姓名"  placeholder="请输入姓名" [(zmValue)]="viewData.clerkInfo.name" [(zmPass)]="viewData.clerkInfo.namePass" [required]="true"></zm_input_name>
      
     
        <div  fxLayout="column">
           <label class="mr-4">性别<span class="px-8" style="color:red;">*</span></label>
           <zm_input_radio [radioList]="viewData.genderRadioList" [(curValue)]="viewData.genderValue" ></zm_input_radio>
        </div>
            
        <div fxLayout="column" class="mt-20">
              <label class="mr-4">是否跨店员工<span class="px-8" style="color:red;">*</span></label>
              <switch-button-comp style="margin-left:-18px;" [(state)]="viewData.isStoreClerk"></switch-button-comp>
        </div> 
        
        </div>
      </mat-dialog-content>
      
      <mat-dialog-actions fxLayout="row wrap"  fxLayoutGap="20px" fxLayoutAlign="end">
          <zm_btn_md [stroked] = "true" (zmbtnClick)="closeModal()" [name]="'取消'"></zm_btn_md>
          <zm_btn_md (zmbtnClick)="editClerk(viewData.clerkInfo.id)" [name]="'保存'"></zm_btn_md>
      </mat-dialog-actions>
  </div>

      
`,

styles:[`

::-webkit-scrollbar{
    width: 2px !important;
}
::-webkit-scrollbar-thumb
{
    border-radius: 10px !important;
    background-color: #03a9f4 !important;
}
`],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class EditClerkComp implements OnInit,OnDestroy {

  public viewDataSub: any;
  public viewData: EditClerkCompViewData = new EditClerkCompViewData();
  private service: EditClerkCompService;

  activeModal;
  clerkId: number;
  editFunc: () => void;//回调函数

  constructor(private chainClerkViewDataMgr: ChainClerkViewDataMgr,
              private chainClerkMgr: ChainClerkMgr,
              private chainUserSynDataHolder: ChainUserSynDataHolder,
              private cdRef: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public dataInput:any) {

    this.activeModal = dataInput.modalCtrl;
    this.clerkId = dataInput.modalData.clerkId;
    this.editFunc = dataInput.callBack;

    this.service = new EditClerkCompService(
      this.chainClerkViewDataMgr,
      this.chainUserSynDataHolder
    );
  }

  ngOnInit() {
    this.viewDataSub = this.chainClerkViewDataMgr.subscribeEditClerkVD((viewDataP: EditClerkCompViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData(this.clerkId);
  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  editClerk(clerkId: number) {
    let chainId = SessionUtil.getInstance().getChainId();
    let editChainClerkForm = new ChainClerkUpdateInfoForm();
    editChainClerkForm.id = clerkId;
    editChainClerkForm.name = this.viewData.clerkInfo.name;
    editChainClerkForm.gender = this.viewData.genderValue.value;
    this.viewData.isStoreClerk == true ? editChainClerkForm.crossClerk = CrossClerkEnum.True : editChainClerkForm.crossClerk = CrossClerkEnum.False;
    this.chainClerkMgr.editClerk(chainId, editChainClerkForm).then((success) => {
      this.handleResult(success);
    });
  }

  private handleResult(successP: boolean): void {
    this.closeModal();
    if (successP) {
      AppUtils.showSuccess("提示", "编辑成功");
      this.editFunc();
    } else {
      AppUtils.showError("提示", "编辑失败");
    }
  }


}
export class EditClerkCompViewData {
  public clerkInfo = new ChainUser();
  public genderRadioList = [new RadioItem("男", 1), new RadioItem("女", 2)];
  public genderValue: RadioItem = this.genderRadioList[1];
  public isStoreClerk: boolean = false;

}


export class EditClerkCompService {
  constructor(private chainClerkViewDataMgr: ChainClerkViewDataMgr,
              private chainUserSynDataHolder: ChainUserSynDataHolder) {
  }

  public initViewData(clerkId:number) {
    this.chainClerkViewDataMgr.setEditClerkVD(new EditClerkCompViewData());

    this.buildViewData(clerkId).then(
      (viewDataTmp: EditClerkCompViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: EditClerkCompViewData) {
    this.chainClerkViewDataMgr.setEditClerkVD(viewDataP);
  }


  public async buildViewData(clerkId:number): Promise<EditClerkCompViewData> {

    let viewDataTmp: EditClerkCompViewData = new EditClerkCompViewData();
    viewDataTmp.clerkInfo = await this.chainUserSynDataHolder.getData(clerkId);
    if(viewDataTmp.clerkInfo.gender == GenderEnum.FEMALE){
      viewDataTmp.genderValue  = viewDataTmp.genderRadioList[1];
    }else{
      viewDataTmp.genderValue  = viewDataTmp.genderRadioList[0];
    }
    viewDataTmp.clerkInfo.crossClerk == CrossClerkEnum.True?viewDataTmp.isStoreClerk = true:viewDataTmp.isStoreClerk= false;
    return new Promise<EditClerkCompViewData>(resolve => {
      resolve(viewDataTmp);
    });

  };

}

