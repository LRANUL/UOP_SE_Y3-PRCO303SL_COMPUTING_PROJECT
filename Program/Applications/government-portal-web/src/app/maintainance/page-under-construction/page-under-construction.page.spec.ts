import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PageUnderConstructionPage } from './page-under-construction.page';

describe('PageUnderConstructionPage', () => {
  let component: PageUnderConstructionPage;
  let fixture: ComponentFixture<PageUnderConstructionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageUnderConstructionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PageUnderConstructionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
