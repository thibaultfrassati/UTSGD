import {Component, OnInit, ViewChild} from '@angular/core';
import {DatatableComponent} from "@swimlane/ngx-datatable";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rdv',
  templateUrl: './rdv.component.html',
  styleUrls: ['./rdv.component.css']
})
export class RdvComponent implements OnInit {
  rows = [{
  	created: '25/07/2017',
  	description: 'Tamalou ? Jaymalissi',
  	status: 'proposed'
  }];
  fullScreenRow = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  columns = [
    {prop: 'date'},
    {name: 'Description'},
    {name: 'Status'}
  ];

  _code;
  _affichage;
  _type;
  _statut;
  _id = '5ba8b75b2eef950010bbb5b0';
  //Attributs relatifs au tableau
  expanded = {};
  timeout: any;
  rowsFilter = [];
  tempFilter = [];

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private http: HttpClient) {
    this.fetchBasicData((data) => {
      // this.rows = this.rows;
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
    });

  }

  getHeaderActor(data) {
  	return this.splitTruc(data)[0];
  }

  getIdActor(data) {
  	return this.splitTruc(data)[1];
  }

  splitTruc(chaine){
  	return chaine.split("/");
  }

  ngOnInit() {
  	this.fillRdvArray();
  }

   getObservations() {
  	return this.http.get('https://fhir.eole-consulting.io/api/observation');
  }

  // Fonctions relatives au tableau
  fillRdvArray() {
  	var res = this.http.get('https://fhir.eole-consulting.io/api/appointment');
  	res.subscribe(
  		value=> {
  			var res = [];
  			console.log(value);
  			for(var i = 0 ; i < Object.keys(value).length ; i++) {
  				console.log(this.getHeaderActor(value[0].participant[0].actor.reference));
  				if (this.getIdActor(value[i].participant[0].actor.reference) == this._id 
  				 || this.getIdActor(value[i].participant[1].actor.reference) == this._id) {
  					// console.log(value[i]);
  					res.push({
  						date: this.sublimDateFormat(value[i].requestedPeriod[0].start),
  						description: value[i].description,
  						status: value[i].status
  					});
  				}	
  			}
  			console.log(res)
  			this.rows = res;
  		}
  	);
  }

  formatUnderTen(number) {
    if(number < 10) 
      return '0'+number;
    else
      return number;
  }

  sublimDateFormat(value) {
    var date = new Date(value);
    return this.formatUnderTen(date.getDate())+"/"+this.formatUnderTen((date.getMonth()+1))+"/"+date.getFullYear();
  }

  fetchBasicData(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', 'assets/data/basic.json');

    req.onload = () => {
    	console.log(cb);
      cb(JSON.parse(req.response));
    };

    req.send();
  }



  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      console.log('paged!', event);
    }, 100);
  }

  getRowHeight(row) {
    return row.height;
  }

}
