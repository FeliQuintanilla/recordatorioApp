import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';  // Asegúrate de importar esto
import { HomePageRoutingModule } from './home-routing.module';  // Este es tu archivo de rutas

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,  // Es necesario para los componentes de Ionic
    HomePageRoutingModule  // Ruta específica para el módulo de Home
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
