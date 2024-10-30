import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';  // Importa el servicio de autenticación

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(private navCtrl: NavController, private authService: AuthService) {}

  async login() {
    const success = await this.authService.login(this.username, this.password);
    if (success) {
      this.navCtrl.navigateForward('/home');  // Navega a la página principal si el login es exitoso
    } else {
      alert('Credenciales incorrectas');
    }
  }

  resetPassword() {
    this.navCtrl.navigateForward('/reset-password');
  }
}



