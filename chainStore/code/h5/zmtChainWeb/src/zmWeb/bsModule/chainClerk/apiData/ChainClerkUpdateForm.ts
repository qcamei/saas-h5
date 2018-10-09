import {AdminRoleAddForm} from "./AdminRoleAddForm";
import {AdminRoleUpdateForm} from "./AdminRoleUpdateForm";
import {AdminRoleRemoveForm} from "./AdminRoleRemoveForm";
import {ClerkRoleSaveForm} from "./ClerkRoleSaveForm";
import {ChainClerkAddForm} from "./ChainClerkAddForm";
import {ChainClerkReomveForm} from "./ChainClerkReomveForm";
import {ChainClerkUpdateInfoForm} from "./ChainClerkUpdateInfoForm";
import {ChainAllotStoreForm} from "./ChainAllotStoreForm";
import {ChainBatchAllotStoreForm} from "./ChainBatchAllotStoreForm";
export class ChainClerkUpdateForm {
    constructor(){}
    updateType:number;
    chainId:number;
    adminRoleAddForm:AdminRoleAddForm;
    adminRoleUpdateForm:AdminRoleUpdateForm;
    adminRoleRemoveForm:AdminRoleRemoveForm;

    clerkRoleSaveForm:ClerkRoleSaveForm;
    chainClerkAddForm:ChainClerkAddForm;
    chainClerkReomveForm:ChainClerkReomveForm;

   chainClerkUpdateInfoForm:ChainClerkUpdateInfoForm;
   chainAllotStoreForm:ChainAllotStoreForm;
   chainBatchAllotStoreForm:ChainBatchAllotStoreForm;
}
