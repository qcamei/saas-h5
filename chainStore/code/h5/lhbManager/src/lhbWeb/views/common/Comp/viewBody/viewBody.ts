import { Component } from "@angular/core";
@Component({
  selector:'view-body-comp',
  template:
  `
    <div class="pd-all-30" style="padding-top:15px;background-color: #fff;margin-bottom: 20px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;">
        <ng-content select="content"></ng-content>  
    </div>
	  
   `
})
export class ViewBody {

}
