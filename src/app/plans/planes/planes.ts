import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { supabase } from '../../core/supabase.client';

@Component({
  selector: 'app-planes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planes.html',
})
export class PlanesComponent implements OnInit {
  planes: any[] = [];

  constructor(private router: Router) {}

  async ngOnInit() {
    const { data, error } = await supabase.from('plans').select('*');
    this.planes = data || [];
  }

  async crearNuevoPlan() {
    const user = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('plans')
      .insert({ user_id: user.data.user?.id, estado: 'borrador' })
      .select()
      .single();

    if (data) {
      this.planes.push(data);
      // Redirigir automáticamente a la Parte 1
      this.router.navigate(['/idea'], { queryParams: { planId: data.id } });
    }
  }


  abrir(planId: string) {
    this.router.navigate(['/idea'], { queryParams: { planId } });
  }
}
