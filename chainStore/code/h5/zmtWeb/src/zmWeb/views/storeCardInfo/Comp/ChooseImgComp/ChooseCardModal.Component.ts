import {Component, OnDestroy, Inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';

import {MAT_DIALOG_DATA} from "@angular/material";


/**
 * 选择图片模态框
 */


@Component({
  selector: 'ngx-modal',
  template: `

     <div animation-modal >
                <h2 mat-dialog-title>
                   选择图片
                </h2>
                <mat-dialog-content fusePerfectScrollbar>
                    <ul fxLayout="row wrap" fxLayoutAlign="space-around start" >
                   <li style="height:168px;width:300px;" class="pos-r cur-hand" *ngFor="let imageItem of imageList">
                       <img src="{{imageItem|imgPrePath}}" alt="" (click)="option($event)">
                       <img src="assets/images/face.png" class="liImg"   *ngIf="imageItem == imgUrl">
                    </li>
                  </ul>
                
                </mat-dialog-content>
                <mat-dialog-actions fxLayout="row" fxLayoutGap="20px" fxLayoutAlign="end">
                      <zm-btn-md  [stroked]="true" (click)="closeModal()" name="取消"></zm-btn-md>
                      <zm-btn-md  (click)="addImg()" name="确定"></zm-btn-md>
                </mat-dialog-actions>
          </div>

  `,
  styles: [`
      .pos-r{
        position: relative;
       }  
       .clear{
        clear: both;
       } 
       .c-btn-modal{
         width: 168px;
         padding: 12px 0 !important;
         outline: none;
         cursor: pointer;
       }
       .c-btn-blue {
         color: #fff;
         border-color:#03a9f4 !important;
         background-color:#03a9f4 !important;
       }
       .cur-hand{
        cursor:pointer;
       }
       .liImg{
        position: absolute;
        left:calc(50% - 25px);
        top:calc(50% - 25px);
       }
       .c-modal-li ul li{
         position: relative;
         width:45%;
         height:auto;
         float:left;
       }
       .c-modal-li ul li:nth-of-type(odd){
          margin:0 3.3% 3.3% 3.3%;
       }
       .c-modal-li .pos-r{
          width:100%;
       }
     
      
      
  `],
})
export class ChooseCardModal implements OnDestroy {
  public callBackSub: Subject<string> = new BehaviorSubject<string>(null);
  public imageList: string[] = [];
  public imgUrl: string;

  private activeModal;
  constructor (@Inject(MAT_DIALOG_DATA) dataInput:any) {
      this.activeModal = dataInput.modalCtrl;
  }



  ngOnDestroy() {
    this.callBackSub.unsubscribe();
  }

  closeModal() {
    this.activeModal.close();
  }

  option(e) {

    let path = e.srcElement.src;
    let arr = path.split("/");

    let tmp = [];
    for (let i = 3; i < arr.length; i++) {
      tmp.push(arr[i]);
    }
    this.imgUrl = tmp.join("/");
  }

  addImg() {
    this.callBackSub.next(this.imgUrl);
    this.closeModal();
  }

}

