import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxQrscannerComponent } from './ngx-qrscanner.component';

describe('NgxQrscannerComponent', () => {
  let component: NgxQrscannerComponent;
  let fixture: ComponentFixture<NgxQrscannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgxQrscannerComponent]
    });
    fixture = TestBed.createComponent(NgxQrscannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
