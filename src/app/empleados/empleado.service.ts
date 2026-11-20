import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private http = inject(HttpClient);
  private baseUrl = 'http://18.191.21.84:8080/api/empleados';

  obtenerEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.baseUrl);
  }

  obtenerEmpleadoPorId(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.baseUrl}/${id}`);
  }

  agregarEmpleado(empleado: Empleado): Observable<Empleado> {
    const { idEmpleado, ...nuevo } = empleado;
    return this.http.post<Empleado>(this.baseUrl, nuevo);
  }

  editarEmpleado(id: number, empleado: Partial<Empleado>): Observable<Empleado> {
    const { idEmpleado, ...datos } = empleado;
    return this.http.put<Empleado>(`${this.baseUrl}/${id}`, datos);
  }

  eliminarEmpleado(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}