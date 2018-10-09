import { Component,OnInit,Input,Output,EventEmitter,OnChanges } from "@angular/core";
import { cityData } from "./city";

@Component({
  selector:'city-select-comp',
  template:
  `

<div class="d-flex">

	<mat-form-field class="mr-12" color="accent">
		<mat-select placeholder="请选择省" [ngModel]="province_i" (ngModelChange)="initProvince($event)">
		<mat-option *ngFor="let province of province; let i = index;" [value]="i">
			{{province.name}}
		</mat-option>
		</mat-select>
	</mat-form-field>

	<mat-form-field class="mr-12" color="accent">
		<mat-select placeholder="请选择市"  [ngModel]="city_i" (ngModelChange)="initCity($event)">
		<mat-option *ngFor="let city of city; let i = index;" [value]="i">
			{{city.name}}
		</mat-option>
		</mat-select>
	</mat-form-field>

	<mat-form-field color="accent">
		<mat-select placeholder="请选择区/县" [ngModel]="district_i" (ngModelChange)="initDistrict($event)">
		<mat-option *ngFor="let district of district; let i = index;" [value]="i">
			{{district}}
		</mat-option>
		</mat-select>
	</mat-form-field>


<!--

	    <select class="form-control mr-2 cur-hand" [ngModel]="province_i" (ngModelChange)="initProvince($event)">
	    		<option value="-1">-请选择省-</option>
	    		<option *ngFor="let province of province; let i = index;" [value] = "i">{{province.name}}</option>
	    </select>
	    <select class="form-control mr-2 cur-hand" [ngModel]="city_i" (ngModelChange)="initCity($event)">
				<option value="-1">- 请选择市 -</option>
				<option *ngFor="let city of city; let i = index;" [value] = "i">{{city.name}}</option>
	    </select>
	    <select class="form-control mr-2 cur-hand" [ngModel]="district_i" (ngModelChange)="initDistrict($event)">
				<option value="-1">- 请选择区/县 -</option>
				<option *ngFor="let district of district; let i = index;" [value] = "i">{{district}}</option>
	    </select>-->
	</div>
   `
})
export class CitySelect {
    cityData = cityData;
    province = [];
    city = [];
    district = [];
    province_i:string | number = '-1';
    city_i:string | number = '-1';
    district_i:string | number= '-1';
    @Input() citySetting:string[] = [];
    @Output() citySettingChange = new EventEmitter();
    ngOnInit():void{
    	this.cityInit(this.citySetting);
    }
    ngOnChanges(changes){
    	this.cityInit(changes.citySetting.currentValue);
    }
    cityInit(citySetting):void{
    	if(citySetting){
    		this.valueToIndex(citySetting[0],citySetting[1],citySetting[2]);
    	}
    	this.province = this.cityData;
    }
	initProvince(index):void{
		if(index > -1){
			this.province_i = index;
			this.city_i = 0;
			this.district_i = 0;
			this.city = this.province[index].city;
			this.district = this.city[0].districtAndCounty;
		}else{
			this.resetTpl('province');
		}
		this.callback();
	}

	initCity(index):void{
		if(index > -1){
			this.city_i = index;
			this.district_i = 0;
			this.district = this.city[index].districtAndCounty;
		}else{
			this.resetTpl('city');
		}
		this.callback();
	}

	initDistrict(index):void{
		this.district_i = index;
		this.callback();
	}

	valueToIndex(province:string,city:string,district:string):void{
		try{
			for(let i=0;i<this.cityData.length;i++){
				if(province&&this.cityData[i].name.indexOf(province) > -1){
					this.province_i = i;
					this.city = this.cityData[i].city;
					for(let j = 0;j < this.cityData[i].city.length;j++){
						if(city&&this.cityData[i].city[j].name.indexOf(city) > -1){
							this.city_i = j;
							this.district = this.city[j].districtAndCounty;
							for(let z = 0;z < this.cityData[i].city[j].districtAndCounty.length;z++){
								if(district&&this.cityData[i].city[j].districtAndCounty[z].indexOf(district) > -1){
									this.district_i = z;
									// this.callback();
								}
							}
						}
					}
				}
			}
		}catch(e){
			alert('data error');
		}
	}

	/**
	 *重置模板
	 *@type STRING:'province' or 'city'
	 */
	resetTpl(type:string):void{
		if(type === 'province'){
			this.province_i = -1;
			this.city = [];
		}
		this.city_i = -1;
		this.district_i = -1;
		this.district = [];
	}
	//返回数据
	callback():any{
		if(this.province[this.province_i]&&this.city[this.city_i]&&this.district[this.district_i]){
			let arr = [this.province[this.province_i].name,this.city[this.city_i].name,this.district[this.district_i]];
			this.citySettingChange.emit(arr);
		}else{
			this.citySettingChange.emit([]);
		}
	}
}
