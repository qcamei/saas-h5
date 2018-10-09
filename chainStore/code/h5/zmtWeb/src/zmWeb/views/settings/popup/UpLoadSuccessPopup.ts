import {Component, Input, Inject} from '@angular/core';

import {StoreLeaguerInfoMgr} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoMgr";
import {StoreGoodsMgr} from "../../../bsModule/storeGoods/StoreGoodsMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {ImportSuccessPopup} from "./ImportSuccessPopup";
import {RestResp} from "../../../comModule/RestResp";
import {setPopup} from "./setPopup";
import {StoreProductInfoMgr} from "../../../bsModule/StoreProductInfo/StoreProductInfoMgr";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";

/**上传成功模态框**/

@Component({
  selector: 'upload_success_popup',
  template: `

     <div animation-modal>
            <h2 mat-dialog-title>
               上传成功
            </h2>
            <mat-dialog-content>
                        <h4 [innerHTML]="setContent"></h4>
            
            </mat-dialog-content>
            <mat-dialog-actions fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
                  <zm-btn-md [stroked]="true" (click)="closeModal()" name="取消"></zm-btn-md>
                  <zm-btn-md  (click)="confirmEvent()" name="确定导入"></zm-btn-md>
            </mat-dialog-actions>
      </div>

  `,
  styleUrls:['./popup.scss']
})
export class UploadSuccessPopup {

  @Input() setContent: any;
  @Input() section: string;
  @Input() addListForm: any;
  private activeModal:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dataInput:any,
              private matDialog: MatDialog,
              private storeLeaguerMgr: StoreLeaguerInfoMgr,
              private storePrdMgr: StoreProductInfoMgr,
              private storeGoodsMgr: StoreGoodsMgr) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.activeModal = dataInput.modalCtrl;
  }

  private storeId: string = SessionUtil.getInstance().getStoreId();

  public async confirmEvent() {

    this.closeModal();

    let temp:any = `
      <p class="popup" style="position: fixed; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); -moz-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%); background: #fff; background: #fff; z-index: 9999; width: 450px; -moz-border-radius: 8px; border-radius: 8px; text-align: center; background: none;"><span class="font-size-18">正在导入数据，请稍候...</span></p>
      <div class="mask" style="position: fixed; left: 0; top: 0; height: 100%; width: 100%; background: #000; opacity: .3; z-index: 9998;"></div>
    `;

    let z = document.createElement('div');
    z.className = 'pop-plu';
    z.innerHTML = temp;
    document.body.appendChild(z);

    if(this.section == "会员") {
      let restResp:RestResp = await this.storeLeaguerMgr.addLeaguerListFromExcel(this.storeId, this.addListForm);
      this.handleResult(restResp);

    }else if (this.section == "项目"){
      let restResp:RestResp = await this.storePrdMgr.addProductListFromExcel(this.storeId, this.addListForm);
      this.handleResult(restResp);

    } else if (this.section == "商品"){

      let restResp:RestResp = await this.storeGoodsMgr.addGoodsListFromExcel(this.storeId, this.addListForm);
      this.handleResult(restResp);
    }
  }

  private handleResult(restResp:RestResp) {

    let z = document.getElementsByClassName("pop-plu")[0];
    document.body.removeChild(z);

    this.closeModal();

    if(restResp.code == 200){
      const activeModal = ZmModalMgr.getInstance().newModal(ImportSuccessPopup);
      activeModal.componentInstance.setContent = this.section + "数据导入成功";
      activeModal.componentInstance.tips = restResp.tips;
      if(restResp.tips == "成功"){
        activeModal.componentInstance.tips = "";
      }
      activeModal.componentInstance.section = this.section;
    }else if(restResp.code == 500){
      let content = "请稍后重试";
      this.failModal(content);
    }else{
      let content = "文件有误，请重新导入";
      this.failModal(content);
    }
  }

  private failModal(content){
    const activeModal = ZmModalMgr.getInstance().newModal(setPopup);
    activeModal.componentInstance.title = "导入失败";
    activeModal.componentInstance.setContent = content;
    activeModal.componentInstance.btnText = "";
    activeModal.componentInstance.confirmBtn = "确定";
  }

  public closeModal() {
    this.activeModal.close();
  }

}
