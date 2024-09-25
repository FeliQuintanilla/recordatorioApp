import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {

  constructor(private navCtrl: NavController) {}

  // Método para manejar el restablecimiento de contraseña
  resetPassword() {
    alert('Se ha enviado un correo para restablecer tu contraseña');
    // Aquí puedes implementar la lógica para enviar el correo de restablecimiento
  }
}


