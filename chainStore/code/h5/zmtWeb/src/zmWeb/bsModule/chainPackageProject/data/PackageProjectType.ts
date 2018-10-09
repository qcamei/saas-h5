export class PackageProjectType {
  constructor() {
  }

  id: string;
  name: string;
  entityState: number;
  createTime: number;
  lastUpdateTime: number;

  origin: number;//DataOriginEnum
}
