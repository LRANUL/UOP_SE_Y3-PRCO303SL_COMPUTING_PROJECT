import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HealthcarePage } from './healthcare.page';

describe('HealthcarePage', () => {
  let component: HealthcarePage;
  let fixture: ComponentFixture<HealthcarePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthcarePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HealthcarePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
