import {PackageItemData} from "../../../views/storeflow/wfComp/WFDataWraper";
export class PackagePrjRecordUpdateForm {
    constructor(){}
    packagePrjId:string;
    count:number;
    oldPrice:number;// 原价
    discount:number;
    recordType:number;// 记录类型 RecordTypeEnum

  public static fromPackageItem(item:PackageItemData):PackagePrjRecordUpdateForm{
    let packagePrjRecordAddForm = new PackagePrjRecordUpdateForm();
    packagePrjRecordAddForm.packagePrjId = item.id;
    packagePrjRecordAddForm.oldPrice = item.oldPrice;
    packagePrjRecordAddForm.count = item.count;
    packagePrjRecordAddForm.discount = item.discount;
    packagePrjRecordAddForm.recordType = item.recordType;
    return packagePrjRecordAddForm;
  }
}
