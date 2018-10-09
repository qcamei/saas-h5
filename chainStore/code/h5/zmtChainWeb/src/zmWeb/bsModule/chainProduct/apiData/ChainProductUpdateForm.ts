import {AddProductInfoData} from "./AddProductInfoData";
import {UpdateProductInfoData} from "./UpdateProductInfoData";
import {RemoveProductInfoData} from "./RemoveProductInfoData";
import {UpdateProductStateData} from "./UpdateProductStateData";
import {BatchUpdateProductStateData} from "./BatchUpdateProductStateData";
import {AddProductTypeData} from "./AddProductTypeData";
import {UpdateProductTypeData} from "./UpdateProductTypeData";
import {RemoveProductTypeData} from "./RemoveProductTypeData";
import {ProductBatchAllotForm} from "./ProductBatchAllotForm";
import {ProductAllotForm} from "./ProductAllotForm";
export class ChainProductUpdateForm {
    constructor(){}
    updateType:number;
    addProductInfoData:AddProductInfoData;
    updateProductInfoData:UpdateProductInfoData;
    removeProductInfoData:RemoveProductInfoData;
    updateProductStateData:UpdateProductStateData;
    batchUpdateProductStateData:BatchUpdateProductStateData;

    addProductTypeData:AddProductTypeData;
    updateProductTypeData:UpdateProductTypeData;
    removeProductTypeData:RemoveProductTypeData;

    productAllotForm:ProductAllotForm;
    productBatchAllotForm:ProductBatchAllotForm;
}
