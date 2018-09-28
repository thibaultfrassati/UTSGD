import { Component, OnInit , ViewEncapsulation, Input} from '@angular/core';
import {fadeInOutTranslate} from '../../shared/elements/animation';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NgbDateParserFormatter, NgbDateStruct, NgbCalendar} from "@ng-bootstrap/ng-bootstrap";
import {ColorPickerService, Rgba} from "ngx-color-picker";
import {ToastyService, ToastOptions, ToastData} from "ng2-toasty";
import {NotificationsService} from "angular2-notifications";

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
    !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
                    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
    !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
                    ? false : one.day > two.day : one.month > two.month : one.year > two.year;

const now = new Date();

export class Cmyk {
  constructor(public c: number, public m: number, public y: number, public k: number) { }
}


@Component({
  selector: 'app-get-patient-data',
  templateUrl: './get-patient-data.component.html',
  styleUrls: ['./get-patient-data.component.css'],
  animations: [fadeInOutTranslate],
  encapsulation: ViewEncapsulation.None,
  providers: [ColorPickerService]

})
export class GetPatientDataComponent implements OnInit {
	///////////////////////  Début du code CALENDAR  //////////////////////////////
  model: any;
  modelCustomDay: any;

  displayMonths: number = 3;
  navigation:string = 'select';

  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;

  disabled: boolean = true;

  materialDate: Date;
  defaultDateSelected: Date = new Date('1993/03/10');
  startDateRange: Date = new Date('2017/07');
  endDateRange: Date = new Date();
  disabledMaterial: boolean = true;
  @Input() testRangeDate: Date;

  toggle: boolean = false;
  lastColor: string;
  rgbaText: string;


  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  isDisabled(date: NgbDateStruct, current: {month: number}) {
    return date.month !== current.month;
  }

  public color: string = '#2889e9';
  public color2: string = "hsla(300,82%,52%)";
  public color3: string = "#fff500";
  public color4: string = "rgb(236,64,64)";
  public color5: string = "rgba(45,208,45,1)";

  public color13: string = "rgba(0, 255, 0, 0.5)";
  public color14: string = "rgb(0, 255, 255)";
  public color15: string = "#a51ad633";

  public basicColor: string = '#2ab2f5';
  public showColorCode: string = '#db968d';
  public showColorCodeHSAL: string = 'hsl(149,27%,65%)';
  public showColorCodeRGBA: string = 'rgb(221,14,190)';
  public changeMeColor: string = '#523698';

  public arrayColors: any = {};
  public selectedColor: string = 'color';

	///////////////////////////////////// Fin calendar ////////////////////////////////////////////
  /////////////////////////////// Début attributs notification //////////////////////////////////
    options: any = {
    position: ["bottom", "right"],
  };

  position1: string = 'bottom';
  position2: string = 'right';
  timeOut: number = 1000;
  showProgressBar: boolean = true;
  pauseOnHover: boolean = true;
  lastOnBottom: boolean = true;
  clickToClose: boolean = true;
  maxLength: number = 0;
  maxStack: number = 8;
  preventDuplicates: boolean = false;
  preventLastDuplicates: boolean = false;
  theClass: string;
  rtl: boolean = false;
  animate: string = 'fromRight';
  icons: string;
  subType: string = 'success';

  title: string;
  msg: string;
  ///////////////////////////////////// Fin attribut toast //////////////////////////////////////////
  /////////////////////////////// Début attributs pour le binding  //////////////////////////////////

    editProfile = true;
    _card = {title: "Cabinet médical SunDown"};
    _id_patient = '5ba8b75b2eef950010bbb5b0';
    _id_medecin = '5ba8b7742eef950010bbb5b3';
    _response;
    _patient;
    _patient_date;
    _patient_gender;
    _apointment;
    _position: string = 'bottom-right';

