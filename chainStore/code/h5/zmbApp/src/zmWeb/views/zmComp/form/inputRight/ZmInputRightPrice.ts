import {Output, Component, EventEmitter, OnInit, OnDestroy, Input, OnChanges} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";

/**
 * 价格输入框公共组件
 * eg:
 <zm-input-right-price [label]="'￥'" [placeholder]="'请输入价格'" [(price)]="price"></zm-input-right-price>
 */
@Component({
  selector:'zm-input-right-price',
  template: `

  <ion-row class="input-row">
                <ion-col col-3 >
                     <input class="input-label text_left" value="{{label}}" type="text" [disabled]="true"/>
                </ion-col>
                <ion-col col-9 style="text-align: right">
                      <input class="input text_right" type="text" 
                              placeholder="请输入价格" [disabled]="disabled" 
                              [(ngModel)]= "zmValue" (keyup)="check($event)" (ionBlur)="check($event)"/>
                </ion-col>
              </ion-row>
              <div class="input-error">
                  <div *ngIf="!zmPass">
                      {{errorMsg}}
                  </div>
             </div>   
               <!--<ion-item>-->
                  <!--<ion-label stacked>{{label}}</ion-label>-->
                  <!--<ion-input type="number" [disabled]="disabled" placeholder="{{placeholder}}" [(ngModel)]="zmValue" (ionBlur)="priceBlur($event)"></ion-input>-->
                <!--</ion-item> -->
                <!---->
                <!--<div class="input-error">-->
                    <!--<div *ngIf="!zmPass">-->
                        <!--{{errorMsg}}-->
                    <!--</div>-->
                <!--</div>   -->

            `
})
export class ZmInputRightPrice implements OnInit,OnDestroy,OnChanges {

  @Input() label:string="价格";
  @Input() placeholder:string="请输入价格";

  /**
   * zmvalue 双向绑定
   */
  private zmValueTmp:string;
  @Output() zmValueChange = new EventEmitter();
  @Input()
  get zmValue() {
    return this.zmValueTmp;
  }
  set zmValue(val) {
    this.zmValueTmp = val;
    this.zmValueChange.emit(this.zmValueTmp);
  }

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
    // this.changePrice(changes.price.currentValue);
  }

  /**
   * 失去焦点事件
   * @param e
   */
  check(e){
    let value = e.target.value;
    if(!AppUtils.isNumber(value)){
      this.zmValue = "";
    }else{
      this.zmValueChange.emit(this.zmValue);
    }

  }

}
