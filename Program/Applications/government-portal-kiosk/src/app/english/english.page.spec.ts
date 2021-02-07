import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnglishPage } from './english.page';

describe('EnglishPage', () => {
  let component: EnglishPage;
  let fixture: ComponentFixture<EnglishPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnglishPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnglishPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
