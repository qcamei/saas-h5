import {SellProductAllotForm} from "./SellProductAllotForm";
import {SellProductBatchAllotForm} from "./SellProductBatchAllotForm";
import {SellProductUpdateStateForm} from "./SellProductUpdateStateForm";
import {SellProductBatchUpdateStateForm} from "./SellProductBatchUpdateStateForm";
export class SellProductUpdateApiForm {
    constructor(){}
    updateType:number;
    allotSellProductForm:SellProductAllotForm;
    batchAllotSellProductForm:SellProductBatchAllotForm;
    updateStateForm:SellProductUpdateStateForm;
    batchUpdateStateForm:SellProductBatchUpdateStateForm;
}
