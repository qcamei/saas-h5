
import {IonicPage} from "ionic-angular";
import {Component, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {AddDynamicViewDataMgr} from "./addDynamicViewDataMgr";
import {DynamicAddForm} from "../../../bsModule/dynamic/apiData/DynamicAddForm";
import {WxMediaUtil} from "../../zmComUtils/WxMediaUtil";
import {AppCfg} from "../../../comModule/AppCfg";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {DynamicMgr} from "../../../bsModule/dynamic/DynamicMgr";
import {Dynamic} from "../../../bsModule/dynamic/data/Dynamic";
import {AppUtils} from "../../../comModule/AppUtils";
import {AlertUtils} from "../../zmComUtils/AlertUtils";
import {AppRouter} from "../../zmComUtils/AppRouter";
@IonicPage({
  name:"addDynamic",
  segment:"addDynamic"
})
@Component({
  template: `
    <zm-page-header title="发布动态" ></zm-page-header>
    <zm-page-content>
      <div>
          <zm-input-textarea  [(zmValue)]="viewData.addForm.docContent"></zm-input-textarea>
          <div class="cur-hand dib div-upload mt-15 ml-15" (click)="uploadImg()">+</div>
          <zm-img-preview [(imgList)]="viewData.imgArr"></zm-img-preview>
          <zm-btn-sub [name]="'发布并分享'" (zmbtnClick)="addDynamic()"></zm-btn-sub>
      </div>
     
    </zm-page-content>
    
  `,
  styles:
    [`
  .cur-hand{
    cursor: pointer;
  } 
  .dib{
    display: inline-block;
  } 
  .mt-15{
    margin-top:15px;
  }
  .ml-15{
    margin-left:15px;
  }
	.div-upload{
	  width:100px;
	  height:100px;
	  line-height:97px;
	  color:#ced4da;
	  text-align: center;
	  font-size:30px;
	  border:1px dashed #ced4da;
	}
  `],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class AddDynamicPage{

  private service: AddDynamicService;
  public viewData: AddDynamicViewData;

  constructor(private cdRef: ChangeDetectorRef) {
    this.service = new AddDynamicService();

    let initData = new AddDynamicViewData();
    AddDynamicViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: AddDynamicViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });

  }

  /**
   * 调用微信上传图片
   */
  uploadImg() {
    WxMediaUtil.getInstance().uploadImg(this.uploadImgCallback.bind(this));
  }

  /**
   * 上传图片回调
   * @param imgArr
   */
  private uploadImgCallback(imgArr: Array<string>) {
    if (imgArr && imgArr.length > 0) {
      this.viewData.addForm.imgPaths = imgArr;
      imgArr.forEach((item)=>{
        this.viewData.imgArr.push(AppCfg.getInstance().getImgPreUrl()+item);
      });
      AddDynamicViewDataMgr.getInstance().setData(this.viewData);
    }
  }

  // //分享
  // onShare(){
  //   AlertUtils.getInstance().showConfirm("","分享需要先发布动态是否立即发布?",this.addDynamic.bind(this),()=>{});
  // }

  addDynamic(){
    if(AppUtils.isNullOrWhiteSpace(this.viewData.addForm.docContent)
      && !AppUtils.isNotNullObjs(this.viewData.addForm.imgPaths,this.viewData.addForm.dynamicItems)) {
      AppUtils.showWarn("提示","请填写动态内容");
      return;
    }
    let addForm = this.viewData.addForm;
    addForm.buserId = SessionUtil.getInstance().getUserId();
    addForm.storeId = SessionUtil.getInstance().getStoreId();
    DynamicMgr.getInstance().addDynamic(addForm).then((dynamic:Dynamic)=>{
       if(!AppUtils.isNullObj(dynamic)){
         AppUtils.showSuccess("提示","发布成功");
         dynamic.imgPaths.push("https://www.zhimeitimes.com/img/logo/goods/goodList.png");
         // dynamic.imgPaths.push("assets/img/avatar.jpeg");
         AppRouter.getInstance().goSharePage(dynamic);
       }else{
         AppUtils.showError("提示","发布失败");
       }
    });
  }

}
export class AddDynamicViewData{
  addForm:DynamicAddForm = new DynamicAddForm();
  imgArr:Array<string>;
}

export class AddDynamicService{

}
