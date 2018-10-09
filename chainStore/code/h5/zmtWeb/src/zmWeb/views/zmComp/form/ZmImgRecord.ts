import {Component, Input, Output, EventEmitter} from "@angular/core";

/**
 * 跟进记录图片组件
 * eg:
 * <zm_img_record [(imgArr)]=""></zm_img_record>
 */
@Component({
  selector:'zm-img-record',
  template:
  `	
	    <div *ngIf="imgArrTmp != null" >
        <ul style="flex-wrap:wrap;">
          <li *ngFor="let item of imgArrTmp;let i = index" class="imgDiv align-center dib mg-r-20 mg-t-15 pos-r"
                      style="width:100px;height:100px;">
             <img class="cur-hand" bigImg [src]="item | imgPrePath" alt="" style="width:100%;height: 100%;"/>
             <img *ngIf="delImg" src="assets/images/icon-delete.png" class="cur-hand pos-a" style="top:-8px;right:-7px;" alt=""
                         (click)="removeImg(i)">
          </li>
        </ul>
		  </div>
  `,
  styles:
  [`
	  ul, li{
	    margin:0;
	    padding:0;
	  }
	  .dib{
      display: inline-block;
      
	  }
    .align-center {
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      -moz-box-align: center;
      align-items: center;

    }
    
    .mg-r-20{
      margin-right:20px;
    } 
    .mg-t-15{
      margin-top:15px;
    } 
    .pos-r{
      position: relative;
    }
    .pos-a{
      position: absolute;
    }
    .cur-hand{
      cursor: pointer;
    }
  `]
})
export class ZmImgRecord {

  @Input() delImg:boolean = true;

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
