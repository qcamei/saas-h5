import {VipContent} from "./VipContent";
export class BUserRole {
  constructor() {
  }

  id: number;
  buserId: number;
  vipContent: VipContent;
  preVipContent: VipContent;
  createdTime: number;
  lastUpdateTime: number;
  ver: number;
}
