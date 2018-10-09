import {Component, Input, Output, EventEmitter} from "@angular/core";

/**
 * 图片预览公共组件
 * eg:
 * <zm-img-preview [(imgArr)]="" [showAdd] = "showAddFunc"></zm-img-preview>
 */
@Component({
  selector:'zm-img-preview',
  template:
  `	
	  <ion-item>
	    
        <ion-row>
                <ion-col col-4  *ngFor="let item of imgList">
                        <ion-icon class="remove-image" name="close-circle-outline" (click)="removeImage(imgDataItem)"></ion-icon>
                        <div class="image">
                          <img [src]="item | zmImgPath" alt=""/>
                      </div>
                </ion-col>
              
                <ion-col *ngIf = "showAddFunc" col-4 class="image-wrapper add-image-btn" (click)="showAddFunc()">
                
                      <div class="image">
                        <ion-icon name="add" color="new"></ion-icon>
                        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt=""/>
                      </div>
                </ion-col>
        </ion-row>
	</ion-item>
  `,
  styles:
  [`
	
  `]
})
export class ZmImgPreview {
  constructor(){}
  @Input() showAddFunc:any;

  /**
   * imgList 双向绑定
   */
  private imgListTmp:Array<string>;
  @Output() imgListChange = new EventEmitter();

  @Input()
  get imgList() {
    return this.imgListTmp;
  }
  set imgList(val) {
    this.imgListTmp = val;
    this.imgListChange.emit(this.imgListTmp);

  }

  removeImg(index) {
    this.imgList.splice(index, 1);
    this.imgListChange.emit(this.imgList);
  }

}
