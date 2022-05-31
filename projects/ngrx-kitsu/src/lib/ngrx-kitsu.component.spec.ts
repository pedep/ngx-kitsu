import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgrxKitsuComponent } from './ngrx-kitsu.component';

describe('NgrxKitsuComponent', () => {
  let component: NgrxKitsuComponent;
  let fixture: ComponentFixture<NgrxKitsuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgrxKitsuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgrxKitsuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
