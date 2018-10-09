import {ViewController} from "ionic-angular";


export class ModalCtrl{

  constructor(private viewCtrl: ViewController) {
  }

  public static newCtrl( viewCtrl: ViewController){
    return new ModalCtrl(viewCtrl);
  }

  // cancelFunc(){
  //   let target = this;
  //   return ()=>{
  //     target.viewCtrl.dismiss(null);
  //   }
  // }

  cancelFunc(data:any){
    let target = this;
    return ()=>{
      target.viewCtrl.dismiss(data);
    }
  }

  dismiss(data:any) {
    this.viewCtrl.dismiss(data);
  }


}
