import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SinhalaPage } from './sinhala.page';

describe('SinhalaPage', () => {
  let component: SinhalaPage;
  let fixture: ComponentFixture<SinhalaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinhalaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SinhalaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
