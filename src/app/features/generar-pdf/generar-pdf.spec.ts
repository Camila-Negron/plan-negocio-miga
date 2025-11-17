import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargarPdf } from './generar-pdf';

describe('DescargarPdf', () => {
  let component: DescargarPdf;
  let fixture: ComponentFixture<DescargarPdf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescargarPdf]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescargarPdf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
