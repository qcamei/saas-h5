import {Output, Component, EventEmitter, OnInit, OnDestroy, Input, OnChanges} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";

/**
 * 折扣输入框公共组件
 * eg:
 * <zm_input_discount [label]="'折'" [placeholder]="'请输入折扣'" [(discount)]="item.discount" (discountChange)="changeDiscount($event,item)"></zm_input_discount>
 */
@Component({
  selector:'zm_input_discount',
  template: `
             <i class="fa fa-pencil pos-a" style="color:#4678fa;left:5px;z-index: 3;top: 5px;"></i>
             <div *ngIf="editDiscount" class="disFlex pos-r" style="z-index: 2;">
                 <input type="number" placeholder="{{placeholder}}" autofocus  oninput="if(value<0 || value>10){value=null} else {value=value.slice(0,3)}"  style="width:100%;border:none;padding-right: 20px;" class="pd-l-20 text-center" [(ngModel)]="discount" (ngModelChange)="changeDiscount($event)" (blur)="discountBlur($event)">
                 <span class="pos-a" style="right:3px;">{{label}}</span>
             </div>
             <div *ngIf="!editDiscount" (click)="showDiscount()">
                 <span class="" style="">无折扣</span>
             </div>
            `
})
export class ZmInputDiscount implements OnInit,OnDestroy,OnChanges {

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
   * 监听输入值的变化
   * @param changes
   */
  ngOnChanges(changes){
    // console.log(changes+"aaaa");
    this.changeDiscount(changes.discount.currentValue);
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
      this.discountChange.emit(discountP);
    }
  }

  /**
   * 失去焦点事件
   * @param e
   */
  discountBlur(e){
    if(AppUtils.isNullOrWhiteSpace(e.target.value)){
      // e.target.focus();
      this.discount = 10;
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
