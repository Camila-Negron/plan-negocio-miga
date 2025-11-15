import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { supabase } from './core/supabase.client';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App implements OnInit {
  nombreCompleto = signal('');

  async ngOnInit() {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user?.id) {
      const { data: perfil } = await supabase
        .from('profiles')
        .select('nombre, apellido')
        .eq('id', session.user.id)
        .single();

      if (perfil) {
        this.nombreCompleto.set(`${perfil.nombre} ${perfil.apellido}`);
      }
    }
  }
}
