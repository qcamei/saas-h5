import {NotifyService} from "ngx-notify";

export class Notify {

  constructor(private notifyService:NotifyService) {
  }

  public showSuccess(title: string, body: string){
    this.notifyService.success(title, body);
  }
  public showInfo(title: string, body: string){
    this.notifyService.info(title, body);
  }

  public showWarn(title: string, body: string){
    this.notifyService.info(title, body,{
      timeout:2000,
      className: 'my-notify2',
      html: ` <div class="notify-title">{title}</div>
              <div class="notify-content">{content}</div>
              <div style="text-align:center;" class="notify-icon"><img style="width:50%;margin-top:30px;" src="assets/images/icon/gantanhao2.png"></div>
    `
    });
  }

  public showError(title: string, body: string){
    this.notifyService.error(title,body);
  }

}
