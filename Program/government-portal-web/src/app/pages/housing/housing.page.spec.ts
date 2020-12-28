import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HousingPage } from './housing.page';

describe('HousingPage', () => {
  let component: HousingPage;
  let fixture: ComponentFixture<HousingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HousingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HousingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
