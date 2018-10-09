/**
 * Created by ZHIMEITIMES on 2018/4/20.
 */
import {Component, Output, EventEmitter, Input} from "@angular/core";

/**
 * 下拉选择select组件
 * eg: <zm-select_country (selectCallback)="changeOption($event)"></zm-select_country>
 */
@Component({
  selector: "zm-select_country",
  template: `
          <div class="text-center zm-select_country" style="height:48px;width:180px;z-index:99;position: relative;">
            <div class="cur-hand  c-input" fxLayout="row" fxLayoutAlign="center center" (click)="clickEvent();">
              <span class="menu font-c1 ">(+86)中国</span> 
              <span style="width: 20px;height: 10px;display: inline-block;"><img class="icon transform" src="assets/images/guide/guide-arrow.png" alt=""></span>
            </div>
            <ul class="hidden mt-0 pos-r text-left pd-l-0" style="z-index: 5;" >
              <li class="choice1" (click)='selectLi("(+61)澳大利亚")'><span class="number dib mg-r-5">+61</span><span class="dib">澳大利亚</span></li>
              <li class="choice1" (click)='selectLi("(+863)澳门（中国）")'><span class="number dib mg-r-5">+853</span><span class="dib">澳门（中国）</span></li>
              <li class="choice1" (click)='selectLi("(+1)加拿大")'><span class="number dib mg-r-5">+1</span><span class="dib">加拿大</span></li>
              <li class="choice1" (click)='selectLi("(+1)美国")'><span class="number dib mg-r-5">+1</span><span class="dib">美国</span></li>
              <li class="choice1" (click)='selectLi("(+886)台湾（中国）")'><span class="number dib mg-r-5">+886</span><span class="dib">台湾（中国）</span></li>
              <li class="choice1" (click)='selectLi("(+852)香港（中国）")'><span class="number dib mg-r-5">+852</span><span class="dib">香港（中国）</span></li>
              <li class="choice1" (click)='selectLi("(+64)新西兰")'><span class="number dib mg-r-5">+64</span><span class="dib">新西兰</span></li>
              <li class="choice1" (click)='selectLi("(+86)中国")'><span class="number dib mg-r-5">+86</span><span class="dib">中国</span></li>
            </ul>
          </div>
          <div class="mask none" (click)="clickmask();"></div>
  `,
  styleUrls: ['./regInput.scss']
})
export class ZmSelectCountry{

  @Output() valueChecked: EventEmitter<any> = new EventEmitter();
  // @Output() selectCallback:EventEmitter<any> = new EventEmitter<any>();

  private valueTmp: string = "+86";
  @Output() zmValueChange: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  get zmValue() {
    return this.valueTmp;
  }

  set zmValue(val) {
    this.valueTmp = val;
    this.zmValueChange.emit(this.valueTmp);
  }


  clickEvent() {
    this.popupFun();
  }
  clickmask(){
    let mask = document.getElementsByClassName("mask")[0];
    if(mask.classList.contains("show")){
      this.popupFun();
    }
  }

  selectLi(text) {
    let obj = document.getElementsByClassName("menu")[0];
    obj.innerHTML = text;
    this.clickEvent();

    let targetValue = text.match(/\+[0-9]{1,3}/);//截取区号
    this.zmValueChange.emit(targetValue[0]);
    // this.selectCallback.emit(text);
  }


  popupFun(){
    let obj = document.getElementsByTagName("ul")[0];
    let img = document.getElementsByClassName("icon")[0];
    let mask = document.getElementsByClassName("mask")[0];
    if (obj.classList.contains("hidden")) {
      obj.classList.toggle("hidden");
      img.classList.toggle("transform");
      mask.classList.remove("none");
      mask.classList.add("show");
    }else {
      obj.classList.toggle("hidden");
      img.classList.toggle("transform");
      mask.classList.remove("show");
      mask.classList.add("none");
    }
  }

}

