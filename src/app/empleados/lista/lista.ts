import { Component, inject, signal } from '@angular/core';
import { Empleado } from '../../empleado';
import { EmpleadoService } from '../empleado.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.html',
  styleUrl: './lista.css',
  imports: [CommonModule, RouterLink]
})
export class ListaComponent {
  empleados = signal<Empleado[]>([]);
  empleadoAEliminar = signal<Empleado | null>(null);
  eliminando = signal(false);
  private empleadoService = inject(EmpleadoService);

  constructor() {
    this.cargar();
  }

  cargar() {
    this.empleadoService.obtenerEmpleados().subscribe({
      next: (data) => this.empleados.set(data),
      error: (err) => console.error('Error cargando empleados', err)
    });
  }

  solicitarEliminar(empleado: Empleado) {
    this.empleadoAEliminar.set(empleado);
  }

  cancelarEliminar() {
    if (this.eliminando()) return;
    this.empleadoAEliminar.set(null);
  }

  confirmarEliminar() {
    const emp = this.empleadoAEliminar();
    if (!emp || this.eliminando()) return;

    this.eliminando.set(true);
    this.empleadoService.eliminarEmpleado(emp.idEmpleado).subscribe({
      next: () => {
        this.empleados.update((lista) =>
          lista.filter((item) => item.idEmpleado !== emp.idEmpleado)
        );
        this.eliminando.set(false);
        this.empleadoAEliminar.set(null);
      },
      error: (err) => {
        console.error('Error al eliminar empleado', err);
        this.eliminando.set(false);
      }
    });
  }
}