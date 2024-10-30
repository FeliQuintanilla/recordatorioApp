import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';  // Importa el controlador de alertas

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  email: string = '';
  emailError: boolean = false;

  constructor(private navCtrl: NavController, private alertController: AlertController) {}

  // Valida si el email tiene un formato correcto
  validateEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  // Lógica de restablecimiento de contraseña
  async resetPassword() {
    if (!this.validateEmail(this.email)) {
      this.emailError = true;  // Mostrar el mensaje de error
      this.presentAlert('Error', 'Por favor, ingresa un correo electrónico válido.');
    } else {
      this.emailError = false;

      // Simular el envío del correo
      await this.presentAlert('Correo Enviado', 'Te hemos enviado un correo para restablecer tu contraseña.');

      // Redirigir al login después de cerrar la alerta
      this.navCtrl.navigateBack('/login');
    }
  }

  // Función para mostrar alertas
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}




