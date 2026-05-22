import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario';
import { UsuarioCard } from '../../../shared/components/usuario-card/usuario-card';
import { Usuario } from '../../../core/models/usuario';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';

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
}
