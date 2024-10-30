import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';  // Importa IonicModule

import { CreateMemoryPageRoutingModule } from './create-memory-routing.module';
import { CreateMemoryPage } from './create-memory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,  // Asegúrate de importar IonicModule
    CreateMemoryPageRoutingModule
  ],
  declarations: [CreateMemoryPage]
})
export class CreateMemoryPageModule {}
