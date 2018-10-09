import {Component, Input, Output, EventEmitter} from "@angular/core";
/**
 *
 <zm-input-radio  [(zmValue)]="viewData.formData.checked" [label] = "label"></zm-input-radio>
 */

@Component({
  selector:'zm-input-radio',
  template: `

              <ion-item>
                  <ion-label> {{label}}</ion-label>
                  <ion-toggle [disabled]="disabled" [(ngModel)]="zmValue"></ion-toggle>
              </ion-item>

            `,

})

export class ZmInputRadio{
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


