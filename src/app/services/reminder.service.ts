import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private apiUrl = 'https://api.tuapp.com/reminders';  // URL de la API

  constructor(private http: HttpClient) {}

  // Obtener todos los recordatorios con manejo de errores
  getReminders(): Observable<any> {
    return this.http.get(`${this.apiUrl}`).pipe(
      catchError(this.handleError)  // Manejo de errores
    );
  }

  // Agregar un nuevo recordatorio con manejo de errores
  addReminder(reminder: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, reminder).pipe(
      catchError(this.handleError)  // Manejo de errores
    );
  }

  // Eliminar un recordatorio con manejo de errores
  deleteReminder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)  // Manejo de errores
    );
  }

  // Método para manejar errores
  private handleError(error: any) {
    console.error('Error en la API:', error);  // Imprime el error en la consola
    return throwError(() => new Error('Error en la comunicación con la API, por favor intenta de nuevo más tarde.'));
  }
}
