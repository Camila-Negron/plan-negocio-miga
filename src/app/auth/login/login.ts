import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { supabase } from '../../core/supabase.client';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  form: FormGroup;
  msg = '';
  modoLogin = false; // false = registrar, true = iniciar sesión

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;

    const { nombre, apellido, email, password } = this.form.value;

    if (this.modoLogin) {
      // 🔐 Iniciar sesión
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        this.msg = '❌ ' + error.message;
        return;
      }

      this.router.navigateByUrl('/planes');
    } else {
      // 🆕 Crear cuenta
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        this.msg = '❌ ' + signUpError.message;
        return;
      }

      const userId = data.user?.id;
      if (userId) {
        // Guardar nombre y apellido en tabla profiles
        const { error: insertError } = await supabase.from('profiles').insert([
          {
            id: userId,
            nombre,
            apellido,
          },
        ]);

        if (insertError) {
          this.msg = '⚠️ Cuenta creada, pero falló guardar el perfil';
        }
      }

      // Iniciar sesión automáticamente luego de registrarse
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        this.msg = 'Cuenta creada pero error al iniciar sesión';
        return;
      }

      this.router.navigateByUrl('/planes');
    }
  }
}
