export class PageResp {
  constructor() {}
  pageNo: number;
  totalCount: number;
  totalPage: number;
  pageItemCount: number;
  list: Array<any>;// 每页显示数据记录的集合
}
