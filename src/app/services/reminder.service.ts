import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private apiUrl = 'https://api.tuapp.com/reminders';  // URL de la API

  constructor(private http: HttpClient) {}

  // Obtener todos los recordatorios
  getReminders(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Agregar un nuevo recordatorio
  addReminder(reminder: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, reminder);
  }

  // Eliminar un recordatorio
  deleteReminder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
