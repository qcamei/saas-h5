import {Pipe, PipeTransform} from "@angular/core";
import {DecimalPipe} from "@angular/common";
import {Constants} from "../Util/Constants";

@Pipe({name: 'pricePipe'})
export class PricePipe implements PipeTransform {

  constructor(private decimalPipe:DecimalPipe){}

  transform(priceTmp: number){
    return this.decimalPipe.transform(priceTmp/100,Constants.PRICE_FORMAT);
  }
}
