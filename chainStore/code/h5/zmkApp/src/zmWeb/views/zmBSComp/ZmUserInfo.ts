import {Component, OnInit, Input,Output,OnDestroy,EventEmitter} from "@angular/core";

/**
 * e.g
 <zm-user-info name="佟丽娅" imgSrc="assets/test/tly_1.jpg" phone="13892344321"></zm-user-info>
 */
@Component({
  selector:'zm-user-info',
  template: `

        <!-- Nav tabs -->
          <button ion-item detail-push (click)="openDetail()">
            <ion-avatar item-start>
              <img [src]="imgSrc">
            </ion-avatar>
             <ion-row>
                <ion-col> 
                      <p class="ptext_left" style="font-weight: bold;font-size: 14px;">{{name}}<ion-icon [ngClass]="{'female':isFemale,'male':!isFemale}" name="zm-male"></ion-icon></p>
                </ion-col> 
                 <ion-col> 
                      <p class="ptext_right">{{infoRT}}</p>
                </ion-col> 
              </ion-row>  <ion-row>
                <ion-col> 
                      <p class="ptext_left" style="font-size: 10px"><ion-icon name="phone-portrait"></ion-icon>{{phone}}</p>
                </ion-col> 
                 <ion-col> 
                      <p class="ptext_right">{{infoRB}}</p>
                </ion-col> 
              </ion-row>
          </button>
            `,
  styles:[`
          .male{
              color:blue;
          }
          .female{
              color:pink;
          }
          .ptext_right{
               height: 15px;display: block;line-height: 15px;font-size: 12px;text-align:right;
          }
           .ptext_left{
               height: 15px;display: block;line-height: 15px;font-size: 12px;text-align: left;
          }
    `]
})


export class ZmUserInfo implements OnInit ,OnDestroy{


  @Input() imgSrc:string;
  @Input() name:string;
  @Input() phone:string;
  @Input() infoRT:string;
  @Input() infoRB:string;
  @Input() isFemale:boolean;
  @Output() myInfoClick: EventEmitter<any> = new EventEmitter();

  constructor(){ }

  ngOnInit():void{
    this.imgSrc = "assets/icon/people_circle.svg";
  }

  ngOnDestroy(): void {
  }

  openDetail(){

    this.myInfoClick.emit();
  }

}



