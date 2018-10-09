
import 'style-loader!angular2-toaster/toaster.css';


export class ZmToasterCfg {

}

export class Toaster {

  constructor() {
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

  }

}
