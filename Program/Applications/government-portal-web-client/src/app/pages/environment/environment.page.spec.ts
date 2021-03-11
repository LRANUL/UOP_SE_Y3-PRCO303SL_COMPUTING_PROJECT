import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnvironmentPage } from './environment.page';

describe('EnvironmentPage', () => {
  let component: EnvironmentPage;
  let fixture: ComponentFixture<EnvironmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnvironmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
