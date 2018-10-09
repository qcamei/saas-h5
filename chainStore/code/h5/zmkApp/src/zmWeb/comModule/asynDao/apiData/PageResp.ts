export class PageResp<T> {
  constructor() {}
  pageNo: number;
  totalCount: number;
  totalPage: number;
  pageItemCount: number;
  list: Array<T>;// 每页显示数据记录的集合
}
