
import {Component, OnInit, OnDestroy, Input, TemplateRef, Output, EventEmitter} from "@angular/core";

/**
 * Created by sunbirdjob on 2018/2/23.
 <ng-template #targetTemplate>
 <div>this is show body</div>
 </ng-template>

 <ng-template #collapseBindTemplate let-toggle="toggle">
 <button class="btn btn-lg btn-outline-primary" (click)="toggle()">Launch modal</button>
 </ng-template>

 <zm-collapse [isCollapsed]="false" [collapseBindTemplate]="collapseBindTemplate"  [targetTemplate]="targetTemplate"></zm-collapse>
 */
@Component({
  selector:'zm-collapse',

  template: ` 
              <ng-container *ngTemplateOutlet="collapseBindTemplate;context:ctx"></ng-container>
           
              <div [ngClass]="{'collapsed': isCollapsed, 'expanded':!isCollapsed}">
                <ng-container *ngTemplateOutlet="targetTemplate;context:ctx"></ng-container>
              </div>      
    
            `,

  styles:[`
	
      /*.collapsed{max-height:0px;display:none; transition: max-height 0.5s ease-out;-webkit-transition: max-height 0.5s ease-out;overflow:hidden;padding:0 1.25rem;}*/
	    /*.expanded{display:block; transition: max-height 0.5s ease-in;  -webkit-transition: max-height 0.5s ease-in;  overflow:hidden;  padding:0 1.25rem;}*/
	    .collapsed{display:none; }
	    .expanded{display:block; }
  `],
})


export class ZmCollapse implements OnInit,OnDestroy {

  @Input() targetTemplate: TemplateRef<any>;
  @Input() collapseBindTemplate: TemplateRef<any>;


  /**
   * isCollapsed 双向绑定
   */
  private isCollapsedTmp:boolean;
  @Output() isCollapsedChange = new EventEmitter();

  @Input()
  get isCollapsed():boolean {
    return this.isCollapsedTmp;
  }
  set isCollapsed(val:boolean) {

    this.isCollapsedTmp = val;
    this.isCollapsedChange.emit(this.isCollapsedTmp);

  }

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



