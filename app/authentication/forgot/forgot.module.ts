import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ForgotComponent} from './forgot.component';
import {SharedModule} from '../../shared/shared.module';

export const forgotRoutes: Routes = [
  {
    path: '',
    component: ForgotComponent,
    data: {
      breadcrumb: 'Forgot'
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(forgotRoutes),
    SharedModule
  ],
  declarations: [ForgotComponent]
})
export class ForgotModule { }
