import {LoadingController, Loading} from "ionic-angular";
export class LoadingCtrl{

  private loading:Loading;

  constructor(private loadingCtrl: LoadingController){
    this.loading = this.loadingCtrl.create();
  }

  showLoading(loadingIsOpen:boolean): void {
    if (!loadingIsOpen) {
      this.loading = this.loadingCtrl.create({
        content:'loading...'
      });
      this.loading.present();
      setTimeout(() => { //最长显示10秒
        loadingIsOpen && this.loading.dismiss();
      }, 3000);
    }
  };

  /**
   * 关闭loading
   */
  hideLoading(loadingIsOpen): void {
    loadingIsOpen && this.loading.dismiss();
  };
}
