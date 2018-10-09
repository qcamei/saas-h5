import {Component, OnInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy, Output, Inject} from '@angular/core';
import {ChainClerkViewDataMgr} from "../../ChainClerkViewDataMgr";
import {AppUtils} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {ChainClerkAddForm} from "../../../../bsModule/chainClerk/apiData/ChainClerkAddForm";
import {RadioItem} from "../../../zmComp/form/ZmInputRadio";
import {ChainClerkMgr} from "../../../../bsModule/chainClerk/ChainClerkMgr";
import {CrossClerkEnum} from "../../../../bsModule/chainUser/data/CrossClerkEnum";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'addClerk',
  template: `
    <div animation-modal>
      <h2 mat-dialog-title class="mb-4">
        新建员工
      </h2>
      <mat-dialog-content>
        <div style="width:85%;margin:0 auto;">
      
            <zm-input-phone label="手机号"  placeholder="请输入手机号码" [(zmValue)]="viewData.clerkData.phone" [(zmPass)]="viewData.clerkData.phonePass" [required]="true"></zm-input-phone>
            
            <zm-password label="默认密码" placeholder="请输入默认密码" [(zmValue)]="viewData.clerkData.password" [(zmPass)]="viewData.clerkData.passwordPass"></zm-password>

            <zm_input_name label="姓名"  placeholder="请输入姓名" [(zmValue)]="viewData.clerkData.name" [(zmPass)]="viewData.clerkData.namePass" [required]="true"></zm_input_name>
            
            
            <div fxLayout="column">
               <label class="mr-4">性别</label>
               <zm_input_radio [radioList]="viewData.genderRadioList" [(curValue)]="viewData.genderValue" ></zm_input_radio>
            </div>
            <div fxLayout="column" class="mt-20">
              <label class="mr-4">是否跨店员工</label>
              <switch-button-comp style="margin-left:-18px;" [(state)]="viewData.isStoreClerk"></switch-button-comp>
            </div>
          
          </div>
      </mat-dialog-content>
      
      <mat-dialog-actions fxLayout="row wrap"  fxLayoutGap="20px" fxLayoutAlign="end">
          <zm_btn_md [stroked] = "true" (zmbtnClick)="closeModal()" [name]="'取消'"></zm_btn_md>
          <zm_btn_md (zmbtnClick)="addClerk()" [name]="'保存'"></zm_btn_md>
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
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class AddClerkComp implements OnInit,OnDestroy{

  public viewDataSub: any;
  public viewData: AddClerkCompViewData = new AddClerkCompViewData();
  private service: AddClerkCompService;

  activeModal;
  addFunc: () => void;//回调函数

  constructor(private chainClerkViewDataMgr: ChainClerkViewDataMgr,
              private chainClerkMgr: ChainClerkMgr,
              private cdRef: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public dataInput:any) {

    this.activeModal = dataInput.modalCtrl;
    this.addFunc = dataInput.callBack;

    this.service = new AddClerkCompService(
      this.chainClerkViewDataMgr,
    );
  }

  ngOnInit() {
    this.viewDataSub = this.chainClerkViewDataMgr.subscribeAddClerkVD((viewDataP: AddClerkCompViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData();
  }

  ngOnDestroy(){
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  addClerk() {
    let addChainClerkForm = new ChainClerkAddForm();
    AppUtils.copy(addChainClerkForm,this.viewData.clerkData);
    addChainClerkForm.chainId = SessionUtil.getInstance().getChainId();
    addChainClerkForm.gender = this.viewData.genderValue.value;
    this.viewData.isStoreClerk == true?addChainClerkForm.crossClerk = CrossClerkEnum.True:addChainClerkForm.crossClerk = CrossClerkEnum.False;
    this.chainClerkMgr.addClerk(addChainClerkForm.chainId,addChainClerkForm).then((success)=>{
      this.handleResult(success);
    });
  }

  private handleResult(successP: boolean): void {
    this.closeModal();
    if(successP){
      AppUtils.showSuccess("提示","新建成功");
      this.addFunc();
    }else{
      AppUtils.showError("提示","新建失败");
    }
  }



}
export class AddClerkCompViewData {
  public clerkData = new ChainClerkAddForm();

  public genderRadioList = [new RadioItem("男", 1), new RadioItem("女", 2)];
  public genderValue: RadioItem = this.genderRadioList[1];
  public isStoreClerk:boolean = false;

}


export class AddClerkCompService {
  constructor(private chainClerkViewDataMgr: ChainClerkViewDataMgr,) {
  }

  public initViewData() {
    this.chainClerkViewDataMgr.setAddClerkVD(new AddClerkCompViewData());

    this.buildViewData().then(
      (viewDataTmp: AddClerkCompViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: AddClerkCompViewData) {
    this.chainClerkViewDataMgr.setAddClerkVD(viewDataP);
  }


  public async buildViewData(): Promise<AddClerkCompViewData> {

    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp: AddClerkCompViewData = new AddClerkCompViewData();

    return new Promise<AddClerkCompViewData>(resolve => {
      resolve(viewDataTmp);
    });

  };

}

