
import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";


// @ 2018/3/1
// <zm-btn-icon title="按钮" imgSrc="imgSrc" (zmbtnClick)="click()"></zm-btn-new>
@Component({
  selector:'zm-btn-icon',
  template: `
              <div class="iconbtn" [ngClass]="{'disabled':disabled}" (click)="btnClick()">
                  <div><img  class="disabled" [src]="imgSrc"/></div>
                  <div class="title">{{title}}</div>
              </div>
              
              `,
  styles:[`

    .iconbtn{
          width:50px;
          height:50px;
          margin:auto;
          text-align: center;
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
         filter: grey; /* IE6-9 */    
         filter: grayscale(1); /* W3C */  
    }
      .disabled .title{
         color:grey;  
    }
`]
})
export class ZmBtnIcon implements OnInit,OnDestroy {

  @Input() disabled:boolean;
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
