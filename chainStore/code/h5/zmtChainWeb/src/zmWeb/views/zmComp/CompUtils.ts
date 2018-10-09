
export class CompUtils {


  private static Instance:CompUtils = new CompUtils();
  public static getInstance(): CompUtils {
    return CompUtils.Instance;
  }

  public  getRandomNumber(range:number):number{
    let rNum:number = Math.random();
    return Math.round(rNum*range);
  }

}
