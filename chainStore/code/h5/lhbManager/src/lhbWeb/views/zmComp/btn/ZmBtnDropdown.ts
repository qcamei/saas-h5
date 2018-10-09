import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";
import {CompUtils} from "../CompUtils";
/**
 * Created by zenmind on 2018/2/23.
 * <zm_btn_dropdown [zmLabel]="lebelName" [itemList=]="dropDownItemList" (zmClick)="click(item:DropDownItem)"></zm_btn_dropdown>
 */


@Component({
  selector:'zm_btn_dropdown',
  styles: ['.active { display: block; }'],
  template: `
          <div class="dropdown">
            <button class="btn btn-default dropdown-toggle" type="button" id="{{idtmp}}" (click)="toggleShow()">
              {{zmLabel}}1212121
              <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" [attr.aria-labelledby]="idtmp" [ngClass]="{'active': isActive}">
              <li *ngFor="let item of itemList">
                  <a href="#" (click)="onClick(item)">{{item.label}}</a>              
              </li>
            </ul>
          </div>          
          `
})
export class ZmBtnDropdown implements OnInit,OnDestroy {

  idtmp:string;
  isActive:boolean=false;
  @Input() itemList:Array<DropDownItem>;
  @Input() zmLabel: string;
  @Output() zmClick: EventEmitter<DropDownItem> = new EventEmitter<DropDownItem>();

  constructor(){
    this.idtmp = "zmDropDown_"+CompUtils.getInstance().getRandomNumber(1000);

  }

  public toggleShow(): void {
    this.isActive = !this.isActive;
  }

  public onClick(itemP:DropDownItem): void {
    this.zmClick.emit(itemP);
  }
  ngOnInit():void{

  }
  ngOnDestroy(): void {

  }
}

export class DropDownItem {
  label:string;
  data:any;
}
