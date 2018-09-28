import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {DatatableComponent} from "@swimlane/ngx-datatable";
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-observation',
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.css'],
  encapsulation: ViewEncapsulation.None

})

export class ObservationComponent implements OnInit {
  _obs;
  _idPatient = 'Patient/5ba8b75b2eef950010bbb5b0';
  _resultList = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
	this._obs = this.getObservations();
	this._obs.subscribe(result => {
		console.log(result);
		for(var i = 0 ; i < result.length ; i++) {
			if(result[i].subject.reference == this._idPatient) {
				this._resultList.push(result[i]);
			}
		}
	});
  }

  getObservations() {
  	return this.http.get('https://fhir.eole-consulting.io/api/observation');
  }

  getObservation(id) {
  	// id = '5ba8b75b2eef950010bbb5b0';
  	return this.http.get('https://fhir.eole-consulting.io/api/observation/'+id);
  }

  formatDate(date) {
  	let dateToFormat = new Date(date)
  	return this.formatUnderTen(dateToFormat.getDate())+"/"+(this.formatUnderTen(dateToFormat.getMonth()+1))+"/"+dateToFormat.getFullYear();
  }

  formatUnderTen(number) {
  	if(number < 10) 
  		return '0'+number;
  	else
  		return number;
  }
  
 //  fetchData(data) {
	// var html = '<sb-item [collapsed]="false" class="accordion-panel">'+
 //          '<sb-item-head class="accordion-heading accordion-msg">Lorem Message 1</sb-item-head>'+
 //          '<sb-item-body class="accordion-content">'+
 //            '<div class="accordion-desc">'+

 //             	'<div class="form-group row">'+
	// 	          '<label class="col-sm-2 col-form-label">Médecin :</label>'+
	// 	          '<div class="col-sm-10">'+
	// 	            '<div class="form-control-static">'+data.categorie.text'+</div>'+
	// 	          '</div>'+
	// 	        '</div>'+
	// 	        '<div class="form-group row">'+
	// 	          '<label class="col-sm-2 col-form-label">Observation :</label>'+
	// 	          '<div class="col-sm-10">'+
	// 	            '<div class="form-control-static">'+Cancer'+</div>'+
	// 	          '</div>'+
	// 	        '</div>'+

 //            '</div>'+
 //          '</sb-item-body>'+
 //        '</sb-item>';
 //        this._resultList.push(html);
 //  }

}

