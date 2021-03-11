import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentNotMadePage } from './payment-not-made.page';

describe('PaymentNotMadePage', () => {
  let component: PaymentNotMadePage;
  let fixture: ComponentFixture<PaymentNotMadePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentNotMadePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentNotMadePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
