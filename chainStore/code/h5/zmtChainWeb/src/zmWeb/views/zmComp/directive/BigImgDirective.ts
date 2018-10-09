import {Directive, OnInit, HostListener, ElementRef} from "@angular/core";

// <img bigImg src="{{viewData.productCard.imgPath|imgPrePath}}" height="168" width="340"/>

@Directive({
  selector: '[bigImg]'
})
export class BigImgDirective implements OnInit {

  constructor(private el: ElementRef) {

  }

  ngOnInit() {

  }


  @HostListener('click') onClick() {
    let imgSrc = this.el.nativeElement.getAttribute("src");
    let temp:any = `
        <div class="ImgPopup popup" style="position: fixed;top: 50%;left: 50%;-webkit-transform: translate(-50%, -50%);-moz-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);transform: translate(-50%, -50%);background: #fff;background: #fff;z-index: 9999;width: 450px;-moz-border-radius: 8px;border-radius: 8px; width:600px;height:600px;line-height:600px;text-align: center;border-radius: 0;">
          <img src=${imgSrc} style="max-width: 100%; max-height: 100%;">
        </div>
        <div class="mask" style="position: fixed; left: 0; top: 0; height: 100%; width: 100%; background: #000; opacity: .3; z-index: 9998;"></div>
    `;

    let z = document.createElement('div');
    z.className = 'bigImg';
    z.innerHTML = temp;
    document.body.appendChild(z);
    document.body.style.overflow = 'hidden';

    let mask = z.getElementsByClassName('mask')[0];
    let popup = z.getElementsByClassName('ImgPopup')[0];
    mask['onclick'] = popup['onclick'] = ()=>{
      let z = document.getElementsByClassName('bigImg')[0];
      document.body.removeChild(z);
      document.body.style.overflow = 'auto';
    }


  }

  // close() {
  //   let z = document.getElementsByClassName('pop-plu')[0];
  //   document.body.removeChild(z);
  // }

}
