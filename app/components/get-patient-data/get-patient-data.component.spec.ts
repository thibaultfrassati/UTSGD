import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPatientDataComponent } from './get-patient-data.component';

describe('GetPatientDataComponent', () => {
  let component: GetPatientDataComponent;
  let fixture: ComponentFixture<GetPatientDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetPatientDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetPatientDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
