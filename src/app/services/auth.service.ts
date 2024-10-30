import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';  // Importa Ionic Storage

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();  // Inicializar el almacenamiento
  }

  // Método de login simulado
  async login(username: string, password: string): Promise<boolean> {
    if (username === 'admin' && password === '1234') {
      await this.storage.set('username', username);
      return true;
    } else {
      return false;
    }
  }

  // Verificar si el usuario está autenticado
  async isAuthenticated(): Promise<boolean> {
    const username = await this.storage.get('username');
    return !!username;  // Devuelve true si el usuario está autenticado (si hay un username guardado)
  }

  // Obtener el nombre de usuario
  async getUsername(): Promise<string | null> {
    return await this.storage.get('username');
  }

  // Método para cerrar sesión (logout)
  async logout() {
    await this.storage.remove('username');
  }
}