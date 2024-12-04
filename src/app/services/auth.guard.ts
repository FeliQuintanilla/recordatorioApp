import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';  // Importa el AuthService

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      const isAuthenticated = await this.authService.isAuthenticated();
      if (!isAuthenticated) {
        // Redirige al login si no está autenticado
        await this.router.navigate(['/login']);
        return false;
      }
      return true; // Permite el acceso si está autenticado
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      // En caso de error, redirige al login
      await this.router.navigate(['/login']);
      return false;
    }
  }
}
