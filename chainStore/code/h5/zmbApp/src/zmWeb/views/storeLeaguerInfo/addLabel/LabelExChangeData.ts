import {LeaguerLabel} from "../../../bsModule/storeLeaguerInfo/data/LeaguerLabel";

export class LabelExChangeData {

  private static instance:LabelExChangeData = new LabelExChangeData();

  public static getInstance():LabelExChangeData{
    return LabelExChangeData.instance;
  }

  private _selectedLabelList:Array<LeaguerLabel>;//选中的标签

  public getSelectedLabelList(): Array<LeaguerLabel> {
    return this._selectedLabelList;
  }

  public setSelectedLabelList(value: Array<LeaguerLabel>) {
    this._selectedLabelList = value;
  }

  public clear(){
    this._selectedLabelList = null;
  }

}
