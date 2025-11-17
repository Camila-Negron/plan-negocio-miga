import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { supabase } from '../../core/supabase.client';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-objetivo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './objetivo.html',
})
export class ObjetivoComponent implements OnInit {
  form: FormGroup;
  msg = '';
  planId: string | null = null;
  saved = false;


  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);


  constructor() {
    this.form = this.fb.group({
      que: ['', Validators.required],
      aQuien: ['', Validators.required],
      cuando: ['', Validators.required],
      como: ['', Validators.required],
      donde: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      this.planId = params['planId'] || null;

      if (!this.planId) {
        const { data, error } = await supabase.rpc('create_or_get_plan');
        if (error) {
          this.msg = 'Error al obtener el plan';
          return;
        }
        this.planId = data;
      }

      localStorage.getItem('currentPlanId');

      this.loadSection();
    });
  }

  async loadSection() {
    const { data } = await supabase
      .from('sections')
      .select('*')
      .eq('plan_id', this.planId)
      .eq('tipo', 'objetivo')
      .single();

    if (data && data.inputs_json) {
      this.form.patchValue(data.inputs_json);
    }
  }

  async onSubmit() {
    if (!this.planId || this.form.invalid) return;

    const { error: sectionError } = await supabase
      .from('sections')
      .upsert({
        plan_id: this.planId,
        tipo: 'objetivos',
        inputs_json: this.form.value,
        outputs_json: {},
        updated_at: new Date().toISOString(),
      }, { onConflict: 'plan_id,tipo' });

    if (sectionError) {
      this.msg = `❌ ${sectionError.message}`;
      this.saved = false;
      return;
    }

    // 👇 Actualizar campo ultima_seccion del plan
    const { error } = await supabase
      .from('plans')
      .update({ ultima_seccion: 'objetivos' })
      .eq('id', this.planId);

    if (!error) {
      await supabase.from('plans').update({ ultima_seccion: 'objetivo' }).eq('id', this.planId);
    }

    this.msg = '✅ Objetivos guardados';
    this.saved = true;

    this.router.navigate(['/costos/materia-prima'], {
      queryParams: { planId: this.planId }
    });
  }


}
