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
  cargando = true;

  constructor(private router: Router) {}

  async ngOnInit() {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (userId) {
      await this.cargarPlanes(userId);
    } else {
      // Esperar el cambio de sesión si aún no está cargada
      supabase.auth.onAuthStateChange(async (_event, session) => {
        const id = session?.user?.id;
        if (id) {
          await this.cargarPlanes(id);
        }
      });
    }
  }

  async cargarPlanes(userId: string) {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error cargando planes:', error);
      return;
    }

    this.planes = data || [];
    this.cargando = false;
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
      this.router.navigate(['/idea'], { queryParams: { planId: data.id } });
    }
  }

  async eliminar(planId: string) {
    const confirmado = confirm('¿Estás seguro de eliminar este plan?');

    if (confirmado) {
      const { error } = await supabase.from('plans').delete().eq('id', planId);

      if (!error) {
        this.planes = this.planes.filter((plan) => plan.id !== planId);
      } else {
        console.error('❌ Error al eliminar:', error);
      }
    }
  }


  abrir(planId: string) {
    supabase
      .from('plans')
      .select('ultima_seccion')
      .eq('id', planId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          console.error('❌ Error al obtener última sección', error);
          return;
        }

        const ultima = data.ultima_seccion;

        // Define los mapeos según la ruta que corresponda a cada sección
        let ruta = '/idea'; // valor por defecto

        switch (ultima) {
          case 'objetivo':
            ruta = '/objetivo';
            break;
          case 'costos':
            ruta = '/costos/materia-prima';
            break;
          case 'mano-obra':
            ruta = '/costos/mano-de-obra';
            break;
          case 'costos-indirectos':
            ruta = '/costos/costos-indirectos';
            break;
          case 'resumen-costos':
            ruta = '/costos/resumen';
            break;
        }

        this.router.navigate([ruta], {
          queryParams: { planId },
        });
      });
  }

}
