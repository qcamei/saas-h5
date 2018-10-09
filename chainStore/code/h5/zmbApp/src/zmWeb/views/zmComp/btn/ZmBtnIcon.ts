
import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";


// @ 2018/3/1
// <zm-btn-icon [count]="5" title="按钮" imgSrc="imgSrc" (zmbtnClick)="click()"></zm-btn-new>
@Component({
  selector:'zm-btn-icon',
  template: `
              <div class="iconbtn" [ngClass]="{'disabled':disabled}" (click)="btnClick()">
                  <ion-badge *ngIf="count !==0" class="badge"  color="danger">{{count}}</ion-badge>
                  <div><img  class="disabled" [src]="imgSrc"/></div>
                  <div class="title">{{title}}</div>
              </div>

              `,
  styles:[`
      ion-badge {
          padding: 3px 6px !important;
          
      }
    .iconbtn{
          position:relative;
          width:50px;
          height:60px;
          margin:auto;
          text-align: center;
    }
    .badge{
    position:absolute;
    right:-3px;
    top:-10px;
    font-size:12px;
    }
    
    .iconbtn img{
          height: 32px;
          width:32px;
          margin:auto;
    }
    
    .iconbtn .title{
          height: 18px;
          padding-top:3px;
          font-size: 8px;
          text-align: center;
          color:black;
    }
     .disabled img{
         -webkit-filter: grayscale(1); /* Webkit */  
         /*filter: grey; !* IE6-9 *!    */
         filter: grayscale(1); /* W3C */  
    }
   
`]
})
export class ZmBtnIcon implements OnInit,OnDestroy {

  @Input() disabled:boolean;
  @Input() count:number=0;
  @Input() title: string = "今日预约";
  @Input() imgSrc: string = "2";
  @Output() zmbtnClick: EventEmitter<any> = new EventEmitter();

  constructor(){
  }
  ngOnInit():void{

  }
  ngOnDestroy(): void {

  }
  btnClick(){
    this.zmbtnClick.emit();
  }

}
