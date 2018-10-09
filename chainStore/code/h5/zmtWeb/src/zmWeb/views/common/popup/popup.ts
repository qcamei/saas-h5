export class Popup {
  public static Instance: Popup;

  public static getInstance():Popup{
    Popup.Instance = new Popup();
    return Popup.Instance;
  }

  constructor(){
  }

  public init(){
    (<any>window).Popup = {
      open:function(title,content,confirmCallback,cancelCallback){
        let t = title?title:'提示';
        let c = content?content:'';
        let temp:any =
          `	
    				<div class="popup" style="position: fixed; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); -moz-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%); background: #fff; background: #fff; z-index: 9999; width: 450px; -moz-border-radius: 8px; border-radius: 8px;">
    					<div class="popup-title disFlex text-center" style="height: 60px;padding-left: 10px;line-height: 60px;font-size: 18px;font-weight: bold; display: -webkit-box;display: -ms-flexbox;display: -webkit-flex;display: -moz-box;display: flex;text-align:center;">
    						<span class="flex align-center" style=" -webkit-box-flex: 1; -ms-flex: 1; -webkit-flex: 1; -moz-box-flex: 1; flex: 1; -webkit-box-align: center; -ms-flex-align: center; -webkit-align-items: center; -moz-box-align: center; align-items: center;">${t}</span>
    						<i class="nb-close pd-r-10 text-right" style="padding-right:10px; text-align: right; font-size:26px;cursor:pointer;"></i>
    					</div>
    					<div class="popup-content" style="border-top: 1px solid #EBEEF2; border-bottom: 1px solid #EBEEF2; padding: 20px 10px; text-align: center; word-break: break-all;">
							${c}
    					</div>
    					<div class="popup-btn-area disFlex" style="height: 70px; display: -webkit-box; display: -ms-flexbox; display: -webkit-flex; display: -moz-box; display: flex; -webkit-box-align: center; -ms-flex-align: center; -webkit-align-items: center; -moz-box-align: center; align-items: center;">
	    					<div class="flex text-right pd-r-20" style=" -webkit-box-flex: 1; -ms-flex: 1; -webkit-flex: 1; -moz-box-flex: 1; flex: 1; text-align: right; padding-right: 20px;">
	    						<button class="cancel-btn" style="background: #fff; border: 2px solid#03a9f4; color:#03a9f4; width: 168px; line-height: 48px; -moz-border-radius: 8px; border-radius: 8px; cursor: pointer;">取消</button>
	    					</div>
    						<div class="flex text-left pd-l-20" style=" -webkit-box-flex: 1; -ms-flex: 1; -webkit-flex: 1; -moz-box-flex: 1; flex: 1; text-align: right; padding-right: 20px;">
    						<button class="confirm-btn" style="background:#03a9f4; border: 2px solid#03a9f4; color: #fff; width: 168px; line-height: 48px; -moz-border-radius: 8px; border-radius: 8px; cursor: pointer;">确定</button></div>
    						</div>
    				</div>
					<div class="mask" style=" position: fixed; left: 0; top: 0; height: 100%; width: 100%; background: #000; opacity: .3; z-index: 9998;"></div>
    			`
        let z = document.createElement('div');
        z.className = 'pop-plu';
        z.innerHTML = temp;
        document.body.appendChild(z);
        let closeBtn = z.getElementsByClassName('nb-close')[0];
        let mask = z.getElementsByClassName('mask')[0];
        let cancelBtn = z.getElementsByClassName('cancel-btn')[0];
        let confirmBtn = z.getElementsByClassName('confirm-btn')[0];
        // closeBtn['onclick'] = mask['onclick'] = cancelBtn['onclick'] = ()=>{
        closeBtn['onclick'] = cancelBtn['onclick'] = ()=>{
          if(cancelCallback){
            cancelCallback();
          }
          this.close();
        };
        confirmBtn['onclick'] = ()=>{
          confirmCallback();
          this.close();
        }
      },
      close:function(){
        let z = document.getElementsByClassName('pop-plu')[0];
        document.body.removeChild(z);
      },
    }
  }


  public open(title,content,confirmCallback:() => void,cancelCallback?:()=>void){
    (<any>window).Popup.open(title, content,

      () => {
        confirmCallback();
      },

      () => {
          if(cancelCallback){
            cancelCallback();
          }
      })
  }


}

