import {BUserMessageUpdateStatusForm} from "./BUserMessageUpdateStatusForm";
import {BUserMessageBatchUpdateStatusForm} from "./BUserMessageBatchUpdateStatusForm";

export class BUserMessageUpdateForm {
    constructor(){}
    updateType:number;
    updateStatusData:BUserMessageUpdateStatusForm;
    batchUpdateStatusForm:BUserMessageBatchUpdateStatusForm;
}
