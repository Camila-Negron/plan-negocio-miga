import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenCostos } from './resumen-costos';

describe('ResumenCostos', () => {
  let component: ResumenCostos;
  let fixture: ComponentFixture<ResumenCostos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenCostos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenCostos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
