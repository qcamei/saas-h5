import {Component, Input, OnInit} from "@angular/core";
/**
 * 列表复选框
 * <zm-select-checkbox [(zmList)]="viewData.formData.zmList"></zm-select-checkbox>

 */

@Component({
  selector:'zm-list-checkbox',
  template: `
            <ion-item *ngFor="let item of zmList" >
               <ion-checkbox [(ngModel)]="item.checked">
               </ion-checkbox>
               <ion-label item-center>{{item.name}}</ion-label>
            </ion-item>
            `,
})

export class ZmListCheckbox implements OnInit{

  @Input() zmList:Array<any>;

  ngOnInit(){
    this.zmList = new Array();

    this.zmList.push({name:"name1"});
    this.zmList.push({name:"name2"});
    this.zmList.push({name:"name3"});
  }


}
