import {Component, Input} from "@angular/core";
/**
 * Created by sunbirdjob on 2018/3/8.
 * 必填文本输入框
 * <zm_input_checkbox [checkboxLable]="" [checkboxValue]="false"></zm_input_checkbox>
 */

@Component({
  selector:'zm_input_checkbox',
  template: `
            <div >
                <input type="checkbox" class="c-input-checkbox"  [(ngModel)]="checkboxValue" >
                <span class="c-child-checkbox"     (click)="cheed()" >
                  <img src="assets/images/icon/checkbox.png" alt="" *ngIf="cheStyle">
                  <img src="assets/images/icon/checkboxNo.png" alt="" *ngIf="!cheStyle">
                </span>
                <span>{{checkboxLable}}</span>
            </div>
            `,
  styles:[
    `
     .c-input-checkbox{
       width: 1rem;
       height: 1rem;
       z-index: -1;
       opacity: 0;
       filter:alpha(opacity=0);/*IE*/
     }
      .c-child-checkbox{
        width: 1rem;
        height: 1rem;
        display: inline-block;
        border-radius: 2px;
      }
    `]
})

export class ZmInputCheckbox {

  @Input() checkboxValue: boolean = false;
  @Input() checkboxLable: string = "";
  public cheStyle: boolean = false;


  ngOnInit(): void {
    if (this.checkboxValue) {
      this.cheStyle = !this.cheStyle;
    } else {
      this.cheStyle = this.cheStyle;
    }
  }
  cheed():void{
    this.checkboxValue = !this.checkboxValue;
    this.cheStyle = !this.cheStyle;
  }
}
