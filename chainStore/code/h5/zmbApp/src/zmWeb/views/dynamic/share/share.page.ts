import {IonicPage, NavParams} from "ionic-angular";
import {Component, ChangeDetectorRef} from "@angular/core";
// import html2canvas from "html2canvas";
import {ShareViewDataMgr} from "./shareViewDataMgr";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {DynamicItem} from "../../../bsModule/dynamic/data/DynamicItem";
import {Dynamic} from "../../../bsModule/dynamic/data/Dynamic";
import {AppUtils} from "../../../comModule/AppUtils";

@IonicPage({
  name: "share",
  segment: "share"
})
@Component({
  template: `
    <zm-root-page-header></zm-root-page-header>
    <zm-page-content>
     <div id="mainTable" *ngIf="viewData" style="border:10px solid #f4f4f4;margin-top: 1px;">
        <span>{{viewData.docContent}}</span>
        <ion-row *ngFor="let img of viewData.imgPaths">
          <img [src]="img" style="width: 100px;height: 100px"/>
        </ion-row>
     </div>
      
    <div style="margin-top: 50px"><img src="{{canvasImg}}"/></div>
     
    </zm-page-content>
    
  `,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharePage {

  private service: ShareService;
  public viewData: ShareViewData;
  canvasImg:any='';
  constructor(private cdRef: ChangeDetectorRef,
              private navParams: NavParams) {
    this.service = new ShareService();

    let initData = new ShareViewData();
    ShareViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: ShareViewData) => {
      this.viewData = viewDataP;
      this.show();
      this.cdRef.markForCheck();
    });
  }

  show() {
    let element: any = document.querySelector("#mainTable");
    // 使用html2canvas插件，将数据源中的数据转换成画布。
    if (!AppUtils.isNullObj(element)) {
      // html2canvas(element, {useCORS: true}).then((canvas: HTMLCanvasElement) => {
      //   canvas.style.width = "200px";
      //   canvas.style.color = "red";
      //   console.log(canvas, "生成的画布文件");
      //   this.canvasImg = canvas.toDataURL("image/png");//将canvas转变成PNG格式
      //   console.log("this.canvasImg: "+this.canvasImg);
      // });
    }
  }


  ionViewDidEnter() {
    this.initData();
  }

  private initData() {
    let targetObj = AppRouter.getInstance().getTargetObj(this.navParams);
    this.service.initViewData(targetObj);
  }


}
export class ShareViewData {
  docContent: string;
  imgPaths: Array<string> = new Array<string>();
  dynamicItems: Array<DynamicItem> = new Array<DynamicItem>();
  qrCode: string;

  canvasImg: any = '';
}

export class ShareService {

  public initViewData(targetObj: Dynamic) {
    let viewDataTmp = new ShareViewData();
    ShareViewDataMgr.getInstance().setData(viewDataTmp);

    this.buildViewData(targetObj, (viewData: ShareViewData) => {
      this.handleViewData(viewData);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: ShareViewData) {
    ShareViewDataMgr.getInstance().setData(viewDataP);
  }

  public async buildViewData(targetObj: Dynamic, callback: (viewDataP: ShareViewData) => void) {
    let viewDataTmp = new ShareViewData();
    viewDataTmp.docContent = targetObj.docContent;
    viewDataTmp.dynamicItems = targetObj.dynamicItems;

    if (targetObj.imgPaths && targetObj.imgPaths.length > 0) {
      for (let img of targetObj.imgPaths) {
        await this.getBase64(img, (base64) => {
          console.log("base64: "+base64);
          viewDataTmp.imgPaths.push(base64);
        });
      }
    }
    this.show(viewDataTmp);
    callback(viewDataTmp);
  }


  show(viewDataTmp) {
    let element: any = document.querySelector("#mainTable");
    // 使用html2canvas插件，将数据源中的数据转换成画布。
    if (!AppUtils.isNullObj(element)) {
      // html2canvas(element, {useCORS: true}).then((canvas: HTMLCanvasElement) => {
      //   canvas.style.width = "200px";
      //   canvas.style.color = "red";
      //   console.log(canvas, "生成的画布文件");
      //   viewDataTmp.canvasImg = canvas.toDataURL("image/png");//将canvas转变成PNG格式
      //   this.handleViewData(viewDataTmp);
      // });
    }
  }


  getBase64(url, callback) {
    console.log("url: "+url);
    var canvas = document.createElement("canvas");   //创建canvas DOM元素
    var img = new Image;
    img.src = url;
    //canvas无法对跨域的图片进行操作，前端想跨域获取这张图片，用在canvas.toDataURL()上，但是服务器端可以拒绝
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      canvas.height = img.height;
      canvas.width = img.width;
      canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height); //参数可自定义
      var dataURL = canvas.toDataURL("image/png");
      console.log("dataURL: "+dataURL);
      callback.call(this, dataURL); //回掉函数获取Base64编码
      canvas = null;
    };
  }

}
