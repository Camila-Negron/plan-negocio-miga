import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PonEnMarcha } from './pon-en-marcha';

describe('PonEnMarcha', () => {
  let component: PonEnMarcha;
  let fixture: ComponentFixture<PonEnMarcha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PonEnMarcha]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PonEnMarcha);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
