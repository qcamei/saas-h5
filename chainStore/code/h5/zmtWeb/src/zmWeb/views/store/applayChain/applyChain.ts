import {Component, OnInit, Input,  Output, Inject} from '@angular/core';
import {ChainMgr} from "../../../bsModule/chain/ChainMgr";
import {ApplyChainForm} from "../../../bsModule/chain/apiData/ApplyChainForm";
import {Chain} from "../../../bsModule/chain/data/Chain";
import {AppUtils} from "../../../comModule/AppUtils";
import {RestResp} from "../../../comModule/RestResp";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'applayHeadComp',
  template: `


  <div animation-modal>
            <h2 mat-dialog-title>
               申请加入总部
            </h2>
            <mat-dialog-content>
               <zm-input-text label="申请门店:" [zmValue]="storeName" [disabled]="true" [required]="true"  [maxlength]="50" ></zm-input-text>
             
               <zm-input-text label="总部编号:" placeholder="请输入总部编号"  [(zmValue)]="chainNumber"  [maxlength]="50"></zm-input-text>
               
                <zm-input-textarea [label]="'备注:'" [placeholder]="'请填写备注信息'" [(text)]="mark"></zm-input-textarea>
            
            </mat-dialog-content>
            <mat-dialog-actions fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
                <zm-btn-md [stroked]="true" (click)="closeModal()" name="取消"></zm-btn-md>
                <zm-btn-md  (click)="applyChain()" name="确定"></zm-btn-md>
            </mat-dialog-actions>
  </div>

`,
  styles: [`
 
  `]
})
export class ApplyChainComp implements OnInit {

  @Input() storeId:string;
  @Input() storeName:string;
  @Output() action:any;
  public chainNumber:string;
  public mark:string;

  private activeModal: any;
  constructor(private chainMgr:ChainMgr, @Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit() {

  }

  /**
   * 关闭弹框
   */
  closeModal(){
    this.activeModal.close();
  }

  /**
   * 申请加入连锁店
   */
  applyChain(){
    if(!AppUtils.isNullObj(this.chainNumber) && !AppUtils.isNullOrWhiteSpace(this.chainNumber)){
      this.chainNumber = AppUtils.trimBlank(this.chainNumber);
      this.chainMgr.findByNumber(this.chainNumber).then((restResp:RestResp)=>{
        if(!AppUtils.isNullObj(restResp) && (restResp.code == 200) && !AppUtils.isNullOrWhiteSpace(restResp.tJson)){
          let chainTmp = new Chain();
          AppUtils.copyJson(chainTmp,restResp.tJson);
          let applyChainForm = new ApplyChainForm();
          applyChainForm.storeId = this.storeId;
          applyChainForm.chainId = chainTmp.id;
          this.chainMgr.applyChain(chainTmp.id,applyChainForm).then((success:boolean)=>{
            if(success){
              AppUtils.showSuccess("提示","申请成功，请及时联系连锁店管理员审核");
              this.action();
              this.closeModal();
            }else{
              AppUtils.showError("提示","申请失败");
            }
          })
        }else{
          AppUtils.showError("提示","连锁店不存在");
        }
      })
    }
  }

}

