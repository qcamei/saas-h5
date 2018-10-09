import {GoodsAddForm} from "./GoodsAddForm";
import {GoodsRemoveForm} from "./GoodsRemoveForm";
import {GoodsUpdateForm} from "./GoodsUpdateForm";
import {GoodsTypeAddForm} from "./GoodsTypeAddForm";
import {GoodsTypeRemoveForm} from "./GoodsTypeRemoveForm";
import {GoodsTypeUpdateForm} from "./GoodsTypeUpdateForm";
import {GoodsAddToTopForm} from "./GoodsAddToTopForm";
import {GoodsCancelTopForm} from "./GoodsCancelTopForm";
import {GoodsUpdateStateForm} from "./GoodsUpdateStateForm";
import {GoodsBatchUpdateStateForm} from "./GoodsBatchUpdateStateForm";
import {ExcelGoods} from "../../excel/apiData/ExcelGoods";
import {GoodsTmp} from "../data/GoodsTmp";
import {GoodsBatchCancelForm} from "./GoodsBatchCancelForm";
import {GoodsBatchPullForm} from "./GoodsBatchPullForm";
import {GoodsCancelForm} from "./GoodsCancelForm";
import {GoodsPullForm} from "./GoodsPullForm";

export class StoreGoodsUpdateForm {
  updateType: number;

  goodsAddForm: GoodsAddForm;
  addListFromExcel: Array<ExcelGoods>;
  addListFromStore: Array<GoodsTmp>;
  goodsRemoveForm: GoodsRemoveForm;
  goodsUpdateForm: GoodsUpdateForm;

  goodsTypeAddForm: GoodsTypeAddForm;
  goodsTypeRemoveForm: GoodsTypeRemoveForm;
  goodsTypeUpdateForm: GoodsTypeUpdateForm;

  goodsAddToTopForm: GoodsAddToTopForm;
  goodsCancelTopForm: GoodsCancelTopForm;

  goodsUpdateStateForm: GoodsUpdateStateForm;
  goodsBatchUpdateStateForm: GoodsBatchUpdateStateForm;

  goodsBatchCancelForm:GoodsBatchCancelForm;
  goodsBatchPullForm:GoodsBatchPullForm;
  goodsCancelForm:GoodsCancelForm;
  goodsPullForm:GoodsPullForm;

  constructor() {
  }
}

