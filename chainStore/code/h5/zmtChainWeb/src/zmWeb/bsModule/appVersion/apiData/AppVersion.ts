export class AppVersion {

  id: number;// 主键ID

  appName: string;// 应用名称

  appVersion: string;// 应用版本号

  appUrl: string;// 下载的链接

  descript: string;// 描述

  status: number;// 状态 0:失效 1有效 AppVersionEnum

  createdTime: number;

  lastUpdateTime: number;

  ver: number;
}
