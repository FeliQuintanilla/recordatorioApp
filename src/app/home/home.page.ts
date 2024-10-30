import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';  // Importa AuthService
import { Storage } from '@ionic/storage-angular';  // Para cargar y eliminar los recuerdos almacenados
import { NavController, AlertController } from '@ionic/angular';  // Importa NavController y AlertController

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  username: string = '';  // Propiedad para almacenar el nombre de usuario
  memories: any[] = [];  // Para almacenar los recuerdos guardados

  constructor(
    private authService: AuthService, 
    private storage: Storage, 
    private navCtrl: NavController,  // Inyecta NavController para redirigir
    private alertController: AlertController  // Inyecta AlertController para mostrar la confirmación y errores
  ) {}

  async ngOnInit() {
    // Cargar el nombre de usuario desde el almacenamiento local usando AuthService
    this.username = await this.authService.getUsername() || 'Invitado';

    // Cargar los recuerdos almacenados
    await this.loadMemories();
  }

  // Función para cargar los recuerdos desde el almacenamiento local
  async loadMemories() {
    try {
      const storedMemories = await this.storage.get('memories');
      if (storedMemories) {
        this.memories = storedMemories;  // Asignar los recuerdos almacenados al array memories
      }
    } catch (error) {
      this.presentErrorAlert();  // Si ocurre un error, mostrar alerta
    }
  }

  // Eliminar un recuerdo
  async deleteMemory(index: number) {
    this.memories.splice(index, 1);  // Elimina el recuerdo del array
    await this.storage.set('memories', this.memories);  // Actualiza el almacenamiento
  }

  // Mostrar una alerta de error si no se pueden cargar los recuerdos
  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Hubo un problema al cargar los recuerdos. Inténtalo de nuevo más tarde.',
      buttons: ['OK']
    });
    await alert.present();
  }

  // Mostrar un mensaje de confirmación para cerrar sesión
  async presentLogoutConfirmation() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Logout cancelado');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.logout();  // Llama al método logout si confirma
          }
        }
      ]
    });

    await alert.present();
  }

  // Método para cerrar sesión (logout)
  async logout() {
    await this.authService.logout();  // Llama al método logout del AuthService
    this.navCtrl.navigateRoot('/login');  // Redirige al usuario a la página de login
  }
}
