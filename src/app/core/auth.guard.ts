import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { supabase } from './supabase.client';

export async function authGuard(): Promise<boolean | UrlTree> {
  const router = inject(Router);
  const { data } = await supabase.auth.getSession();
  return data.session ? true : router.createUrlTree(['/login']);
}
