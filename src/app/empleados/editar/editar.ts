import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Empleado } from '../../empleado';
import { EmpleadoService } from '../empleado.service';

@Component({
  selector: 'app-editar',
  imports: [FormsModule, RouterLink],
  templateUrl: './editar.html',
  styleUrl: './editar.css'
})
export class EditarComponent implements OnInit {
  private empleadoService = inject(EmpleadoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  id = 0;
  cargando = true;
  guardando = false;
  error = '';

  empleado: Empleado = {
    idEmpleado: 0,
    nombre: '',
    departamento: '',
    sueldo: 0
  };

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = Number(idParam);
    if (!this.id) {
      this.error = 'ID inválido en la ruta.';
      this.cargando = false;
      this.cdr.detectChanges();
      return;
    }

    this.empleadoService.obtenerEmpleadoPorId(this.id).subscribe({
      next: (emp) => {
        this.empleado = { ...emp };
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error(e);
        this.error = 'No se pudo cargar el empleado. Verifica el backend.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    if (this.guardando || !this.id) return;
    this.guardando = true;
    this.error = '';

    // Omitimos idEmpleado del body porque en Marshmallow (schemas.py) es dump_only=True
    const { idEmpleado, ...payload } = this.empleado;

    this.empleadoService.editarEmpleado(this.id, payload as Empleado).subscribe({
      next: () => this.router.navigate(['/empleados']),
      error: (e) => {
        console.error(e);
        this.error = 'No se pudo guardar. Revisa el backend o los datos.';
        this.guardando = false;
        this.cdr.detectChanges();
      }
    });
  }
}