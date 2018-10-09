export class Constants{
  public static ONEDAY_TIMESTAMP:number = 1000 *60 *60 *24;
  public static readonly STORE_CLERKINFO_ID_SUFFFIX = "_sci";
  public static MAX_UPLOAD_IMG = 9;

  public static GOODS_DEFAULT_IMG = "img/logo/goods/goodList.png";
  public static PRODUCT_DEFAULT_IMG = "img/logo/product/pore.png";
  public static PACKAGE_DEFAULT_IMG = "img/logo/package/default.png";
  public static MEMBERCARD_DEFAULT_IMG = "img/logo/card/pic_membership_card1.png";
  public static PRDCARD_DEFAULT_IMG = "img/logo/card/pic_consumption_card1.png";

  public static MALE_DEFAULT_IMG = "img/logo/chainUser/female_icon.jpg";
  public static FEMALE_DEFAULT_IMG = "img/logo/chainUser/male_icon.jpg";

  public static GOODS_TYPE_PREFIX = "_cgti_";
  public static PRODUCT_TYPE_PREFIX = "_cpti_";
  public static PACKAGE_TYPE_PREFIX = "_cppti_";
  public static PRODUCTCARD_TYPE_PREFIX = "_cpcti_";

  public static DATE_FORMAT = "yyyy/MM/dd hh:mm:ss";

  //查询参数初始值
  public static NULL_STRING = "";
  public static DEFAULT_TYPE_VALUE = "-1";
  public static DEFAULT_STATE_VALUE = -1;
  public static DEFAULT_TIME_VALUE = "0";
  public static DEFAULT_PAGENO = 1;
  public static DEFAULT_PAGEITEMCOUNT = 10;



  public static VERSION_REQ_URL = "/storems/ws/v1/appVersionUnAuth/findByName?appName=智美通PC";
  public static LOGIN_ADDR_SUFFIX = "/zmtweb/#/login";

}
