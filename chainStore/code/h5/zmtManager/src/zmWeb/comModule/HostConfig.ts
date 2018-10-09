export class HostConfig{

  //本地环境 —— 直接配置微服务
  // public static readonly serviceAddress = 'http://127.0.0.1:9124/storemngms/ws/v1';
  // public static readonly imgPreUrl = 'http://192.168.40.220/';


  //开发环境 —— 通过路由网关
  public static readonly serviceAddress = 'http://192.168.40.220:9124/storemngms/ws/v1';
  public static readonly imgPreUrl = 'http://192.168.40.220/';

  //测试环境
  // public static readonly serviceAddress = 'http://192.168.40.221:9124/storemngms/ws/v1';
  // public static readonly imgPreUrl = 'http://192.168.40.221/';

  //正式环境1
  // public static readonly serviceAddress = 'https://www.zhimeitimes.com:9110/storemngms/ws/v1/';
  // public static readonly imgPreUrl = 'https://www.zhimeitimes.com:9110/';

  //正式环境2
  //public static readonly serviceAddress = 'https://www.zhimeitimes.com/storemngms/ws/v1/';
  //public static readonly imgPreUrl = 'https://www.zhimeitimes.com/';

  //仿真环境
  //public static serviceAddress = 'https://www.zhimeitimes.com:9129/storems/ws/v1';
  //public static imgPreUrl = 'https://www.zhimeitimes.com:9129/';


}
