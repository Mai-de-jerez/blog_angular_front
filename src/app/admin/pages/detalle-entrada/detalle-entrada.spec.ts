import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleEntrada } from './detalle-entrada';

describe('DetalleEntrada', () => {
  let component: DetalleEntrada;
  let fixture: ComponentFixture<DetalleEntrada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleEntrada],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleEntrada);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
