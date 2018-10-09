import {MgrPool} from "../../comModule/MgrPool";
import {AlertController} from "ionic-angular";

/**
 * 弹框
 */
export class AlertUtils {

  public static getInstance():AlertUtils{
    return MgrPool.getInstance().get("AlertUtils",AlertUtils);
  }
  constructor(){}

  private alertCtrl: AlertController;

  public init(alertCtrl: AlertController){
    this.alertCtrl = alertCtrl;
  }

  showOk(title:string, message:string, okFunc) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['确定']
    });
    alert.onDidDismiss(()=>{
      if(okFunc){
        okFunc();
      }
    });
    alert.present();
  }


  showConfirm(title:string, message:string, confirmFunc, cancelFunc) {

    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            if(cancelFunc){
              cancelFunc();
            }
          }
        },
        {
          text: '确定',
          handler: () => {
            if(confirmFunc){
              confirmFunc();
            }
          }
        }
      ]
    });
    alert.present();
  }

  showInputConfirm(title:string, defaultVal:string, placeholder:string, confirmFunc, cancelFunc) {

    let inputsTmp = [];
    if(defaultVal){
      inputsTmp = [
        {
          name: 'key',
          value: defaultVal,
          placeholder: placeholder
        },
      ]
    }else{
      inputsTmp = [
        {
          name: 'key',
          placeholder: placeholder
        },
      ]
    }

    let alert = this.alertCtrl.create({
      title: title,
      inputs: inputsTmp,
      buttons: [
        {
          text: '取消',
          handler: data => {
            // console.log("取消" + data);
            if(cancelFunc) {
              cancelFunc();
            }
          }
        },
        {
          text: '确定',
          handler: data => {
            if(confirmFunc) {
              confirmFunc(data.key);
            }
          }
        }
      ]
    });
    alert.present();
  }

}



