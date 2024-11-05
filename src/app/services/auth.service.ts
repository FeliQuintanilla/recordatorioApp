import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { getAuth, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth();

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  // Método de login que soporta autenticación local y Firebase
  async login(usernameOrEmail: string, password: string): Promise<boolean> {
    // Si es el usuario local
    if (usernameOrEmail === 'admin' && password === '1234') {
      await this.storage.set('username', usernameOrEmail);
      return true;
    }
    
    // Si es un correo electrónico, intenta con Firebase
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(this.auth, usernameOrEmail, password);
      await this.storage.set('firebaseUser', userCredential.user.uid);  // Guarda el UID de Firebase en local storage
      return true;
    } catch (error) {
      console.error('Error en inicio de sesión de Firebase', error);
      return false;
    }
  }

  // Verificar si el usuario está autenticado (local o Firebase)
  async isAuthenticated(): Promise<boolean> {
    const username = await this.storage.get('username');
    const firebaseUser = await this.storage.get('firebaseUser');
    return !!username || !!firebaseUser;  // Devuelve true si hay autenticación local o de Firebase
  }

  // Obtener el nombre de usuario local o el UID de Firebase
  async getUsername(): Promise<string | null> {
    const username = await this.storage.get('username');
    const firebaseUser = await this.storage.get('firebaseUser');
    return username || firebaseUser;
  }

  // Método para cerrar sesión (logout) para ambos métodos
  async logout() {
    await this.storage.remove('username');  // Elimina el usuario local
    await this.storage.remove('firebaseUser');  // Elimina el UID de Firebase
  }
}
