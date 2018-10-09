import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector: 'zmk-store-card',
  template: `
          <ion-card class="fade-in-right-item" img-radius (click)="goDetailPage()">
            <div class="bg-img" >
                <img *ngIf="imgPath" style="width:100%;height:100%;" src="{{imgPath|zmImgPath}}">
                <div class="pos-a memName">{{name}}</div>
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
    `]
})


export class ZmkStoreCard implements OnInit {

  @Input() name:string;
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


