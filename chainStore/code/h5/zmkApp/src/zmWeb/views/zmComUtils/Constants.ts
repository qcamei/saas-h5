export class Constants{
  public static ONEDAY_TIMESTAMP:number = 1000 *60 *60 *24;
  public static EXPERIENCE:string = "experience";
  public static readonly STORE_CLERKINFO_ID_SUFFFIX = "_sci";
  public static MAX_UPLOAD_IMG = 9;

  public static GOODS_DEFAULT_IMG = "img/logo/goods/goodList.png";
  public static PRODUCT_DEFAULT_IMG = "img/logo/product/pore.png";
  public static PACKAGE_DEFAULT_IMG = "img/logo/package/default.png";
  public static MEMBERCARD_DEFAULT_IMG = "img/logo/card/pic_membership_card1.png";
  public static PRDCARD_DEFAULT_IMG = "img/logo/card/pic_consumption_card1.png";

  public static MALE_DEFAULT_IMG = "img/logo/buser/female_icon.jpg";
  public static FEMALE_DEFAULT_IMG = "img/logo/buser/male_icon.jpg";

  public static DATE_FORMAT = "yyyy/MM/dd hh:mm:ss";

  public static LEAGUER_MALE_FORMAT = "{0}_01";//散客男eg: storeId_01
  public static LEAGUER_FEMALE_FORMAT = "{0}_02";//散客女eg: storeId_02
  public static LEAGUER_MALE_SUFFIX = "01";//散客男id后缀
  public static LEAGUER_FEMALE_SUFFIX = "02";//散客女id后缀

  //查询参数初始值
  public static BLANK_STRING = "";
  public static DEFAULT_TYPE_VALUE = "-1";
  public static DEFAULT_STATE_VALUE = -1;
  public static DEFAULT_TIME_VALUE = "0";
  public static DEFAULT_PAGENO = 1;
  public static DEFAULT_PAGEITEMCOUNT = 10;

  public static DEFAULT_STORE_TITLE = "请选择店铺";

  public static CUSER_ADDRESS_LIMIT = 10; //收货地址数量限制

  //微信相关
  public static readonly WX_APPID = "wx3a6b565bd78c5df2"; //智美通主体公众号的AppId, h5项目中调用微信jssdk时，需要用来生成签名
  public static readonly WX_MINI_APPID ="wx098ce2483147daa6"; //智美通主体公众号下的智美预约小程序的AppId, 调起小程序支付时要用到
  public static readonly WX_BOSS_MINI_APPID="" //商户的小程序AppId，如果后续有定制化小程序需求时，会用到



}
