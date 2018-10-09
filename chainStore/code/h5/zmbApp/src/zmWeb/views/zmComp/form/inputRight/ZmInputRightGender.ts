import {Component, Input, Output, EventEmitter} from "@angular/core";
/**
 *
 <zm-input-right-gender  [(zmValue)]="viewData.formData.gender" ></zm-input-right-gender>
 */

@Component({
  selector:'zm-input-right-gender',
  template: `
             <ion-row class="input-row" align-self-center>
                <ion-col col-9 >
                     <input class="input-label text_left" value="性别" type="text" [disabled]="true"/>
                </ion-col>
                <ion-col col-3 >
                   <ion-segment style="float:right" item-end ion-text [(ngModel)]="zmValue" color="secondary">
                      <ion-segment-button value="0">
                        男
                      </ion-segment-button>
                      <ion-segment-button value="1">
                        女
                      </ion-segment-button>
                   </ion-segment>
                </ion-col>
             </ion-row>


              <!--<ion-item no-lines>-->
                  <!--<ion-label >-->
                    <!--性别-->
                  <!--</ion-label>-->
                  <!--<ion-segment item-end ion-text [(ngModel)]="zmValue" color="secondary">-->
                    <!--<ion-segment-button value="0">-->
                      <!--男-->
                    <!--</ion-segment-button>-->
                    <!--<ion-segment-button value="1">-->
                      <!--女-->
                    <!--</ion-segment-button>-->
                  <!--</ion-segment>-->
              <!--</ion-item>  -->
            `,

})

export class ZmInputRightGender{
  constructor(){
  }



  /**
   * zmValue 双向绑定 segment只能是string
   */
  private zmValueTmp:string;
  @Output() zmValueChange = new EventEmitter();

  @Input()
  get zmValue():string {
    return this.zmValueTmp;
  }
  set zmValue(val:string) {
    this.zmValueTmp = val;
    this.zmValueChange.emit(this.zmValueTmp);
  }

}


