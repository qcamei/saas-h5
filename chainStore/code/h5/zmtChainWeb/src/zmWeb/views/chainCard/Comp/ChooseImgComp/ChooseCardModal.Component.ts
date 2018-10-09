import {Component, Inject} from '@angular/core';
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
                      <zm_btn_md  [stroked]="true" (click)="closeModal()" name="取消"></zm_btn_md>
                      <zm_btn_md  (click)="addImg()" name="确定"></zm_btn_md>
                </mat-dialog-actions>
          </div>

 
  `,
  styles: [`
      .pos-r{
        position: relative;
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
export class ChooseCardModal{

   callBackSub:(imgUrl) => void;
   imageList: string[] = [];
   activeModal;

   imgUrl: string;


  constructor(@Inject(MAT_DIALOG_DATA) public dataInput:any) {

    this.activeModal = dataInput.modalCtrl;
    this.imageList = dataInput.modalData.imageList;
    this.callBackSub = dataInput.callBack ;
  }

  closeModal() {
    this.activeModal.close();
    this.callBackSub(this.imgUrl);
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
    this.closeModal();
  }

}

