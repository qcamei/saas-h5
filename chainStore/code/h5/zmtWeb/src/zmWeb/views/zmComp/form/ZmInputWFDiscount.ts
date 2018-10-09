import {Output, Component, EventEmitter, OnInit, OnDestroy, Input, OnChanges} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";

/**
 * 折扣输入框公共组件 流程专用
 * eg:
 * <zm-input-wf-discount [label]="'折'" [placeholder]="'请输入折扣'" [(discount)]="item.discount" (discountChange)="changeDiscount($event,item)"></zm-input-wf-discount>
 */
@Component({
  selector:'zm-input-wf-discount',
  template: `

            
             <div *ngIf="editDiscount" class="disFlex pos-r" style="z-index: 2;">
              <i class="fa fa-pencil pos-a" style="color:#4678fa;left:5px;z-index: 3;top: 5px;"></i>
                 <input type="number" placeholder="{{placeholder}}" oninput="if(value<0 || value>10){value=null} else {value=value.slice(0,3)}"  style="width:100%;border:none;" class="pr-4 text-center" [(ngModel)]="discount" (blur)="discountBlur($event)">
                 <span class="pos-a" style="right:3px;">{{label}}</span>
             </div>
             <div *ngIf="!editDiscount" (click)="showDiscount()">
                 <span>-</span>
             </div>
            `,
  styles:[`
    
    input{
      background:transparent !important;
    }
    input[type=number] {
      -moz-appearance: textfield;
    }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .pos-a{
      position: absolute;
    }
    .pos-r{
      position: relative;
    }
    .disFlex {
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: -moz-box;
      display: flex;
    }
    .pd-l-20{
      padding-left:20px;
    } 
    .text-center{
      text-align: center;
    }
  `]
})
export class ZmInputWFDiscount implements OnInit,OnDestroy {

  @Input() label:string;
  @Input() placeholder:string;
  @Input() discount:number;
  @Output() discountChange = new EventEmitter();

  public editDiscount:boolean = true;

  constructor(){}

  ngOnInit():void{

  }

  ngOnDestroy(): void {

  }

  /**
   * 折扣变化回调
   * @param discountP
   */
  changeDiscount(discountP){
    if(!AppUtils.isNullObj(discountP)){
      if(discountP == 10){
        this.editDiscount = false;
      }else{
        this.editDiscount = true;
      }
      this.discount = AppUtils.roundPoint(this.discount,2);
      this.discountChange.emit(discountP);
    }
  }

  /**
   * 失去焦点事件
   * @param e
   */
  discountBlur(e){
    if(!e.target.value){
      this.discount = 10;
    }else{
      this.discount = e.target.value > 10?10:e.target.value;
      this.discount = e.target.value < 0?0:e.target.value;
    }
    this.changeDiscount(this.discount);
  }

  /**
   * 页面点击事件 显示编辑折扣input
   */
  showDiscount(){
    this.editDiscount = true;
  }

}
