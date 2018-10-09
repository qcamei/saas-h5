/**
 * 适用于checkBox 添加是否选中标识
 */
export class GenericSelect<T>{
  public target:T;
  public isSelected:boolean = false;
  constructor(target:T){
    this.target = target;
  }

  public static fromList<T>(itemList:Array<T>):Array<GenericSelect<T>>{
    if(itemList){
      let listTmp = new Array<GenericSelect<T>>();
      for(let i=0;i<itemList.length;i++){
        let selectItem = new GenericSelect<T>(itemList[i]);
        listTmp.push(selectItem);
      }
      return listTmp;
    }else{
      return new Array();
    }
  }

}
