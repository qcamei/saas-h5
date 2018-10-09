/**

 */
import {Component, OnInit, Input, TemplateRef, } from "@angular/core";

@Component({
  selector:'zm-list-infinit',
  template: `
           <ion-list>
             <!--<ng-container  *ngFor="let item of list" *ngTemplateOutlet="itemTemplate;context:item"></ng-container>-->
             <ng-container  *ngFor="let item of list"></ng-container>
           </ion-list>
          
           <ion-infinite-scroll (ionInfinite)="doLoad($event)">
             <ion-infinite-scroll-content></ion-infinite-scroll-content>
           </ion-infinite-scroll>      
            
          `,
})


export class ZmListInfinit implements OnInit {

  list:Array<any> = new Array<any>();
  @Input() itemTemplate: TemplateRef<any>;

  //(pageNo):Array<any> =>{}
  @Input() loadFunc;Any;

  constructor(){
  }

  ngOnInit():void{
    this.initLoad();
  }

  private pageNo:number = 1;

  // private async doLoad(infiniteScroll){
  //   let targetList:Array<any> = await this.loadFunc(this.pageNo);
  //   let zmList = this;
  //   if(targetList!=null && targetList.length > 0){
  //     zmList.pageNo++;
  //     targetList.forEach((itemTmp)=>{
  //       zmList.list.push(ItemWraper.newWraper(itemTmp));
  //     })
  //   }
  //   infiniteScroll.complete();
  // }

  private async initLoad(){
    let targetList:Array<any> = await this.loadFunc(this.pageNo);
    let zmList = this;
    if(targetList!=null && targetList.length > 0){
      zmList.pageNo++;
      targetList.forEach((itemTmp)=>{
        zmList.list.push(ItemWraper.newWraper(itemTmp));
      })
    }
  }
}

class ItemWraper{
  target:any;

  public static newWraper(item:any):any{
    let wraper = new ItemWraper();
    wraper.target = item;
    return wraper
  }
}

