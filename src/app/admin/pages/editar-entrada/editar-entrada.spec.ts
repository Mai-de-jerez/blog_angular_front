import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEntrada } from './editar-entrada';

describe('EditarEntrada', () => {
  let component: EditarEntrada;
  let fixture: ComponentFixture<EditarEntrada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarEntrada],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarEntrada);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
