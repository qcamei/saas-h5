import {Component, OnInit, Input} from "@angular/core";

@Component({
  selector: 'zm-card-img',
  template: `
        <ion-card img-radius  >
            <div>
              <img class="fade-in-item"  *ngIf="img" [src]="img|zmImgPath">
            </div>
            <div class="name">{{name}}</div>
            <div class="number">{{number}}</div>
        </ion-card>
            `,
  styles: [`
        .card-background {
           position: relative;
           text-align:left;
        }
        .name{
          position: absolute;
          color:white;
          font-size: 2.0em;
          top:5%;
          left:5%;
          z-index:2
        }
        .number{
          position: absolute;
          color:white;
          top:20%;
          left:5%;
          z-index:2
        }
    `]
})


export class ZmCardImg implements OnInit {
  @Input() img:string;
  @Input() name:string;
  @Input() number:string;

  constructor() {
  }

  ngOnInit(): void {
  }

}



