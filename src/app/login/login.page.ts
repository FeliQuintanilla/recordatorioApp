import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';  // Cambiado de username a email
  password: string = '';

  constructor(
    private navCtrl: NavController, 
    private authService: AuthService, 
    private alertController: AlertController
  ) {}

  // Método para manejar el login
  async login() {
    try {
      const success = await this.authService.login(this.email, this.password);  // Cambiado username a email
      if (success) {
        this.navCtrl.navigateForward('/home');  // Navega a la página principal si el login es exitoso
      }
    } catch (error) {
      this.presentLoginError();  // Muestra el mensaje de error
    }
  }

  // Mostrar alerta de error de login
  async presentLoginError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Credenciales incorrectas. Por favor, verifica tu correo electrónico y contraseña.',
      buttons: ['OK']
    });

    await alert.present();
  }

  // Navegar a la página de restablecimiento de contraseña
  resetPassword() {
    this.navCtrl.navigateForward('/reset-password');
  }
}

