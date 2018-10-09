import {Component, OnInit, Input,  Output, EventEmitter} from "@angular/core";

@Component({
  selector:'zm-prd-info',
  template: `

        <!-- Nav tabs -->
          <ion-item>
            <ion-thumbnail item-start>
                  <img [src]="imgSrc">
            </ion-thumbnail>
             <ion-row>
                <ion-col> 
                      <p class="ptext_left" style="font-weight: bold;font-size: 14px;">{{name}}</p>
                </ion-col> 
                 <ion-col> 
                      <p class="ptext_right">售价 {{price}}</p>
                </ion-col> 
              </ion-row>  <ion-row>
                <ion-col> 
                      <p class="ptext_left" style="font-size: 12px">{{infoRT}}</p>
                </ion-col> 
                 <ion-col> 
                      <p class="ptext_right">{{infoRB}}</p>
                </ion-col> 
              </ion-row>
               
          </ion-item>
            `,
  styles:[`
          .male{
              color:blue;
          }
          .female{
              color:pink;
          }
          .ptext_right{
               height: 15px;display: block;line-height: 15px;font-size: 12px;text-align: right;
          }
           .ptext_left{
               height: 15px;display: block;line-height: 15px;font-size: 12px;text-align: left;
          }
    `]
})


export class ZmPrdInfo implements OnInit {

  @Input() imgSrc:string;
  @Input() name:string;
  @Input() price:string;
  @Input() infoRT:string;
  @Input() infoRB:string;

  /**
   * zmvalue 双向绑定
   */
  private zmValueTmp:string;
  @Output() zmValueChange = new EventEmitter();
  @Input()
  get zmValue() {
    return this.zmValueTmp;
  }
  set zmValue(val) {
    this.zmValueTmp = val;
    this.zmValueChange.emit(this.zmValueTmp);
  }

  constructor(){ }

  ngOnInit():void{

  }

}


