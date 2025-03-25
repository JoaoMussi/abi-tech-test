import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { EmployeesComponent } from './views/employees/employees.component';
import { EmployeesService } from './services/employees.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, EmployeesComponent],
    })
      .overrideComponent(EmployeesComponent, {
        set: { providers: [{ provide: EmployeesService, useValue: {} }] },
      })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
