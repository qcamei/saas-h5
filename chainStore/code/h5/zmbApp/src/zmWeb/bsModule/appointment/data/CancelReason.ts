export class CancelReason {
    constructor(){}
    reason:string;
    remarks:string;

    public static newInstance(reasonP:string){
      let instance = new CancelReason();
      instance.reason = reasonP;
      return instance;
    }

}
