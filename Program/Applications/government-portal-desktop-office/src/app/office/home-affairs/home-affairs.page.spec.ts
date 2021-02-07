import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeAffairsPage } from './home-affairs.page';

describe('HomeAffairsPage', () => {
  let component: HomeAffairsPage;
  let fixture: ComponentFixture<HomeAffairsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeAffairsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeAffairsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
