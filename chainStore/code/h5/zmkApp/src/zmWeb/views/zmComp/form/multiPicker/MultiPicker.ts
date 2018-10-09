import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CityData} from "./City";


/**
 *
 e.g



 *
 */

@Component({
    selector: 'zm-city-picker',
    template: `
        <ion-item>
        
                <ion-label stacked>{{label}}</ion-label>
                <ion-multi-picker [separator]="separator" [placeholder]="placeholder"  cancelText="取消" doneText="确定"  
                           item-content [multiPickerColumns]="columns"
                          [(ngModel)] = "zmValue"></ion-multi-picker>
            </ion-item>

    `,
})

export class CityPicker {

  @Input() separator:string = "/";
  @Input() placeholder:string = "请选择城市";
  @Input() label:string = "地址";

  private cityData = CityData;
  columns:Array<SelectData>;

  /**
   * zmvalue 双向绑定
   */
  private zmValueTmp:string;
  @Output() zmValueChange = new EventEmitter();

  @Input()
  get zmValue() {
    return this.zmValueTmp;
  }
  set zmValue(val) {

    this.zmValueTmp = val;
    this.zmValueChange.emit(this.zmValueTmp);

  }

  private addCityAndCounty(provinceItem:any, city:SelectData, county:SelectData){
    for(let item of provinceItem.city){
      city.addItem(SelectItem.newItem(item.name,item.name,provinceItem.name));
      this.addCounty(item,county);

    }
  }

  private addCounty(cityItem:any, county:SelectData){
    for(let item of cityItem.districtAndCounty){
      county.addItem(SelectItem.newItem(item,item,cityItem.name))
    }
  }


  constructor(){

   let columnsTmp = new Array<SelectData>();
   let province:SelectData = SelectData.newData("col1");
   let city = SelectData.newData("col2");
   let county = SelectData.newData("col3");

   for(let item of this.cityData){
     province.addItem(SelectItem.newItem(item.name,item.name,""));
     this.addCityAndCounty(item, city, county);
   }

    columnsTmp.push(province);
    columnsTmp.push(city);
    columnsTmp.push(county);

    this.columns = columnsTmp;



   // this.simpleColumns = [
   //   {
   //     name: 'col1',
   //     options: [
   //       { text: '1', value: '1' },
   //       { text: '2', value: '2' },
   //       { text: '3', value: '3' }
   //     ]
   //   },{
   //     name: 'col2',
   //     options: [
   //       { text: '1-1', value: '1-1' },
   //       { text: '1-2', value: '1-2' },
   //       { text: '2-1', value: '2-1' },
   //       { text: '2-2', value: '2-2' },
   //       { text: '3-1', value: '3-1' }
   //     ]
   //   },{
   //     name: 'col3',
   //     options: [
   //       { text: '1-1-1', value: '1-1-1' },
   //       { text: '1-1-2', value: '1-1-2' },
   //       { text: '1-2-1', value: '1-2-1' },
   //       { text: '1-2-2', value: '1-2-2' },
   //       { text: '2-1-1', value: '2-1-1' },
   //       { text: '2-1-2', value: '2-1-2' },
   //       { text: '2-2-1', value: '2-2-1' },
   //       { text: '2-2-2', value: '2-2-2' },
   //       { text: '3-1-1', value: '3-1-1' },
   //       { text: '3-1-2', value: '3-1-2' }
   //     ]
   //   }
   // ];
 }

}

class SelectData{
  name:string;
  options:Array<SelectItem> = new Array<SelectItem>();

  public static newData(name:string):SelectData{
    let target = new SelectData();
    target.name = name;
    return target;
  }

  public addItem(item:SelectItem){
    this.options.push(item);
  }

}

class SelectItem{
  text:string;
  value:string;
  parentVal:string;

  public static newItem(text:string,value:string,parentVal:string){
      let target = new SelectItem();
      target.text = text;
      target.value = value;
      target.parentVal = parentVal;
      return target;
  }


}
