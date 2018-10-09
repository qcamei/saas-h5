import {Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges} from "@angular/core";

/**
 * 上传文件公共组件
 * eg:
 * <zm-input-file [label]="'上传图片'" (zmFileSelect)="zmFileSelect($event)"></zm-input-file>
 */
@Component({
  selector:'zm-input-file',
  template:
  `	
	  <ion-item>
         <ion-toolbar>
              <input type="file" placeholder="选择图片" class="custom-file-input" [accept]="fileType" (change)="fileSelect($event)"/>
              <ion-buttons end>
                  <button class="btn-upload" onclick="">{{label}}</button>
              </ion-buttons>
        </ion-toolbar>
    </ion-item>
  `,
  styles:
  [`
	.btn-upload{
		background:#4678fa;
		color:#fff;
		border: none;
	    border-radius: 6px;
	    font-size: 14px;
	    padding: 7px 12px;
	    cursor:pointer;
	}
  .custom-file-input {
    color: transparent;
  }
  .custom-file-input::-webkit-file-upload-button {
    visibility: hidden;
  }
  .custom-file-input::before {
    content: '选择图片';
    color: black;
    display: inline-block;
    background: -webkit-linear-gradient(top, #f9f9f9, #e3e3e3);
    border: 1px solid #999;
    border-radius: 3px;
    padding: 5px 8px;
    outline: none;
    white-space: nowrap;
    -webkit-user-select: none;
    cursor: pointer;
    text-shadow: 1px 1px #fff;
    font-weight: 700;
    font-size: 10pt;
  }
  .custom-file-input:hover::before {
    border-color: black;
  }
  .custom-file-input:active {
    outline: 0;
  }
  .custom-file-input:active::before {
    background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9); 
  }

  `]
})
export class ZmInputFile implements OnInit,OnDestroy,OnChanges {

  imgArr:string[] = [];
  @Input() label:string="上传图片";
  @Input() fileType:string = "image/png,image/jpeg,image/gif";

  @Output() zmFileSelect: EventEmitter<any> = new EventEmitter();


  constructor(){}


  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  fileSelect(e):void{
    if(!e.target.files[0]) {
      return;
    }

    var files = e.target.files;
    this.zmFileSelect.emit(files);

  }


}
