

export class PageDefPath {

  public readonly  main = "main";

  public readonly storeProduct = "storePrd";
  public readonly storeProdList = "storePrdList/:status";
  public readonly  storeMaterial = "storeMtl";


}


export class PagePath {

  public static defPath:PageDefPath = new PageDefPath();

  public static readonly  main = "/"+PagePath.defPath.main;

  public static readonly  main_storeProduct_storeProdList = "/"+PagePath.defPath.main+"/"+PagePath.defPath.storeProduct+"/" + PagePath.defPath.storeProdList;

}





