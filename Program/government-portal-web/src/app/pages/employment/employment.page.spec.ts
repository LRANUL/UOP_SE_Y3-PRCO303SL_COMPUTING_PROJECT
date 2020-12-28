import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmploymentPage } from './employment.page';

describe('EmploymentPage', () => {
  let component: EmploymentPage;
  let fixture: ComponentFixture<EmploymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmploymentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmploymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
