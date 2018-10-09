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
    		open:function(title,content,callback){
    			let t = title?title:'提示';
    			let c = content?content:'';
    			let temp:any =
    			`	
    				<div class="popup">
    					<div class="popup-title disFlex align-center">
    						<span class="flex">${t}</span>
    						<i class="nb-close pd-r-10 text-right" style="font-size:26px;cursor:pointer;"></i>
    					</div>
    					<div class="popup-content">
							${c}
    					</div>
    					<div class="popup-btn-area disFlex">
	    					<div class="flex text-right pd-r-20">
	    						<button class="cancel-btn">取消</button>
	    					</div>
    						<div class="flex text-left pd-l-20">
    						<button class="confirm-btn">确定</button></div>
    						</div>
    				</div>
					<div class="mask"></div>
    			`
    			let z = document.createElement('div');
    			z.className = 'pop-plu';
    			z.innerHTML = temp;
    			document.body.appendChild(z);
    			let closeBtn = z.getElementsByClassName('nb-close')[0];
    			let mask = z.getElementsByClassName('mask')[0];
    			let cancelBtn = z.getElementsByClassName('cancel-btn')[0];
    			let confirmBtn = z.getElementsByClassName('confirm-btn')[0];
    			closeBtn['onclick'] = mask['onclick'] = cancelBtn['onclick'] = this.close;
    			confirmBtn['onclick'] = ()=>{
                    callback();
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

