export class Constants{
  public static ONEDAY_TIMESTAMP:number = 1000 *60 *60 *24;
  public static EXPERIENCE:string = "experience";
  public static readonly STORE_CLERKINFO_ID_SUFFFIX = "_sci";
  public static MAX_UPLOAD_IMG = 9;

  public static GOODS_EXCEL_TEMPLATE = "file/excel/商品批量导入模板.xlsx";
  public static PRODUCT_EXCEL_TEMPLATE = "file/excel/项目批量导入模板.xlsx";
  public static LEAGUER_EXCEL_TEMPLATE = "file/excel/会员批量导入模板.xlsx";

  public static PAY_INSTRUCTIONS_DOC = "file/doc/支付配置说明文档.docx";
  public static CERT_FILE_PRE_PATH:string = "file/payMS/cert/";

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

  public static CONSUMEWFNAME = "开单收银";
  public static RECHARGEWFNAME = "会员充值";

  public static GOODS_TYPE_PREFIX = "_cgti_";
  public static PRODUCT_TYPE_PREFIX = "_cpti_";
  public static PACKAGE_TYPE_PREFIX = "_cppti_";
  public static PRODUCTCARD_TYPE_PREFIX = "_cpcti_";

  //查询参数初始值
  public static NULL_STRING = "";
  public static DEFAULT_TYPE_VALUE = "-1";
  public static DEFAULT_STATE_VALUE = -1;
  public static DEFAULT_TIME_VALUE = "0";
  public static DEFAULT_PAGENO = 1;
  public static DEFAULT_PAGEITEMCOUNT = 10;


  public static PRICE_FORMAT = "1.2-2";
}
