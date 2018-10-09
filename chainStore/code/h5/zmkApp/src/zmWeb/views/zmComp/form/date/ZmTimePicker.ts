import {OnInit, Component, Input, Output, EventEmitter} from "@angular/core";
import {ZmTime} from "../../../zmComUtils/DateUtils";

/**
 * 时间选择公共组件
 * eg:
 *  <zm-time [label]="'设置时间'"   [(zmValue)]="currentTime"></zm-time>
 */
@Component({
  selector:"zm-time",
  template:`
          <button ion-item style="border-bottom:1px solid #F7F5F5;">
          <ion-icon ios="ios-alarm-outline" md="md-alarm" item-start color="primary"></ion-icon>   
          <ion-label item-start><span>{{label}}</span></ion-label>

            <ion-datetime 
            cancelText="返回"
            doneText="确定"
            displayFormat="HH:mm" 
            [placeholder]="placeholder" 
            [min]="minDate" [max]="maxDate" [(ngModel)]="zmValue">
            </ion-datetime>
          </button>
      
              <!--<ion-item detail-push>
               
                <ion-label >{{label}}</ion-label>
                <ion-datetime 
                cancelText="返回"
                doneText="确定"
                displayFormat="HH时mm分" 
                [placeholder]="placeholder" 
                [min]="minDate" [max]="maxDate" [(ngModel)]="currentValue">
                </ion-datetime>
              </ion-item>
              <p>{{currentValue}}</p>-->
  `,
  styles:[`
   
  `],
})
export class ZmTimePicker implements OnInit{
  @Input() placeholder:string;
  @Input() label:string = "选择时间";
  @Input() minDate:string="2018-08-02 10:00:00".replace(' ','T')+'Z';
  @Input() maxDate:string="2020-10-31 10:00:00".replace(' ','T')+'Z';

  /**
   * zmvalue 双向绑定
   */
  private zmValueTmp:ZmTime = ZmTime.newCur();
  @Output() zmValueChange = new EventEmitter();

  @Input()
  get zmValue() {
    return this.zmValueTmp;
  }
  set zmValue(val) {
    this.zmValueTmp = val;
    this.zmValueChange.emit(this.zmValueTmp);

  };

  ngOnInit(): void {

  }
}

