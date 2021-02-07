import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EducationPage } from './education.page';

describe('EducationPage', () => {
  let component: EducationPage;
  let fixture: ComponentFixture<EducationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EducationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EducationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
