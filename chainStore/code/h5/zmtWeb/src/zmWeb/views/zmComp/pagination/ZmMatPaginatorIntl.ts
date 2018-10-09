import {MatPaginatorIntl} from '@angular/material';

export class ZmMatPaginatorIntl extends MatPaginatorIntl {
  itemsPerPageLabel = '每页显示:';
  nextPageLabel     = '下一页';
  previousPageLabel = '上一页';
  
  lastPageLabel='最后一页';
  firstPageLabel='第一页';

  getRangeLabel = function (page, pageSize, length) {
    if (length === 0 || pageSize === 0) {
      return '0 od ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' 共' + length + '条';
  };

}
