import {Component, Input, Output, EventEmitter, OnInit,} from "@angular/core";
/*
    默认右边区域没有按钮   <zm-page-header [title]="'会员详情'" ></zm-page-header>
*
 * 默认右边区域有编辑按钮    <zm-page-header [operation]="true" [edit]="'编辑'" [title]="'会员详情'" (zmbBtnClick)="zmclick()"></zm-page-header>
*
* 默认右边区域有搜索按钮 和 添加按钮    <zm-page-header [operation]="true" [add]="'add'" [search]="'search'" [title]="'会员详情'" (zmbBtnClick)="zmclick()"></zm-page-header>
 *
*
 *  */


@Component({
  selector:'zm-page-header',
  template:
  `
    <ion-header>
      <ion-navbar>
        <ion-title>
          {{title}}
        </ion-title>
        <ion-buttons *ngIf="operation" end>
          <button *ngIf="search" (click)="zmbClick(0)" ion-button >
             <ion-icon [name]="search"></ion-icon>
          </button>
           <button *ngIf="add"  (click)="zmbClick(1)" ion-button >
             <ion-icon style="font-size:26px;" [name]="add"></ion-icon>
          </button>
           <button *ngIf="edit"  (click)="zmbClick(2)" ion-button >
             <span style="font-size:14px;">{{edit}}</span> 
          </button>
           <button *ngIf="share"  (click)="zmbClick(3)" ion-button >
             <ion-icon style="font-size:26px;" [name]="share"></ion-icon>
          </button>
        </ion-buttons>
      </ion-navbar>
    </ion-header>
   `,
styles:[`

`]
})
export class PageHeader{
  @Input() title:string;
  @Input() search:string;//搜索
  @Input() add:string;//加号
  @Input() edit:string;//编辑按钮
  @Input() share:string;//编辑按钮
  @Input() operation:boolean=false;//默认不显示右边编辑栏
  @Output() zmbBtnClick: EventEmitter<any> = new EventEmitter();

  constructor(){}

  zmbClick(n){
     this.zmbBtnClick.emit(n)
  }

}
