import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string = '';
  password: string = '';

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  async register() {
    if (!this.email || !this.password) {
      await this.showAlert('Aviso', 'Por favor, completa todos los campos.');
      return;
    }

    if (!this.isEmailValid(this.email)) {
      await this.showAlert('Aviso', 'Por favor, ingresa un correo válido.');
      return;
    }

    if (this.password.length < 6) {
      await this.showAlert('Aviso', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const userCredential = await this.authService.register(this.email, this.password);
      console.log('Usuario registrado:', userCredential);

      await this.showAlert('Éxito', '¡Usuario creado exitosamente! Ahora puedes iniciar sesión.');
      this.navCtrl.navigateBack('/login');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        await this.showAlert('Error', 'El correo ya está en uso. Por favor, utiliza otro correo o inicia sesión.');
      } else {
        await this.showAlert('Error', 'Error desconocido: ' + JSON.stringify(error));
      }
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  goToLogin() {
    this.navCtrl.navigateBack('/login');
  }

  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
