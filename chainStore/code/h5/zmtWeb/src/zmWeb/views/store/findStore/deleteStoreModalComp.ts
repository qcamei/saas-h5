import {Component, Input, OnInit, Output, OnDestroy, Inject} from '@angular/core';

import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppUtils} from "../../../comModule/AppUtils";
import {RestResp} from "../../../comModule/RestResp";
import {StoreUpdateStatusData} from "../../../bsModule/store/apiData/StoreUpdateStatusData";
import {StoreState} from "../../../bsModule/store/apiData/StoreState";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'delete_store_modal',
  template: `

      <div animation-modal>
            <h2 mat-dialog-title>
               删除店铺
            </h2>
            <mat-dialog-content>
                  <p class="mg-t-15">删除店铺后，该店铺数据会进行清除并无法恢复，请输入登录密码确认删除</p>
                  <div class=" input-group  form-group c-input-group " style="vertical-align: middle;padding-bottom:0;margin-bottom: 0">
                      <label style="margin-bottom: 0;"><span class="font-c3"> *</span>用户密码</label>
                      <input type="password" placeholder="请输入登录密码"  name="typeName"  class="mg-l-10 form-control" [(ngModel)]="password" (blur)="checkPassword()" required>
                  </div>
                   <div style="height: 1.725rem;margin-left: 99px;line-height: 1.725rem;">
                     <div class="font-c3 fz-12">
                          <div *ngIf="isEmpty">
                            密码不能为空
                         </div>
                         <div *ngIf="restResp&&restResp.code != 200">
                            {{restResp.tips}}
                         </div>
                     </div>
                   </div>
            
            </mat-dialog-content>
            <mat-dialog-actions fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
                  <zm-btn-md [stroked]="true" (click)="closeModal()" name="取消"></zm-btn-md>
                  <zm-btn-md  (click)="deleteStore()" name="确定"></zm-btn-md>
            </mat-dialog-actions>
      </div>


    <!--<div animation-modal>-->
    <!--<div class="modal-header">-->
      <!--<h4 class="modal-title">删除店铺</h4>-->
      <!--<button class="close" aria-label="Close" (click)="closeModal()">-->
        <!--<span aria-hidden="true">&times;</span>-->
      <!--</button>-->
    <!--</div>-->
    <!--<div class="modal-body">-->
          <!--<p class="mg-t-15">删除店铺后，该店铺数据会进行清除并无法恢复，请输入登录密码确认删除</p>-->
          <!--<div class=" input-group  form-group c-input-group " style="vertical-align: middle;padding-bottom:0;margin-bottom: 0">-->
              <!--<label style="margin-bottom: 0;"><span class="font-c3"> *</span>用户密码</label>-->
             <!--<input type="password" placeholder="请输入登录密码"  name="typeName"  class="mg-l-10 form-control" [(ngModel)]="password" (blur)="checkPassword()" required>-->
          <!--</div>-->
           <!--<div style="height: 1.725rem;margin-left: 99px;line-height: 1.725rem;">-->
             <!--<div class="font-c3 fz-12">-->
                  <!--<div *ngIf="isEmpty">-->
                    <!--密码不能为空-->
                 <!--</div>-->
                 <!--<div *ngIf="restResp&&restResp.code != 200">-->
                    <!--{{restResp.tips}}-->
                 <!--</div>-->
             <!--</div>-->
           <!--</div>-->
    <!--</div>-->
    <!--<div class="modal-footer">-->
     <!--<button class="btn c-md-btn-modal c-close-btn-modal" (click)="closeModal()" style="margin-right: 20px;">取消</button>-->
      <!--<button class="btn c-btn-blue c-md-btn-modal" (click)="deleteStore()">确定</button>-->
    <!--</div>-->
    <!--</div>-->
  `,
  styles:[`
    .modal-title{
      font-size: 18px;
      font-weight: bold !important;
      color: #333 !important;
    } 
    .mg-t-15{
      margin-top:15px;
    } 
    .c-input-group{
      align-items: center !important;
      .form-control{
        border-radius: 0.375rem !important;
      }
    }
    .font-c3{
      color:#FF4c6a;
    } 
    .fz-12{
      font-size: 12px;
    }
    .mg-l-10{
      margin-left:10px;
    } 
    .form-control{
      padding: 0.75rem 0.75rem;
      border: 2px solid #ced4da;
    }
    .c-md-btn-modal{
      width: 140px;
      padding: 12px 0 !important;
      outline: none;
    } 
    .c-close-btn-modal{
      border: 2px solid#03a9f4 !important;
      color:#03a9f4 !important;
      background-color: #fff;
    } 
    .c-btn-blue{
      color: #fff;
      border-color:#03a9f4 !important;
      background-color:#03a9f4 !important;
    } 
    .form-control:focus{
      box-shadow: none;
    }
  `]
})
export class DeleteStoreModalComp implements OnInit,OnDestroy{

  @Input() storeId:any;
  @Output() action:any;
  public password:string;
  public restResp:RestResp;
  public isEmpty:boolean = false;

  public service:DeleteStoreModalService;

  private activeModal: any;
  constructor(private storeMgr: StoreMgr, @Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
    this.service = new DeleteStoreModalService(this.storeMgr);
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {

  }

  closeModal() {
    this.activeModal.close();
  }

  /**
   * 删除店铺 页面点击事件
   */
  deleteStore(){
    if(!AppUtils.isNullObj(this.password)){
      this.password = AppUtils.trimBlank(this.password);
      if(!AppUtils.isNullOrWhiteSpace(this.password)){
        if(SessionUtil.getInstance().getSimpleStoreList().length > 1){
          this.service.deleteStore(this.storeId,this.password,(restResp:RestResp)=>{
            if(restResp.code == 200){
              this.action();
              this.closeModal();
            }else{
              // AppUtils.showError("提示", restResp.tips);
              this.restResp = restResp;
            }
          })
        }else{
          AppUtils.showWarn("提示", "你仅有一家店铺，无法删除");
        }
      }else{
        AppUtils.showWarn("提示", "密码不能为空");
      }
    }else{
      AppUtils.showWarn("提示", "密码不能为空");
    }
  }

  checkPassword(){
    if(AppUtils.isNullOrWhiteSpace(this.password)){
      this.isEmpty = true;
    }else{
      this.isEmpty = false;
    }
    this.restResp = undefined;
  }

}

export class DeleteStoreModalService{

  constructor(private storeMgr: StoreMgr){}

  /**
   * 删除店铺
   * @param storeId
   * @param password
   * @param callback
   */
  public deleteStore(storeId,password,callback:(restResp: RestResp)=>void){
    let storeUpdateStatusData:StoreUpdateStatusData = new StoreUpdateStatusData();
    storeUpdateStatusData.storeId = storeId;
    storeUpdateStatusData.state = StoreState.Close;
    storeUpdateStatusData.password = password;
    this.storeMgr.updateStoreStatus(storeUpdateStatusData).then((restResp)=>{
      callback(restResp);
    })
  }
}


