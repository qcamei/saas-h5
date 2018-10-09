import {OnInit, Component, Input, ViewChild, ElementRef, EventEmitter, Output} from "@angular/core";
import {MatAutocompleteSelectedEvent, MatChipInputEvent} from "@angular/material";
import {ENTER, COMMA} from "@angular/cdk/keycodes";
import {FormControl} from "@angular/forms";


@Component({
  selector:"zm-labels",
  template:`
    
    <mat-form-field class="zmFullWidth">
        <mat-label>{{label}}</mat-label>
        <mat-chip-list #chipList class="">
          <mat-chip *ngFor="let valueTmp of zmValue" [selectable]="selectable"
                   [removable]="removable" (removed)="remove(valueTmp)">
            {{valueTmp}}
            <mat-icon matChipRemove *ngIf="removable">cancel</mat-icon>
          </mat-chip>
          <input #valueInput 
                 [placeholder]="placeholder"
                 [formControl]="valueCtrl"
                 [matAutocomplete]="auto"
                 [matChipInputFor]="chipList"
                 [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                 [matChipInputAddOnBlur]="addOnBlur"
                 (matChipInputTokenEnd)="add($event)" />
        </mat-chip-list>
       <mat-autocomplete #auto="matAutocomplete" (optionSelected)="selected($event)">
          <mat-option *ngFor="let opTmp of filteredList" [value]="opTmp">
            {{opTmp}}
          </mat-option>
       </mat-autocomplete>
    </mat-form-field>

  `,
  styles:[`
  `]
})
export class ZmLabels implements OnInit{

  visible: boolean = true;
  selectable: boolean = true;
  @Input() removable: boolean = true;
  addOnBlur: boolean = false;

  @Input() disabled:boolean=false;
  @Input() label:string="标签";
  @Input() placeholder:string = "点击添加新标签...";

  separatorKeysCodes = [ENTER, COMMA];

  valueCtrl = new FormControl();

  @ViewChild('valueInput') valueInput: ElementRef;

  @Input() zmValue = [];
  @Output() zmValueChange = new EventEmitter();

  filteredList: string[] = [];
  @Input()optionList: string[] = [];


// @ViewChild('fruitInput') fruitInput: ElementRef;

  constructor() {}
  ngOnInit(){
    this.valueCtrl = new FormControl({disabled: this.disabled});
    if(this.optionList && this.optionList.length>0){
      this.filteredList = this.optionList;
      this.valueCtrl.valueChanges.subscribe(term => {
        this.filter(term);
      });
    }

  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      const index = this.zmValue.indexOf(value);
      if(index < 0){
        this.zmValue.push(value.trim());
        this.zmValueChange.emit(this.zmValue);
      }

    }

    // Reset the input value
    this.valueInput.nativeElement.value = '';
    this.valueCtrl.setValue('');
  }

  remove(value: any): void {
    const index = this.zmValue.indexOf(value);

    if (index >= 0) {
      this.zmValue.splice(index, 1);
      this.zmValueChange.emit(this.zmValue);
    }
  }

  filter(value: string) {
    if(value){
      this.filteredList = this.optionList.filter(item =>  item.toLowerCase().indexOf(value.toLowerCase()) === 0);
    }else{
      this.filteredList = this.optionList;
    }

  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.zmValue.push(event.option.viewValue);

    // Reset the input value
    this.valueInput.nativeElement.value = '';
    this.valueCtrl.setValue('');
  }
}


