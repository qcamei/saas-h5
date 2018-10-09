import {MgrPool} from "../../../comModule/MgrPool";
import {MatDialog} from "@angular/material";


export class ZmModalMgr{

  public static getInstance():ZmModalMgr{
    // return MgrPool.getInstance().get(ZmModalMgr);
    return MgrPool.getInstance().get("ZmModalMgr",ZmModalMgr);
  }
  public static newInstance(matDialog: MatDialog):ZmModalMgr{
    let target = new ZmModalMgr();
    target.modalService = matDialog;
    return target;
  }

  public reset(matDialog: MatDialog){
    this.modalService = matDialog;
  }
  private modalService: MatDialog;


  public newSmallModal(popupComp:any,modalData:any,callBack:any):any{

    this.modalService.closeAll();
    let modalCtrl = new ZmModalCtrl();
    let dataTmp = {modalData: modalData, callBack: callBack, modalCtrl:modalCtrl};
    const modalRef = this.modalService.open(popupComp, {
      height: 'auto',
      width: '30%',
      data: dataTmp
    });

    modalCtrl.setModalRef(modalRef);
    return modalRef;
  }


  public newModal(popupComp:any,modalData?:any,callBack?:any):any{

    this.modalService.closeAll();
    let modalCtrl = new ZmModalCtrl();
    let dataTmp = {modalData: modalData, callBack: callBack, modalCtrl:modalCtrl};
    const modalRef = this.modalService.open(popupComp, {
      height: 'auto',
      width: '50%',
      data: dataTmp
    });

    modalCtrl.setModalRef(modalRef);
    return modalRef;
  }

  public newLgModal(popupComp:any,modalData:any,callBack:any):any{

    let modalCtrl = new ZmModalCtrl();
    let dataTmp = {modalData: modalData, callBack: callBack, modalCtrl:modalCtrl};
    const modalRef = this.modalService.open(popupComp, {
      height: 'auto',
      width: '80%',
      data: dataTmp
    });

    modalCtrl.setModalRef(modalRef);
    return modalRef;
  }

  /**
   * 适用需显示调用关闭的弹窗
   * @param popupComp
   * @param modalData
   * @param callBack
   * @returns {any}
   */
  public newStaticSmallModal(popupComp:any,modalData?:any,callBack?:any):any{
    this.modalService.closeAll();
    let modalCtrl = new ZmModalCtrl();
    let dataTmp = {modalData: modalData, callBack: callBack, modalCtrl:modalCtrl};
    const modalRef = this.modalService.open(popupComp, {
      height: 'auto',
      width: '30%',
      disableClose:true,
      data: dataTmp
    });

    modalCtrl.setModalRef(modalRef);
    return modalRef;
  }

}

export class ZmModalCtrl{

  private modalRef;

  public setModalRef(modalRefP:any){
    this.modalRef = modalRefP;
  }

  public close(){
    this.modalRef.close();
  }

}
