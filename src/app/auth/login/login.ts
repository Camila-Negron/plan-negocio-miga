import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { supabase } from '../../core/supabase.client';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html', 
})
export class LoginComponent {
  form: FormGroup;
  msg = '';
  loading = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.form.get('email')!;
  }

  get password() {
    return this.form.get('password')!;
  }

  async signupDirect() {
    const { email, password } = this.form.value;
    this.msg = '';
    this.loading = true;

    const { error: signUpErr } = await supabase.auth.signUp({ email, password });
    if (signUpErr) {
      this.msg = '❌ ' + signUpErr.message;
      this.loading = false;
      return;
    }

    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signInErr) {
      this.msg = '❌ ' + signInErr.message;
      this.loading = false;
      return;
    }

    this.loading = false;
    this.router.navigateByUrl('/planes');
  }

  async onSubmit() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;
    this.msg = '';
    this.loading = true;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      this.msg = '❌ ' + error.message;
      this.loading = false;
    } else {
      this.router.navigateByUrl('/planes');
    }
  }
}
