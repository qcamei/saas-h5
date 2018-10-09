import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector: 'zmk-store-card',
  template: `
          <ion-card class="fade-in-right-item" img-radius (click)="goDetailPage()">
            <div class="bg-img" >
                <img *ngIf="imgPath" style="width:100%;height:100%;" src="{{imgPath|zmImgPath}}">
                <div class="pos-a memName">{{name}}</div>
                <span *ngIf="status==1" class="pos-a efficacy" >已失效</span>
            </div>
            
          </ion-card>
            `,
  styles: [`
      .bg-img{
        height:80px;
        width:100%;
        position:relative;
      }
      .pos-a{
        position: absolute;
      }
      .memName{
        color:#fff;
        font-size:18px;
        top:36%;
        left:5%;
        z-index:2
      }
      .efficacy{
      right:2%;
      top:34%;
      z-index: 100;
      background:rgba(225,225,225,0.5);
      color:red;
      padding:3px 15px;
      border:1px solid red;
      border-radius:5px;
      transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      -moz-transform: rotate(15deg);
      }
    `]
})


export class ZmkStoreCard implements OnInit {

  @Input() name:string;
  @Input() status:number;
  @Input() imgPath:string;
  @Output() callback:EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {

  }

  goDetailPage(){
    this.callback.emit();
  }

}


