import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  username: string = 'Felipe'; // Nombre del usuario dinámico
  isAddingReminder: boolean = false; // Controla si se muestra el campo para agregar recordatorios
  newReminderTitle: string = ''; // Almacena el título del nuevo recordatorio
  reminders: { id: number, title: string }[] = []; // Lista de recordatorios

  constructor(private navCtrl: NavController) {}

  // Muestra u oculta el campo para agregar un recordatorio
  toggleAddReminder() {
    this.isAddingReminder = !this.isAddingReminder;
  }

  // Guarda el nuevo recordatorio
  saveReminder() {
    if (this.newReminderTitle.trim().length > 0) {
      const newReminder = {
        id: this.reminders.length + 1,
        title: this.newReminderTitle
      };
      this.reminders.push(newReminder); // Agrega el recordatorio a la lista
      this.newReminderTitle = ''; // Limpia el campo de texto
      this.isAddingReminder = false; // Oculta el formulario de agregar recordatorio
    } else {
      alert('Por favor, ingresa un título para el recordatorio.');
    }
  }
}

