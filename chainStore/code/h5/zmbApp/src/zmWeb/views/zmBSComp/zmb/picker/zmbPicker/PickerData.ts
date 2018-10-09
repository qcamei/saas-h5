/**
 * picker数据
 */
export const PICKER_DEFAULT_DATA_LIST = [
    {
      "value":"1",
      "text":"原因1",
      "children":[]
    },
    {
      "value":"2",
      "text":"原因2",
      "children":[]
    },
    {
      "value":"3",
      "text":"原因3",
      "children":[]
    },
    {
      "value":"4",
      "text":"其它",
      "children":[]
    }
];

export class PickerDataItem{
  value:string;
  text:string;

  public static newInstance(valueP:string, textP:string){
    let instance = new PickerDataItem();
    instance.value = valueP;
    instance.text = textP;
    return instance;
  }
}
