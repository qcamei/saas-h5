import {PipeTransform, Pipe} from "@angular/core";


/**
 * 抽取对象列表的属性，以列表的方式返回。
 */
@Pipe({name:"attrList"})
export class AttrListPipe implements PipeTransform{
  transform(inputList: Array<any>,attrName:string): Array<string> {

    let attrList = new Array<string>();
    inputList.forEach(item=>{
      attrList.push(item[attrName]);
    })
    return attrList;
  }
}
