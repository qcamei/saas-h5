/**
 * Created by sunbirdjob on 2018/2/23.
 <ng-template #targetTemplate>
 <div>this is show body</div>
 </ng-template>

 <ng-template #collapseBindTemplate let-toggle="toggle">
 <button class="btn btn-lg btn-outline-primary" (click)="toggle()">Launch modal</button>
 </ng-template>

 <zm_collapse [isCollapsed]="false" [collapseBindTemplate]="collapseBindTemplate"  [targetTemplate]="targetTemplate"></zm_collapse>
 */
import {Component, OnInit, OnDestroy, Input, TemplateRef} from "@angular/core";
import {trigger, state, style, animate,transition } from '@angular/animations';


@Component({
  selector:'zm_collapse',

  styles: ['.collapsed{max-height:0px;display:none; transition: max-height 0.5s ease-out;-webkit-transition: max-height 0.5s ease-out;overflow:hidden;padding:0 1.25rem;}' +
            '.expanded{  max-height:290px;display:block; transition: max-height 0.5s ease-in;  -webkit-transition: max-height 0.5s ease-in;  overflow:hidden;  padding:0 1.25rem;}'],

  template: ` 
              <ng-container *ngTemplateOutlet="collapseBindTemplate;context:ctx"></ng-container>
           
              <div [ngClass]="{'collapsed': isCollapsed, 'expanded':!isCollapsed}">
                <ng-container *ngTemplateOutlet="targetTemplate;context:ctx"></ng-container>
              </div>      
    
            `
})


export class ZmCollapse implements OnInit,OnDestroy {

  @Input() isCollapsed:boolean = false;
  @Input() targetTemplate: TemplateRef<any>;
  @Input() collapseBindTemplate: TemplateRef<any>;

  ctx:any;

  constructor() {
    let service = this;
    service.ctx = {};
    service.ctx.toggle = function(){
      service.isCollapsed =! service.isCollapsed;
    };
  }


  ngOnInit():void{

  }
  ngOnDestroy(): void {

  }
}



