import {GoodsAddForm} from "./GoodsAddForm";
import {GoodsRemoveForm} from "./GoodsRemoveForm";
import {GoodsUpdateForm} from "./GoodsUpdateForm";
import {GoodsUpdateStateForm} from "./GoodsUpdateStateForm";
import {GoodsBatchUpdateStateForm} from "./GoodsBatchUpdateStateForm";
import {GoodsTypeAddForm} from "./GoodsTypeAddForm";
import {GoodsTypeRemoveForm} from "./GoodsTypeRemoveForm";
import {GoodsTypeUpdateForm} from "./GoodsTypeUpdateForm";
import {GoodsAllotForm} from "./GoodsAllotForm";
import {GoodsBatchAllotForm} from "./GoodsBatchAllotForm";
export class ChainGoodsUpdateForm {
    constructor(){}
    updateType:number;
    goodsAddForm:GoodsAddForm;
    goodsRemoveForm:GoodsRemoveForm;
    goodsUpdateForm:GoodsUpdateForm;
    goodsUpdateStateForm:GoodsUpdateStateForm;
    goodsBatchUpdateStateForm:GoodsBatchUpdateStateForm;
    goodsTypeAddForm:GoodsTypeAddForm;
    goodsTypeRemoveForm:GoodsTypeRemoveForm;
    goodsTypeUpdateForm:GoodsTypeUpdateForm;
    goodsAllotForm:GoodsAllotForm;
    goodsBatchAllotForm:GoodsBatchAllotForm;
}
