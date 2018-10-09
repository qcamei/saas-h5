import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: "imgUrl2Base64Pipe"})
export class ImgUrl2Base64Pipe implements PipeTransform {

  transform(imgUrl: string): string {
    return this.getBase64(imgUrl);
  }

  getBase64(imgUrl: string){//传入图片路径，返回base64
    let image = new Image();
    image.crossOrigin = '';//解决跨域问题
    image.src = imgUrl;
    let target = "";
    image.onload = () => {
      target = this.getBase64Image(image);
    };
    return target;
  }

  getBase64Image(img) {
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }

// <div id="mainTable" (click)="takeScreenShot()" style="border:10px solid #f4f4f4;margin-top: 10px">
// <span>哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽哈喽</span>
// <!--<ion-row>-->
// <!--<img id="img" src="assets/img/avatar.jpeg" style="width: 100px;height: 100px"/>-->
// <img id ="img" src="{{imgTmp}}" style="width: 100px;height: 100px " />
// <!--<img class="img" src="http://192.168.40.220/img/logo/goods/goodList.png" style="width: 100px;height: 100px"/>-->
// <!--</ion-row>-->
// </div>
// <div style="margin-top: 50px"><img src="{{canvasImg}}" /></div>

  // canvasImg: any = '';
  // // #mainTable是数据表格的id
  // takeScreenShot() {
  //   let element: any = document.querySelector("#mainTable");
  //   //要显示图片的img标签
  //   let imageTmp: any = document.querySelector('#img');
  //
  //   // 使用html2canvas插件，将数据源中的数据转换成画布。
  //   html2canvas(element).then((canvas: HTMLCanvasElement) => {
  //     // 修改生成的宽度
  //     canvas.style.width = "200px";
  //     canvas.style.color = "red";
  //     // canvas.getContext("2d").drawImage(imageTmp,0,0);
  //     console.log(canvas, "生成的画布文件");
  //     this.canvasImg = canvas.toDataURL("image/png");//将canvas转变成PNG格式
  //   });
  // }


}


