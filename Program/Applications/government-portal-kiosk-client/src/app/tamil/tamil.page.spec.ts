import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TamilPage } from './tamil.page';

describe('TamilPage', () => {
  let component: TamilPage;
  let fixture: ComponentFixture<TamilPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TamilPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TamilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
