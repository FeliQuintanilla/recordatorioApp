import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage-angular';
import { NavController, AlertController } from '@ionic/angular';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  username: string = ''; // Nombre de usuario autenticado
  memories: any[] = []; // Lista de recuerdos
  userEmail: string = ''; // Correo del usuario autenticado

  constructor(
    private authService: AuthService,
    private storage: Storage,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    try {
      // Obtener el nombre de usuario y correo electrónico
      this.username = (await this.authService.getUsername()) || 'Invitado';
      this.userEmail = (await this.authService.getUserEmail()) || 'correo@ejemplo.com';
      // Cargar los recuerdos guardados
      await this.loadMemories();
    } catch (error) {
      console.error('Error al inicializar la página:', error);
      this.presentErrorAlert();
    }
  }

  // Cargar los recuerdos desde el almacenamiento
  async loadMemories() {
    try {
      const storedMemories = await this.storage.get('memories');
      this.memories = storedMemories || [];
    } catch (error) {
      console.error('Error al cargar los recuerdos:', error);
      this.presentErrorAlert();
    }
  }

  // Eliminar un recuerdo
  async deleteMemory(index: number) {
    this.memories.splice(index, 1);
    await this.storage.set('memories', this.memories);
  }

  // Mostrar alerta de error al cargar recuerdos
  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Hubo un problema al cargar los recuerdos. Inténtalo de nuevo más tarde.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Confirmación para cerrar sesión
  async presentLogoutConfirmation() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => this.logout(),
        },
      ],
    });

    await alert.present();
  }

  // Cerrar sesión
  async logout() {
    await this.authService.logout();
    this.navCtrl.navigateRoot('/login');
  }

  // Enviar correo con EmailJS
  async sendEmail(memory: any) {
    const emailParams = {
      to_email: this.userEmail, // Correo del usuario autenticado
      title: memory.title,
      description: memory.description,
      location: memory.location,
      message: `
        Recuerdo enviado desde mi aplicación móvil:
        
        Título: ${memory.title}
        Descripción: ${memory.description}
        Ubicación: ${memory.location}
        
        Gracias por usar nuestra app.
      `,
    };

    try {
      // Enviar correo usando EmailJS
      const response = await emailjs.send(
        'service_5om2f0g', // Service ID
        'template_s6uwtdp', // Template ID
        emailParams,
        'Ijne0g17sIAx2-AUI' // User ID
      );

      console.log('Correo enviado exitosamente:', response.status, response.text);
      this.presentSuccessAlert(); // Mostrar éxito
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      this.presentErrorAlertEmail(); // Mostrar error
    }
  }

  // Mostrar alerta de éxito
  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'El correo fue enviado exitosamente.',
      buttons: ['Aceptar'],
    });
    await alert.present();
  }

  // Mostrar alerta de error al enviar correo
  async presentErrorAlertEmail() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Hubo un problema al enviar el correo. Por favor, intenta nuevamente.',
      buttons: ['Aceptar'],
    });
    await alert.present();
  }
}
