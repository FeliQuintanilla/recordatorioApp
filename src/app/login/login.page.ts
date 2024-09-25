import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  // Define the username and password variables
  username: string = '';
  password: string = '';

  constructor(private navCtrl: NavController) {}

  login() {
    if (this.username === 'felipe' && this.password === '1234') {
      // Navegar a la página de inicio y pasar el nombre de usuario como parámetro
      this.navCtrl.navigateForward(`/home`, {
        queryParams: { username: this.username }
      });
    } else {
      alert('Invalido usario o contraseña');
    }
  }
  // Añade la función resetPassword aquí
  resetPassword() {
    this.navCtrl.navigateForward('/reset-password');
  }

}





