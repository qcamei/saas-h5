import {Component, Input, OnInit} from "@angular/core";
import {Constants} from "../../common/Util/Constants";
import { AppCfg} from "../../../comModule/AppCfg";
import {ImportTypeEnum} from "../enum/ImportType";

/**下载模板组件**/

@Component({
  selector:"download_comp",
  template:`
   
      <div class="disFlex align-center ">
        <div class="leadcontent">
            <div class="leadhead pos-r">
              <img src="assets/images/setting/download.png" alt="" class="pos-a" style="top:-45px;left: calc(50% - 45px)">
              <span class="mg-r-10 leadspan">1</span>
              <span class="fz-12 font-c6">下载{{section}}导入模板</span>
            </div>
            <div class="leadfoot">
              <p>下载{{section}}导入模板文件</p>
              <p>按照格式进行填写</p>
              <a :href="{{downLoadPath}}" style="color: #fff">
                <button class="c-btn-blue cur-hand">点击下载</button>
              </a>
            </div>
        </div>
      </div>
 
  `,
  styleUrls:['./settingComp.scss']
})
export class DownLoadComp implements OnInit{
  @Input() section:string;
  @Input() type:number;
  public downLoadPath:string;

  ngOnInit(){
    if(this.type == ImportTypeEnum.GOODS){
      this.downLoadPath = AppCfg.getInstance().getImgPreUrl()+Constants.GOODS_EXCEL_TEMPLATE;

    }else if(this.type == ImportTypeEnum.PRODUCT){
      this.downLoadPath = AppCfg.getInstance().getImgPreUrl()+Constants.PRODUCT_EXCEL_TEMPLATE;

    }else if(this.type == ImportTypeEnum.LEAGUER){
      this.downLoadPath = AppCfg.getInstance().getImgPreUrl()+Constants.LEAGUER_EXCEL_TEMPLATE;
    }

  }
}
