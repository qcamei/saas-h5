import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AppCfg} from "../../comModule/AppCfg";
import {AppUtils} from "../../comModule/AppUtils";


export class ImgMgr{

  private static instance:ImgMgr = new ImgMgr();
  public static getInstance():ImgMgr{
    return ImgMgr.instance;
  }


  public getRestProxy(){
    return AsyncRestProxy.getInstance();
  }

  constructor(){
  }

  private getImgPostBaseUrl():string{
    return AppCfg.getInstance().getServiceAddress()+"/img";
  }

  // public uploadCourseContent(files,wunitId):Promise<Array<string>>{
  //   return this.upload(files,wunitId,"courseContent");
  // }
  public getUploadUrl(wunitId:string,moduleType:string):string{
    let urlPattern = "{0}/{1}/{2}";
    let postUrl = AppUtils.format(urlPattern,this.getImgPostBaseUrl(),wunitId,moduleType);
    return postUrl;
  }

   public upload(files,wunitId:string,moduleType:string):Promise<Array<string>>{

    // let urlPattern = "{0}/{1}/{2}";
    let postUrl = this.getUploadUrl(wunitId,moduleType);

    let formData:FormData = this.makeFormData(files);

    // let target = this;
    return new Promise<Array<string>>(resolve => {
      this.getRestProxy().uploadFile(postUrl,formData).then(restResp=> {
        if(restResp.code === 200){
          let data = JSON.parse(restResp.tJson);
          resolve(data.imgPathList);
        }else{
          resolve(null);
        }
      });
    });
  }

  /**
   * 转换formData
   * @param files
   * @returns {FormData}
   */
  makeFormData(files):FormData{
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("imgs", files[i]);
    }
    return formData;
  }

}
