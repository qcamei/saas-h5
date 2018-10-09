

import {Component, OnInit, Input} from "@angular/core";

/**
 *
 e.g
 <zm-card [canCollapsed] = "false">
 <zm-input-right-text [title]="'选择用户'" [label]="'广州北'" [(zmValue)]="text" maxLength="30" ></zm-input-right-text>
 </zm-card>
 *
 */
@Component({
  selector:'zm-card',
  template: `

         <ng-template #targetTemplate>
              <ion-card-content>
                 <ng-content></ng-content>
              </ion-card-content>
         </ng-template>
          
        <ion-card>
            <ion-card-header *ngIf="hasHeader">
              <ion-item>
                  <ion-label>{{title}}ddd</ion-label>ddd
                  <button  color="new" (click)="btnNewClick()">新建</button>
                  <button *ngIf="canCollapsed" ion-button clear item-end (click)="isCollapsed = !isCollapsed">
                      <ion-icon *ngIf="!isCollapsed" name="arrow-up"></ion-icon>
                      <ion-icon *ngIf="isCollapsed" name="arrow-down"></ion-icon>
                  </button>
              </ion-item>
            </ion-card-header>
            <ion-card-content>
                  <zm-collapse  [(isCollapsed)]="isCollapsed" [collapseBindTemplate]="collapseBindTemplate"  [targetTemplate]="targetTemplate"></zm-collapse>
            </ion-card-content>
        </ion-card>
     
            `,
  styles:[`
    `]
})


export class ZmCard implements OnInit {

  @Input() hasHeader:boolean = true;
  @Input() title:string;
  @Input() isCollapsed:boolean = false;
  @Input() canCollapsed:boolean = false;

  constructor(){ }

  ngOnInit():void{
  }

}



