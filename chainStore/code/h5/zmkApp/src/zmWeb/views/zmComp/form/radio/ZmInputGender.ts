import {Component, Input, Output, EventEmitter} from "@angular/core";
/**
 *
 <zm-input-gender  [(zmValue)]="viewData.formData.gender" ></zm-input-gender>
 */

@Component({
  selector:'zm-input-gender',
  template: `
              <ion-item no-lines>
                  <ion-label >
                    性别
                  </ion-label>
                  <ion-segment item-end ion-text [(ngModel)]="zmValue" color="secondary">
                    <ion-segment-button value="0">
                      男
                    </ion-segment-button>
                    <ion-segment-button value="1">
                      女
                    </ion-segment-button>
                  </ion-segment>
              </ion-item>  
                <!--<div class="disFlex align-center">-->
                  <!--<label class="c-input-label">性别</label>-->
                  <!--<zm-input-radio  [radioList]="genderList" [(curValue)]="zmValue"></zm-input-radio>-->
                <!--</div>-->
                <!--<div class="c-input-error">-->
                <!--</div>-->
            `,

})

export class ZmInputGender{
  constructor(){}

  /**
   * zmValue 双向绑定
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


