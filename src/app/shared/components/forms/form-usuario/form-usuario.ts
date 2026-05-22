import { Component, inject, input, output, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../../auth/services/auth';
import { UsuarioPost } from '../../../../core/models/usuario-post';
import { ToastLocal } from '../../toast-local/toast-local';
import { FieldError } from '../../field-error/field-error'; 

@Component({
  selector: 'app-form-usuario',
  standalone: true,
  imports: [ ReactiveFormsModule, ToastLocal, FieldError],
  templateUrl: './form-usuario.html',
  styleUrl: './form-usuario.css'
})
export class FormUsuario {
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);
  private readonly fb = inject(FormBuilder);

  // inputs para configurar el formulario desde el componente padre
  titulo = input<string>('Editar Usuario');
  idUsuarioEditando = input<number | null>(null); 
  cargando = input<boolean>(false);
  usuario = input<Partial<UsuarioPost> | null>(null); 
  cancelUrl = input<string>('/admin/usuarios');

  // output para emitir los datos del formulario al componente padre
  save = output<UsuarioPost>();

  form = this.fb.group({
    username:  ['', Validators.required],
    nombre:    ['', [Validators.required, Validators.minLength(3)]],
    apellidos: ['', [Validators.required, Validators.minLength(3)]],
    pass1: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/(?=.*[A-Z])(?=.*\d)/)
    ]],
    pass2:     ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    rol:       [''],
    telefono:  ['', [
      Validators.required,
      Validators.pattern(/^[0-9]{9,15}$/)]], 
    direccion: ['',[Validators.maxLength(200),Validators.minLength(5), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s,.-]*$/), Validators.required]],
    foto:      [null as string | File | null]
  }); 

  

  constructor() {
    effect(() => {
      if (this.idUsuarioEditando() !== null) {
        this.form.get('pass1')?.clearValidators();
        this.form.get('pass1')?.addValidators([Validators.minLength(6), Validators.pattern(/(?=.*[A-Z])(?=.*\d)/)]);
        this.form.get('pass2')?.clearValidators();
        this.form.get('pass1')?.updateValueAndValidity();
        this.form.get('pass2')?.updateValueAndValidity();
      }
    });

    effect(() => {
      const datosUsuario = this.usuario();
      if (datosUsuario) this.form.patchValue(datosUsuario);
    });
  }

  get puedeEditarRol(): boolean {
    return this.auth.isSuperAdmin() && this.auth.getUsuarioId() !== this.idUsuarioEditando();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.form.patchValue({ foto: file });
  }

  onCancel() {
    this.router.navigate([this.cancelUrl()]);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.cargando()) {
      const datos = this.form.getRawValue() as UsuarioPost;
      this.save.emit(datos);
    }
  }
}
