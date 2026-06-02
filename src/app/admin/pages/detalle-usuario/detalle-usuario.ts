import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario';
import { UsuarioCard } from '../../../shared/components/usuario-card/usuario-card';
import { Usuario } from '../../../core/models/usuario';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { Auth } from '../../../auth/services/auth';
import { Toast } from '../../../core/services/toast';


@Component({
  selector: 'app-detalle-usuario',
  imports: [UsuarioCard, ToastLocal],
  templateUrl: './detalle-usuario.html',
  styleUrl: './detalle-usuario.css',
  standalone: true
})
export class DetalleUsuario implements OnInit {

  private route = inject(ActivatedRoute);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private auth = inject(Auth);
  private toast = inject(Toast);
  
  mostrarModal = signal(false);
  usuario = signal<Usuario | null>(null);
  cargando = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.usuarioService.buscar(id).subscribe({
      next: (u) => {
        this.usuario.set(u);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  volver(): void {
    this.router.navigate(['/admin/usuarios']);
  }

  confirmarBorrado(): void {
    this.mostrarModal.set(true);
  }

  cancelar(): void {
    this.mostrarModal.set(false);
  }

  eliminar(): void {
    if (!this.auth.isSuperAdmin()) {
      this.toast.mostrar('Acceso denegado: solo SuperAdministradores', 'error');
      this.mostrarModal.set(false);
      return;
    }
    const u = this.usuario();
    if (!u) return;

    this.usuarioService.eliminar(u.id).subscribe({ 
      next: () => {
        this.mostrarModal.set(false);
        this.router.navigate(['/admin/usuarios']);
      },
      error: () => this.mostrarModal.set(false)
    });
  }
}
