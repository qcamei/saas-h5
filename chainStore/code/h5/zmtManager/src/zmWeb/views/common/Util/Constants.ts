export class Constants{
  public static ONEDAY_TIMESTAMP:number = 1000 *60 *60 *24;
  public static EXPERIENCE_USERID = "328";//体验账号
  public static EXPERIENCE_PHONE = "12100000000";//体验账号
  public static EXPERIENCE_PASSWORD = "123456";//密码
  public static EXPERIENCE:string = "experience"; //体验环境标识

  public static readonly ISEXPERIENCE:string = "IsExperience"; //是否体验环境
  public static readonly ADMIN_EXPERIENCE:string = "admin-expe"; //体验环境管理员账号

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

}
