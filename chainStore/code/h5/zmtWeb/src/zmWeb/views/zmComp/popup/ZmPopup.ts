
export class ZmPopup{
  public static stance: ZmPopup;
  public static Zmstance():ZmPopup{
    ZmPopup.stance = new ZmPopup();
    return ZmPopup.stance;
  }
  constructor(){}


  public PopupInit(){
  (<any>window).ZmPopup={
    Zmopen:function(title,content,callback){
        let headLine = title ? title : '提示';
        let controller = content ? content : '';
        let temp: any = `
              <div class="popup">
                      <div class="popup-title disFlex align-center">
                        <span class="flex">${headLine}</span>
                        <i class="zm-close pd-r-10 text-right fa fa-close" style="font-size:20px;cursor:pointer;color: #666666;"></i>
                      </div>
                      <div class="ZmPopup-content">
                          <p>${controller}</p>
                      <div class="disFlex align-center">
                          <label class=" mg-r-10">用户密码</label>
                          <input type="password" class="flex form-control" style="height: 48px" placeholder="请输入用户密码"   id="popupInput">
                      </div>
                      </div>
                      <div class="popup-btn-area disFlex">
                        <div class="flex text-right pd-r-20">
                          <button class="btn c-close-btn-modal mg-r-20 cur-hand" style="padding: 6px 30px">取消</button>
                           <button class="btn c-btn-blue cur-hand" style="padding: 6px 30px">确定</button></div>
                        </div>
                    </div>
                  <div class="mask"></div>
          `
        let create = document.createElement('div');
        create.className = 'pop-plu';
        create.innerHTML = temp;
        document.body.appendChild(create);
        let close = create.getElementsByClassName('zm-close')[0];
        let closeBtn = create.getElementsByClassName(' c-close-btn-modal')[0];
        let confirm = create.getElementsByClassName('c-btn-blue')[0];
        let vaInput = document.getElementById("popupInput");

         closeBtn['onclick'] = close['onclick']= this.close;
              confirm['onclick'] = () =>{
                callback(vaInput['value'] );
                this.close();
              }
      },
          close:function(){
            let remove = document.getElementsByClassName('pop-plu')[0];
            document.body.removeChild(remove);
          }
        }
      }
  }
