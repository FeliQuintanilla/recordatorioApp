import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth(); // Inicializar Firebase Auth

  constructor(private storage: Storage) {
    this.init();
  }

  // Inicializar almacenamiento local
  async init() {
    await this.storage.create();
  }

  // Método para registrar un nuevo usuario
  async register(email: string, password: string): Promise<UserCredential> {
    try {
      console.log('Intentando registrar usuario en Firebase...');
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      console.log('Usuario registrado exitosamente:', userCredential);
      return userCredential; // Devolver las credenciales del usuario registrado
    } catch (error) {
      console.error('Error en el registro de Firebase:', error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  }

  // Método para iniciar sesión
  async login(usernameOrEmail: string, password: string): Promise<boolean> {
    try {
      console.log('Intentando iniciar sesión...');
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        this.auth,
        usernameOrEmail,
        password
      );
      console.log('Inicio de sesión exitoso:', userCredential);

      // Guardar UID de Firebase en almacenamiento local
      await this.storage.set('firebaseUser', userCredential.user.uid);
      return true;
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      return false;
    }
  }

  // Obtener el correo del usuario autenticado
  async getUserEmail(): Promise<string | null> {
    const currentUser = this.auth.currentUser; // Obtiene el usuario actual
    if (currentUser) {
      return currentUser.email; // Devuelve el correo del usuario autenticado
    }
    return null; // Si no hay usuario autenticado, devuelve null
  }

  async getUsername(): Promise<string | null> {
    const currentUser = this.auth.currentUser; // Obtiene el usuario actual
    if (currentUser) {
      return currentUser.email || 'Usuario'; // Devuelve el correo como nombre de usuario
    }
    return null; // Si no hay usuario autenticado, devuelve null
  }

  // Verificar si el usuario está autenticado (local o Firebase)
  async isAuthenticated(): Promise<boolean> {
    const firebaseUser = await this.storage.get('firebaseUser');
    return !!firebaseUser; // Devuelve true si hay un UID almacenado
  }

  // Obtener el UID del usuario autenticado
  async getUserUid(): Promise<string | null> {
    const firebaseUser = await this.storage.get('firebaseUser');
    return firebaseUser;
  }

  // Método para cerrar sesión
  async logout() {
    try {
      console.log('Cerrando sesión...');
      await this.storage.remove('firebaseUser'); // Elimina el UID de Firebase del almacenamiento local
      console.log('Sesión cerrada exitosamente.');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
