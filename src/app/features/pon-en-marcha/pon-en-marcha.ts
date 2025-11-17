import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { supabase } from '../../core/supabase.client';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pon-en-marcha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pon-en-marcha.html',
})
export class PonEnMarchaComponent implements OnInit {
  form: FormGroup;
  planId: string | null = null;
  msg = '';

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  constructor() {
    this.form = this.fb.group({
      aliados: ['', Validators.required],
      clientes: ['', Validators.required],
      competencia: ['', Validators.required],
      puntosDistribucion: ['', Validators.required],
      mercadeo: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      this.planId = params['planId'] || null;

      if (!this.planId) {
        const { data, error } = await supabase.rpc('create_or_get_plan');
        if (error) {
          this.msg = '❌ Error al obtener el plan';
          return;
        }
        this.planId = data;
      }

      localStorage.getItem('currentPlanId');

      await this.loadSection();
    });
  }

  async loadSection() {
    const { data } = await supabase
      .from('sections')
      .select('*')
      .eq('plan_id', this.planId)
      .eq('tipo', 'pon-en-marcha')
      .single();

    if (data && data.inputs_json) {
      this.form.patchValue(data.inputs_json);
    }
  }

  async onSubmit() {
    if (!this.planId || this.form.invalid) return;

    const { error: sectionError } = await supabase.from('sections').upsert(
      {
        plan_id: this.planId,
        tipo: 'pon-en-marcha',
        inputs_json: this.form.getRawValue(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'plan_id,tipo' }
    );

    if (sectionError) {
      this.msg = '❌ Error al guardar';
      return;
    }

    // 👉 Actualizar la última sección en la tabla plans
    const { error: updateError } = await supabase
      .from('plans')
      .update({ ultima_seccion: 'pon-en-marcha' })
      .eq('id', this.planId);

    if (updateError) {
      this.msg = '✅ Guardado, pero no se actualizó la última sección';
    } else {
      this.msg = '✅ ¡Sección guardada exitosamente!';
    }
  }
}
