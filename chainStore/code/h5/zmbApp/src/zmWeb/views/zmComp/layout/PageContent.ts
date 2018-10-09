import {Component, Input, EventEmitter, ViewChild, Output,} from "@angular/core";
import {Refresher} from "ionic-angular";


/**
 *


 @ViewChild(PageContent) loadRef: PageContent;
 ionViewDidEnter(){
    if(this.loadRef){
      this.loadRef.startLoad();
    }
  }
 *
 */
@Component({
  selector:'zm-page-content',
  template:
  `
      <ion-content style="margin-top: 44px;" class="animated fadeIn common-bg">
          
           <!--<ion-refresher (ionRefresh)="onPull($event)" *ngIf="!noRefresh">-->
              <!--<ion-refresher-content-->
                <!--pullingIcon="arrow-dropdown"-->
                <!--pullingText="下拉刷新"-->
                <!--refreshingSpinner="circles"-->
                <!--refreshingText="下拉刷新...">-->
              <!--</ion-refresher-content>-->
            <!--</ion-refresher>-->
      <div style="padding-bottom:53px;">
            <ng-content></ng-content>
           <div *ngIf="ftShow" style="height:44px;"></div><!--默认显示-->
      </div>    
      </ion-content>
   `,

})
export class PageContent{
    @Input() title:string;
    @Input() ftShow:boolean=true;//没有footer情况下使用，默认为显示
    @Input() noRefresh:boolean = false;

    @Output() pull2Load: EventEmitter<any> = new EventEmitter();

    constructor(){}

   @ViewChild(Refresher) refresher: Refresher;
    public startLoad(){
      this.refresher._beginRefresh();
    }

    public endLoad(){
      this.refresher.complete();
    }

    onPull(){
        this.pull2Load.emit(null);
    }

}
