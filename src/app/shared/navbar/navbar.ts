import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { supabase } from '../../core/supabase.client';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
})
export class NavbarComponent implements OnInit {
  router = inject(Router);
  cd = inject(ChangeDetectorRef);
  userName = '...';
  currentPlanId: string | null = null;

  async ngOnInit() {
    try {
      // Obtener datos del usuario
      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log('👤 Usuario:', userData);
      if (userError) console.error('❌ Error al obtener usuario:', userError);

      const userId = userData.user?.id;

      if (userId) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('nombre, apellido')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error('❌ Error al obtener perfil:', profileError);
        }

        if (profile) {
          this.userName = `${profile.nombre} ${profile.apellido}`;
          this.currentPlanId = localStorage.getItem('currentPlanId');
      this.cd.detectChanges();
        }
      }

      // Obtener planId actual del localStorage
       // 🔄 Forzar actualización de vista

    } catch (err) {
      console.error('🚨 Error inesperado en navbar:', err);
    }
  }

  async logout() {
    await supabase.auth.signOut();
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
