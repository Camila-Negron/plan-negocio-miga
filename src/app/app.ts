import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { supabase } from './core/supabase.client';
import { NavbarComponent } from './shared/navbar/navbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private nombreCompletoSignal = signal('');
  private rutaActual = signal('');

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.rutaActual.set(this.router.url);
    });
  }

  get mostrarNavbar() {
    return this.rutaActual() !== '/login';
  }

  get nombreCompletoValor() {
    return this.nombreCompletoSignal();
  }

  async ngOnInit() {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user?.id) {
      const { data: perfil } = await supabase
        .from('profiles')
        .select('nombre, apellido')
        .eq('id', session.user.id)
        .single();

      if (perfil) {
        this.nombreCompletoSignal.set(`${perfil.nombre} ${perfil.apellido}`);
      }
    }
  }
}
