import {Component, Input,OnInit} from "@angular/core";
import {GalleryModal} from "ionic-gallery-modal";
import {ModalController} from "ionic-angular";
import {AppUtils} from "../../../../comModule/AppUtils";

/**
 * 图片预览公共组件
 * eg:
 * <zm-big-img-preview [(imgList)]="" ></zm-big-img-preview>
 */
@Component({
  selector:'zm-big-img-preview',
  template:
  `	
	  <ion-item>
       <ion-row>
          <ion-col *ngFor="let item of imgList;let index = index">
             <div class="image">
                 <img [src]="item" (click)="showLarger(index)">
             </div>
          </ion-col>
       </ion-row>
	</ion-item>
  `,
  styles:[`
      .image{
        width:100px;
        height:100px;
      }
   `]
})
export class ZmBigImgPreview implements OnInit{

  constructor(private modalCtrl: ModalController) {
  }

  @Input() imgList: Array<string>;

  ngOnInit(){
    if(AppUtils.isNullObj(this.imgList)){
      this.imgList = [
        "http://192.168.40.220/img/logo/goods/goodList.png",
        "http://192.168.40.220/img/logo/goods/goodList.png",
        "http://192.168.40.220/img/logo/goods/goodList.png"
      ];
    }
  }

  showLarger(index) {
    let modal = this.modalCtrl.create(GalleryModal, {
      photos: this.imgList,
      initialSlide: index
    });
    modal.present();
  }
}
