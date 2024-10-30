import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';  // Importa AlertController
import { AuthService } from '../services/auth.service';  // Importa el servicio de autenticación

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(
    private navCtrl: NavController, 
    private authService: AuthService, 
    private alertController: AlertController  // Inyecta AlertController
  ) {}

  // Método para manejar el login
  async login() {
    const success = await this.authService.login(this.username, this.password);
    if (success) {
      this.navCtrl.navigateForward('/home');  // Navega a la página principal si el login es exitoso
    } else {
      this.presentLoginError();  // Muestra el mensaje de error
    }
  }

  // Mostrar alerta de error de login
  async presentLoginError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Credenciales incorrectas. Por favor, verifica tu nombre de usuario y contraseña.',
      buttons: ['OK']
    });

    await alert.present();
  }

  // Navegar a la página de restablecimiento de contraseña
  resetPassword() {
    this.navCtrl.navigateForward('/reset-password');
  }
}


