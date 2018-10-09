import {Component, Input, Output, EventEmitter} from "@angular/core";
/**
 *
 <zm-input-right-radio  [(zmValue)]="viewData.formData.checked" [label] = "label"></zm-input-right-radio>
 */

@Component({
  selector:'zm-input-right-radio',
  template: `
              
              <ion-row class="input-row" align-self-center>
                <ion-col col-2 >
                     <input class="input-label text_left" value="{{label}}" type="text" [disabled]="true"/>
                </ion-col>
                <ion-col col-8>
                </ion-col>
                <ion-col col-2 >
                       <ion-toggle style="float:right"  [disabled]="disabled" [(ngModel)]="zmValue"></ion-toggle>
                </ion-col>
              </ion-row>

            `,

})

export class ZmInputRightRadio{
  constructor(){}

  @Input() label:string;

  /**
   * zmValue 双向绑定
   */
  private zmValueTmp:boolean;
  @Output() zmValueChange = new EventEmitter();

  @Input()
  get zmValue():boolean {
    return this.zmValueTmp;
  }
  set zmValue(val:boolean) {
    this.zmValueTmp = val;
    this.zmValueChange.emit(this.zmValueTmp);
  }

}


