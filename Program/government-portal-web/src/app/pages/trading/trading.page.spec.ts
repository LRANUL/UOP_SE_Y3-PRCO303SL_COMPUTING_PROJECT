import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TradingPage } from './trading.page';

describe('TradingPage', () => {
  let component: TradingPage;
  let fixture: ComponentFixture<TradingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TradingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
