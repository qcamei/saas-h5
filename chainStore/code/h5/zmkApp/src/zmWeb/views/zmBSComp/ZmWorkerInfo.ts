
import {Component, OnInit, Input} from "@angular/core";

/**
 * e.g
 <zm-worker-info name="佟丽娅" imgSrc="assets/test/tly_1.jpg" phone="13892344321"></zm-worker-info>
 */
@Component({
  selector:'zm-worker-info',
  template: `

        <ion-card>
            <button ion-item detail-push (click)="openDetail()">
              <ion-avatar item-start>
                <img [src]="imgSrc">
              </ion-avatar>
               <ion-row>
                  <ion-col> 
                        <p class="ptext_left" style="font-weight: bold;font-size: 14px;">{{name}}<ion-icon [ngClass]="{'female':isFemale,'male':!isFemale}" [name]="genderIconName"></ion-icon></p>
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
          
          </ion-card>
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


export class ZmWorkerInfo implements OnInit {

  @Input() imgSrc:string;
  @Input() name:string;
  @Input() phone:string;
  @Input() infoRT:string;
  @Input() infoRB:string;
  @Input() gender:number;

  isFemale:boolean;
  genderIconName:string;
  constructor(){ }

  ngOnInit():void{
    if(!this.imgSrc){
      this.imgSrc = "assets/icon/people_circle.svg";
    }
    this.isFemale = this.gender==0;
    this.genderIconName = this.gender==0?"zm-female":"zm-male";
  }

  openDetail(){

  }

}



