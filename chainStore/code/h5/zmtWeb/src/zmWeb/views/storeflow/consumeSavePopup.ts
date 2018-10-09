import {Component, Output, ViewChild, ElementRef, OnInit, Renderer2, Inject} from '@angular/core';

import {Router} from "@angular/router";
import {ConsumeSaveEnum} from "./wfComp/ConsumeSaveEnum";
import {MAT_DIALOG_DATA} from "@angular/material";


@Component({
  selector: 'consume-save-popup',
  template: `
          <div animation-modal #modal>
              <div class="modal-header">
                <div style="font-size:20px;" class="font-bold">提示</div>
                <button class="close" aria-label="Close" (click)="closeModal()">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              
              <div class="modal-body">
                   <p class="text-align font-bold">是否保存已有信息？</p>    
                   <p class="text-align">保存后可在【开单列表】查看或再次编辑</p>   
          
              </div>
          
              <div class="modal-footer">
                  <button class="cancel-btn"(click)="cancel()">不保存</button>
                  <button class="confirm_btn" style="margin-left:55px;margin-right:40px;"(click)="save()">保存</button>
              </div>
          </div>
`,  styles: [`

  .font-bold{
    font-weight:bold;
  }
  .confirm_btn{

    background:#03a9f4;
    border: 2px solid#03a9f4;
    color: #fff;
    width: 168px;
    line-height: 48px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    cursor: pointer;

  }
  .cancel-btn{
    background: #fff;
    border: 2px solid#03a9f4;
    color:#03a9f4;
    width: 168px;
    line-height: 48px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    cursor: pointer;
  }
  .text-align{
      text-align:center;
  }
  .font-bold[
      font-weight:bold;
  ]
  `],
})
export class ConsumeSavePopup implements OnInit{

  @Output() action:any;
  @ViewChild('modal') modal: ElementRef;
  private activeModal:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dataInput:any,
              private renderer: Renderer2){
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit(){
    let parent = this.modal.nativeElement.parentElement.parentElement;
    this.renderer.setStyle(parent, 'margin-top', '250px');
  }

  /**
   * 取消不保存
   */
  cancel(){
    this.action(ConsumeSaveEnum.UNSAVE);
    this.activeModal.close();
  }

  /**
   * 保存
   */
  save(){
    this.action(ConsumeSaveEnum.SAVE);
    this.activeModal.close();
  }

  //取消 留在当前页面
  closeModal(){
    this.action(ConsumeSaveEnum.CANCEL);
    this.activeModal.close();
  }

 }




