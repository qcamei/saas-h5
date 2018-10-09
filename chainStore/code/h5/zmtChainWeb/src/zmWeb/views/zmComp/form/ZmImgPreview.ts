import {Component, Input, Output, EventEmitter} from "@angular/core";

/**
 * 图片预览公共组件
 * eg:
 * <zm_img_preview [(imgArr)]=""></zm_img_preview>
 */
@Component({
  selector:'zm_img_preview',
  template:
  `	
	    <input type="hidden" [(ngModel)]="imgArr" />
	    <div *ngIf="imgArrTmp != null" style="width:400px;margin-left: 80px;">
        <ul style="width:400px;">
          <li *ngFor="let item of imgArrTmp;let i = index" class="imgDiv align-center dib mg-r-20 mg-t-20 pos-r"
                      style="width:100px;height:100px;" [ngStyle]="i > 2?{'margin-top':'20px'}:{'margin-top':'0'}">
             <img [src]="item | imgPrePath" alt="" style="width:100%;height: 100%;"/>
             <img src="assets/images/icon-delete.png" class="cur-hand pos-a" style="top:-8px;right:-7px;" alt=""
                         (click)="removeImg(i)">
          </li>
      </ul>
		  </div>
  `,
  styles:
  [`
	.align-center {
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    -moz-box-align: center;
    align-items: center;
  }
	.dib{
	  display: inline-block;
	} 
	.mg-r-20{
	  margin-right:20px;
	} 
	.mg-t-20{
	  margin-top:20px;
	} 
	.pos-r{
	  position: relative;
	}
	.cur-hand{
	  cursor: pointer;
	} 
	.pos-a{
	  position: absolute;
	}
  `]
})
export class ZmImgPreview {

  public imgArrTmp:Array<string> = [];
  @Output() imgArrChange = new EventEmitter();

  public imgLengthTmp:number;
  @Output() imgLengthChange = new EventEmitter();

  constructor(){}

  @Input()
  get imgArr() {
    return this.imgArrTmp;
  }
  set imgArr(val) {
    this.imgArrTmp = val;
    this.imgArrChange.emit(this.imgArrTmp);
  }

  @Input()
  get imgLength() {
    return this.imgLengthTmp;
  }
  set imgLength(val) {
    this.imgLengthTmp = val;
    this.imgLengthChange.emit(this.imgLengthTmp);
  }

  removeImg(index) {
    this.imgArrTmp.splice(index, 1);
    this.imgLengthTmp += 1 ;
    this.imgLengthChange.emit(this.imgLengthTmp);
  }



}
