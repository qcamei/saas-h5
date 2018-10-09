import {ValidatorFn, AbstractControl, FormControl} from "@angular/forms";
import {EventEmitter} from "@angular/core";
/**
 * Created by sunbirdjob on 2018/7/27.
 */


export class FormControlUtil{

  public static newValiator(checkFun:any,zmValueChange:EventEmitter<any>,valueChecked:EventEmitter<any>){
    let targetFun = ()=>{
      return (control: AbstractControl) => {

        if(undefined == control.value){
          return null;
        }
        zmValueChange.emit(control.value);
        let success = checkFun(control.value);
        //通知外部 value做了检查
        valueChecked.emit();
        return success?null:{'fail': {value: control.value}} ;
      };
    }
    return targetFun;
  }

}


