import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JusticePage } from './justice.page';

describe('JusticePage', () => {
  let component: JusticePage;
  let fixture: ComponentFixture<JusticePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JusticePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JusticePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
