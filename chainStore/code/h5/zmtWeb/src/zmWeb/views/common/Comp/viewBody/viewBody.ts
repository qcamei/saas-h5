import {Component, Input} from "@angular/core";

/**
 *

 <view-body-comp [headerArr]="['预约列表','新建预约']"></view-body-comp>
 */
@Component({
  selector:'view-body-comp',
  template:
  `
    <div class="page-layout carded fullwidth" style="padding-bottom:20px;">

          <!-- TOP BACKGROUND -->
          <div class="top-bg mat-accent-bg"></div>
          <!-- / TOP BACKGROUND -->
      
          <!-- CENTER -->
          <div class="center">
      
              <!-- CONTENT HEADER -->
              <div class="mat-accent-bg pt-60" fxLayout="row" fxLayoutAlign="start center">
              </div>
              <!-- / CONTENT HEADER -->
      
              <!-- CONTENT CARD -->
              <div class="content-card mat-white-bg" style="min-height:83vh;border-radius: 6px;">
      
                  <div class="toolbar px-24 py-8" *ngIf="headerArr && headerArr.length > 0">
                      <view-header-comp [headerArr]="headerArr"></view-header-comp>
                  </div>
      
                  <!-- CONTENT -->
                  <div class="content p-24">
      
                     <ng-content></ng-content>  
      
                  </div>
                  <!-- / CONTENT -->
      
              </div>
              <!-- / CONTENT CARD -->
      
          </div>
          <!-- / CENTER -->

    </div>

    <!--<div class="pd-all-30" style="padding-top:15px;background-color: #fff;margin-bottom: 20px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;">-->
        <!--<ng-content select="content"></ng-content>  -->
    <!--</div>-->
	  
   `,
  styles:[`
   
  `]
})
export class ViewBody {
  @Input() headerArr = [];
}
