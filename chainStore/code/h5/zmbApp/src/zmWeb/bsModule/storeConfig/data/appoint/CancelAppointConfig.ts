export class CancelAppointConfig {
    constructor(){}
    id:string;
    reason:string;

    public static newInstance(idP:string, reasonP:string){
      let instance = new CancelAppointConfig();
      instance.id = idP;
      instance.reason = reasonP;
      return instance;
    }
}
