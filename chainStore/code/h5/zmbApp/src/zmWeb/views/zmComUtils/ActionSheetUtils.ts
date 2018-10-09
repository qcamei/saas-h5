import {MgrPool} from "../../comModule/MgrPool";
import {ActionSheetController, ActionSheetOptions} from "ionic-angular";

export class ActionSheetUtils {

  public static getInstance():ActionSheetUtils{
    return MgrPool.getInstance().get("ActionSheetUtils",ActionSheetUtils);
  }
  constructor(){}

  private actionSheetCtrl: ActionSheetController;

  public init(alertCtrl: ActionSheetController){
    this.actionSheetCtrl = alertCtrl;
  }

  public show(options:ActionSheetOptions){
    let actionSheet = this.actionSheetCtrl.create(options);
    actionSheet.present();
  }
}



