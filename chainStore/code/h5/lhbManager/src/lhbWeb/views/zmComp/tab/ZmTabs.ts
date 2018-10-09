/**
 * Created by sunbirdjob on 2018/2/23.
     <ng-template #tabContentTemplate let-tabName="name">
       <ng-container [ngSwitch]="tabName">
         <div  *ngSwitchCase="'tabName1'">tabName1</div>
         <div  *ngSwitchCase="'tabName2'">tabName2</div>
         <div *ngSwitchDefault>unknown</div>
       </ng-container>
     </ng-template>

     <zm_tabs  [tabContentTemplate]="tabContentTemplate" [tabNames]="'tabName1,tabName2'" [default]="'tabName2'"></zm_tabs>
 */
import {Component, OnInit, OnDestroy, Input, TemplateRef} from "@angular/core";

@Component({
  selector:'zm_tabs',
  template: `
      <div>
        <!-- Nav tabs -->
        <ul class="nav nav-tabs">
        
         <li [ngClass]="{'active':tabItem.active}" *ngFor="let tabItem of tabList" (click)="onTabSelected(tabItem.name)">
            <a>{{tabItem.name}}</a>
         </li>
        
        </ul>
      
        <!-- Tab panes -->
        <div class="tab-content">
          <ng-container *ngTemplateOutlet="tabContentTemplate;context:selectedTab">
          </ng-container>
        </div>
      
      </div>            
            `
})


export class ZmTabs implements OnInit,OnDestroy {

  @Input() tabContentTemplate: TemplateRef<any>;
  @Input() tabNames:string;
  @Input() default:string;

  tabList:Array<TabItem>;
  selectedTab:TabItem;

  constructor(){

  }

  ngOnInit():void{
    this.tabList = this.getTabItemList(this.tabNames,this.default);
    this.pickSelected();
    console.log(this.selectedTab);
  }

  private getTabItemList(tabNamesP:string,defaultTab:string):Array<TabItem>{
    let tabListTmp:Array<TabItem> = new Array<TabItem>();
    let nameArray = tabNamesP.split(",");

    let hasActive = false;
    nameArray.forEach((tabName:string) => {
      let tabTmp:TabItem = new TabItem();
      tabTmp.name = tabName;
      if(defaultTab == tabName){
        tabTmp.active = true;
        hasActive = true;
      }
      tabListTmp.push(tabTmp);
    });
    if(!hasActive){
      tabListTmp[0].active = true;
    }
    return tabListTmp;
  }

  onTabSelected(tabName:string):void{
    this.tabList.forEach((tabItemTmp:TabItem) => {
      if (tabItemTmp.name == tabName) {
        tabItemTmp.active  = true;
      }else{
        tabItemTmp.active  = false;
      }
    });
    this.pickSelected();
  }

  private pickSelected():void{

    this.tabList.forEach((tabItemTmp:TabItem) => {
      if (tabItemTmp.active) {
        this.selectedTab = tabItemTmp;
      }
    });
  }


  ngOnDestroy(): void {

  }
}

export class TabItem{
  name:string;
  active:boolean;
}

