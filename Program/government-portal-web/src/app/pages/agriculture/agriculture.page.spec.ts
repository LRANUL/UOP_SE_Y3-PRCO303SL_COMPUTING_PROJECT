import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgriculturePage } from './agriculture.page';

describe('AgriculturePage', () => {
  let component: AgriculturePage;
  let fixture: ComponentFixture<AgriculturePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgriculturePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AgriculturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