  constructor(private http: HttpClient, 
  	public parserFormatter: NgbDateParserFormatter, 
  	public calendar: NgbCalendar, 
  	public cpService: ColorPickerService,
    private toastyService: ToastyService, 
    private servicePNotify: NotificationsService) { 
	  	this.fromDate = calendar.getToday();
	    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);

	    this.arrayColors['color'] = '#2883e9';
	    this.arrayColors['color2'] = '#e920e9';
	    this.arrayColors['color3'] = 'rgb(255,245,0)';
	    this.arrayColors['color4'] = 'rgb(236,64,64)';
	    this.arrayColors['color5'] = 'rgba(45,208,45,1)';

	      const windowWidth = window.innerWidth;
	      if (windowWidth >= 768 && windowWidth <= 1024) {
	          this.displayMonths = 2;
	          this.navigation = 'select';
	      } else if (windowWidth < 768) {
	          this.displayMonths = 1;
	          this.navigation = 'select';
	      } else {
	          this.displayMonths = 3;
	          this.navigation = 'none';
	      }
	}

  ngOnInit() {
  	var res = this.http.get('https://fhir.eole-consulting.io/api/patient/'+this._id_patient);
  	res.subscribe(
  		value=> {
        console.log(value);
        this._patient = value;
        this.sublimDateFormat(value);
        this.sublimGenderFormat(value);
      }
  	);  	
  };

  createApointment(designation, date, titre) {
  	return {
	  "resourceType": "Appointment",
	  "text": {
	    "status": "generated",
	    "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">" + titre + "</div>"
	  },
	  "status": "proposed",
	  "description": designation,
	  "created": new Date().toString(),
	  "participant": [
	    {
        "actor": {
          "reference": "Patient/"+this._id_patient,
          "display": "Peter James Chalmers"
        },
        "required": "required",
        "status": "needs-action"
      },{
        "actor": {
          "reference": "Practioner/"+this._id_medecin,
          "display": "Docteur Mabouleu"
        },
        "required": "required",
        "status": "tentative"
      }
	  ],
	  "requestedPeriod": [
	    {
	      "start": date,
	      "end": date
	    }
	  ]
	};
  }

  sublimDateFormat(value) {
  	var birthday = new Date(value.birthDate);
  	this._patient_date = this.formatUnderTen(birthday.getDate())+"/"+this.formatUnderTen((birthday.getMonth()+1))+"/"+birthday.getFullYear();
  }

  sublimGenderFormat(value) {
  	switch(value.gender) {
  		case 'male' :
  			this._patient_gender = 'Homme'
  			break;
  		case 'female':
  			this._patient_gender = 'Femme'
  			break;
  		case 'other':
  			this._patient_gender = 'Non binaire'
  			break;
  	}
  }

  formatUnderTen(number) {
    if(number < 10) 
      return '0'+number;
    else
      return number;
  }


  ////////////////////// CALENDAR ////////////////////////////////

  _modelDate: NgbDateStruct; 
  _modelDesignation;	
  _modelTitre;
  date: {year: number, month: number};

  sendRequest() {
    var data = this.createApointment(this._modelDesignation, this.parserFormatter.format(this._modelDate), this._modelTitre);
    this.sendApointmentRequest(data);
    this.addNotify({title:'Requête bien envoyé', msg: 'Votre demande "'+this._modelTitre+'" à été prise en compte', type:'success',timeOut:2000, showProgressBar: true})

    this._modelTitre="";
    this._modelDesignation="";
    // this.addToast({title:'Material Toasty', msg:'Turning standard Bootstrap alerts into awesome notifications',
    //  timeout: 5000, theme:'material', position:'bottom-right', type:'error'})
  }



  sendApointmentRequest(data) {
  	let url = 'https://fhir.eole-consulting.io/api/appointment';
  	this.http.post(url, data).subscribe();
  }

  onDateChange(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);

  modelDisabled: NgbDateStruct = {
    year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()
  };

  formatDate(materialDate: Date): string {
    return materialDate.toLocaleString();
  }

  onSelect(materialDate: Date) {
    // console.log("onSelect: ", materialDate);
  }
  clearDate() {
    this.materialDate = null;
  }
  setToday() {
    this.materialDate = new Date();
  }

  public cmyk: Cmyk = new Cmyk(0, 0, 0, 0);

  onChangeColor(color: string): Cmyk {
    return this.rgbaToCmyk(this.cpService.hsvaToRgba(this.cpService.stringToHsva(color)));
  }

  rgbaToCmyk(rgba: Rgba): Cmyk {
    let cmyk: Cmyk = new Cmyk(0, 0, 0, 0), k: number;
    k = 1 - Math.max(rgba.r, rgba.g, rgba.b);
    if (k == 1) return new Cmyk(0, 0, 0, 1);
    cmyk.c = (1 - rgba.r - k) / (1 - k);
    cmyk.m = (1 - rgba.g - k) / (1 - k);
    cmyk.y = (1 - rgba.b - k) / (1 - k);
    cmyk.k = k;
    return cmyk;
  }

  onChangeColorHex8(color: string): string {
    return this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'rgba', null);
  }

  ///////////////////////////////////////////////////////////////
  
  addNotify(options) {
    //this.pauseOnHover = (options.indexOf("pauseOnHover") > -1) ? options.pauseOnHover : this.pauseOnHover;
    this.servicePNotify.remove();
    this.options  = {
      position : [("position1" in options) ? options.position1 : this.position1, ("position2" in options) ? options.position2 : this.position2],
      maxStack: ("maxStack" in options) ? options.maxStack : this.maxStack,
      timeOut: options.timeOut ? options.timeOut : this.timeOut,
      showProgressBar: ('showProgressBar' in options) ? options.showProgressBar : this.showProgressBar,
      pauseOnHover: ('pauseOnHover' in options) ? options.pauseOnHover : this.pauseOnHover,
      lastOnBottom: ('lastOnBottom' in options) ? options.lastOnBottom : this.lastOnBottom,
      clickToClose: ('clickToClose' in options) ? options.clickToClose : this.clickToClose,
      maxLength: options.maxLength ? options.maxLength : this.maxLength,
      preventDuplicates: ('preventDuplicates' in options) ? options.preventDuplicates : this.preventDuplicates,
      preventLastDuplicates: ('preventLastDuplicates' in options) ? options.preventLastDuplicates : this.preventLastDuplicates,
      theClass: options.theClass ? options.theClass : this.theClass,
      rtl: ('rtl' in options) ? options.rtl : this.rtl,
      animate: options.animate ? options.animate : this.animate,
      icons: options.icons ? options.icons : this.icons
    }
    switch(options.type) {
      case 'success':
        this.servicePNotify.success(
            options.title ? options.title : this.title,
            options.msg ? options.msg : this.msg
        );
        break;
      case 'error':
        this.servicePNotify.error(
            options.title ? options.title : this.title,
            options.msg ? options.msg : this.msg
        );
        break;
      case 'alert':
        this.servicePNotify.error(
            options.title ? options.title : this.title,
            options.msg ? options.msg : this.msg
        );
        break;
      case 'warn':
        this.servicePNotify.error(
            options.title ? options.title : this.title,
            options.msg ? options.msg : this.msg
        );
        break;
      case 'info':
        this.servicePNotify.info(
            options.title ? options.title : this.title,
            options.msg ? options.msg : this.msg
        );
        break;
      case 'create':
        this.servicePNotify.create(
            options.title ? options.title : this.title,
            options.msg ? options.msg : this.msg,
            options.type ? options.type : this.subType
        );
        break;
      case 'html':
        this.servicePNotify.html(
            options.title ? options.title : this.title,
            options.msg ? options.msg : this.msg
        );
        break;
      default:
        this.servicePNotify.alert(
            options.title ? options.title : this.title,
            options.msg ? options.msg : this.msg
        );
        break;
    }
  }
}
