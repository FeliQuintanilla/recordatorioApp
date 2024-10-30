import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';  // Importa el servicio

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  username: string = '';  // Propiedad para almacenar el nombre de usuario

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    // Cargar el nombre de usuario desde el almacenamiento local usando AuthService
    this.username = await this.authService.getUsername() || 'Invitado';
  }
}


