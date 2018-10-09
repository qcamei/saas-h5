/**
 * Created by sunbirdjob on 2018/2/23.
     <ng-template #tabContentTemplate let-tabName="name">
       <ng-container [ngSwitch]="tabName">
         <div  *ngSwitchCase="'tabName1'">tabName1</div>
         <div  *ngSwitchCase="'tabName2'">tabName2</div>
         <div *ngSwitchDefault>unknown</div>
       </ng-container>
     </ng-template>

     <zm-tabs  [tabContentTemplate]="tabContentTemplate" [tabNames]="'tabName1,tabName2'" [default]="'tabName2'"></zm-tabs>
 */
import {Component,Input, TemplateRef, Output, EventEmitter} from "@angular/core";


/**
 <ng-template #tabA></ng-template>
 <ng-template #tabB></ng-template>

 <zm-mat-tabs  [tabTemplateList]="[tabA,tabB]" [tabNameList]="['员工列表','审核名单']" [selectedIndex]="1"></zm-mat-tabs>
 */
@Component({
  selector:'zm-mat-tabs',
  template: `

      <mat-tab-group [(selectedIndex)] = "selectedIndex" (selectedTabChange)="onSelectChannge($event)">
      
        <ng-container *ngFor="let nameItem of tabNameList; let i = index">
        
          <mat-tab [label]="nameItem"> 
            <ng-container *ngTemplateOutlet="tabTemplateList[i]"></ng-container>   
          </mat-tab>
        
        </ng-container>
      
      </mat-tab-group>

            `,
  styles:[`
  `]
})


export class ZmMatTabs{

  @Input() tabTemplateList: Array<TemplateRef<any>>;
  @Input() tabNameList:string;
  @Input() selectedIndex:number;
  @Output() onSelect = new EventEmitter();

  constructor(){

  }

  onSelectChannge(event){
    this.onSelect.emit(event);
  }
}


