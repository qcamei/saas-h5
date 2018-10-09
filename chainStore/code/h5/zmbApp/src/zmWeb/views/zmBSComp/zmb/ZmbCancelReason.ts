import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {CancelAppointConfig} from "../../../bsModule/storeConfig/data/appoint/CancelAppointConfig";

/**
 * <zmb-cancel-reason [reasonList]="" [(reasonId)]="" (onModelChange)="onReasonSelected($event)"></zmb-cancel-reason>
 */
@Component({
  selector: 'zmb-cancel-reason',
  template: `
    <ion-list no-lines>
      <ion-item>
        <ion-label>{{title}}</ion-label>
        <ion-select [style]="zmStyle" [(ngModel)]="reasonIdTmp" (ngModelChange)="doModelChange() " cancelText="取消" okText="确定">
          <ion-option [value]="item.id" *ngFor="let item of reasonList">{{item.reason}}</ion-option>
        </ion-select>
      </ion-item>
    </ion-list>
            `,
  styles: [`
    
    `]
})


export class ZmbCancelReason implements OnInit {


  @Input() isHidden: boolean = true; //默认隐藏
  @Input() zmStyle: string = 'visibility:hidden';

  @Output() onModelChange = new EventEmitter();

  @Input() reasonList:Array<CancelAppointConfig> = [];

  /**
   * reasonId 双向绑定
   */
  private reasonIdTmp: number = 1; //默认
  @Output() reasonIdChange = new EventEmitter();
  @Input()
  get reasonId() {
    return this.reasonIdTmp;
  }
  set reasonId(val) {
    this.reasonIdTmp = val;

    let itemTmp = this.getItemById(this.reasonId);
    this.reasonIdChange.emit(itemTmp);
  }


  doModelChange(){
    let itemTmp = this.getItemById(this.reasonId);
    this.onModelChange.emit(itemTmp);
  }

  constructor() {
  }

  ngOnInit() {
    if(this.isHidden){
      this.zmStyle = 'visibility:hidden';
    }else if(!this.isHidden){
      this.zmStyle = 'visibility:visible';
    }
  }

  getItemById(id):CancelAppointConfig{
    this.reasonList.forEach(item=>{
      if(item.id == id){
        return item;
      }
    });
    return new CancelAppointConfig();
  }


}
