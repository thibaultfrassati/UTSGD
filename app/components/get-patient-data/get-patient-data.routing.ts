import { Routes } from '@angular/router';
import {GetPatientDataComponent} from './get-patient-data.component';

export const FileUploadRoutes: Routes = [{
    path: '',
    component: GetPatientDataComponent,
    data: {
        breadcrumb: "Patient page"
    }
}];
