import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosIndirectos } from './costos-indirectos';

describe('CostosIndirectos', () => {
  let component: CostosIndirectos;
  let fixture: ComponentFixture<CostosIndirectos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostosIndirectos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostosIndirectos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
