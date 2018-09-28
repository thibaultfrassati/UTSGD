import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";

import { GetPatientDataComponent } from './get-patient-data.component';
import {FileUploadRoutes} from "./get-patient-data.routing";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FileUploadRoutes),
    SharedModule
  ],
  declarations: [GetPatientDataComponent]
})
export class FileUploadModule { }
