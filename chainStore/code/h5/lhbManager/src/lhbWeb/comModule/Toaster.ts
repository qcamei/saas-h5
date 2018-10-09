import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';


export class ZmToasterCfg {
  public static top_full: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-full-width', //['toast-top-full-width', 'toast-bottom-full-width', 'toast-top-left', 'toast-top-center','toast-top-right', 'toast-bottom-right', 'toast-bottom-center', 'toast-bottom-left', 'toast-center'];
    timeout:2000,
    newestOnTop: false,
    tapToDismiss: true,
    preventDuplicates: false,
    animation: 'slideUp', //['fade', 'flyLeft', 'flyRight', 'slideDown', 'slideUp'];
    limit:1,
  });

  public static center: ToasterConfig = new ToasterConfig({
  positionClass: 'toast-top-center', //['toast-top-full-width', 'toast-bottom-full-width', 'toast-top-left', 'toast-top-center','toast-top-right', 'toast-bottom-right', 'toast-bottom-center', 'toast-bottom-left', 'toast-center'];
    timeout: 2000,
    newestOnTop: false,
    tapToDismiss: false,
    preventDuplicates: false,
    animation: 'slideUp', //['fade', 'flyLeft', 'flyRight', 'slideDown', 'slideUp'];
    limit: 1,
    showCloseButton: false,
    bodyOutputType: BodyOutputType.Default,
  });
}

export class Toaster {

  constructor(private toasterService:ToasterService) {
  }

  public showInfo(title: string, body: string){
    this.showToast('info', title, body);
  }
  public showSuccess(title: string, body: string){
    this.showToast('success', title, body);
  }

  public showWarn(title: string, body: string){
    this.showToast('warning', title, body);
  }

  public showError(title: string, body: string){
    this.showToast('error', title, body);
  }

  private showToast(type: string, title: string, body: string) {
    // config = new ToasterConfig({
    //   positionClass: this.position,
    //   timeout: this.timeout,
    //   newestOnTop: this.isNewestOnTop,
    //   tapToDismiss: this.isHideOnClick,
    //   preventDuplicates: this.isDuplicatesPrevented,
    //   animation: this.animationType,
    //   limit: this.toastsLimit,
    // });
    const toast: Toast = {
      type: type,
      title: title,
      body: body,
      // timeout: 1000,
      // showCloseButton: false,
      // bodyOutputType: BodyOutputType.Component,
    };
    this.toasterService.pop(toast);
  }

}
