import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';  // Importa Geolocation
import { Camera } from '@ionic-native/camera/ngx';  // Importa Camera
import { IonicStorageModule } from '@ionic/storage-angular';  // Importa Ionic Storage

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonicStorageModule.forRoot()  // Inicializa Ionic Storage
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation,  // Añade Geolocation como proveedor
    Camera  // Añade Camera como proveedor
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

