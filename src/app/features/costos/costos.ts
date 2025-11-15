import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-costos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './costos.html',
})
export class CostosComponent implements AfterViewInit {
  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.cdr.detectChanges(); // 👈 esto evita el error NG0100
  }
}

