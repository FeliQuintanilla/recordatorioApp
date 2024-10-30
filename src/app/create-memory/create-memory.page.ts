import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';  
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';  
import { Storage } from '@ionic/storage-angular';  
import { NavController } from '@ionic/angular';  // Importa NavController
import { AuthService } from '../services/auth.service';  // Importa AuthService

@Component({
  selector: 'app-create-memory',
  templateUrl: './create-memory.page.html',
  styleUrls: ['./create-memory.page.scss'],
})
export class CreateMemoryPage implements OnInit {
  memoryTitle: string = '';  
  memoryDescription: string = '';  
  memoryLocation: string = 'Ubicación no disponible';  
  capturedImage: string = '';  

  constructor(
    private geolocation: Geolocation,  
    private camera: Camera,  
    private storage: Storage,  
    private navCtrl: NavController,  // Inyecta NavController
    private authService: AuthService,  // Inyecta AuthService para la verificación
    private cd: ChangeDetectorRef  // Inyecta ChangeDetectorRef para forzar la detección de cambios
  ) {
    this.initStorage();  
  }

  async initStorage() {
    await this.storage.create();
  }

  async ngOnInit() {
    // Verificar si el usuario está autenticado
    const isAuthenticated = await this.authService.isAuthenticated();
    if (!isAuthenticated) {
      this.navCtrl.navigateRoot('/login');  // Redirige al login si no está autenticado
    } else {
      this.getLocation();  // Si está autenticado, continúa obteniendo la ubicación
    }
  }

  getLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      const lat = resp.coords.latitude;
      const lon = resp.coords.longitude;
      this.memoryLocation = `Latitud: ${lat}, Longitud: ${lon}`;
    }).catch((error) => {
      console.log('Error obteniendo ubicación', error);
    });
  }

  // Método para capturar una imagen o seleccionar de la galería
  takePicture(fromGallery: boolean = false) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: fromGallery ? this.camera.PictureSourceType.PHOTOLIBRARY : this.camera.PictureSourceType.CAMERA  // Selecciona fuente
    };

    this.camera.getPicture(options).then((imageData) => {
      this.capturedImage = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.error('Error al obtener la imagen', err);
    });
  }

  // Guarda el recuerdo y navega de vuelta al home
  async saveMemory() {
    const newMemory = {
      title: this.memoryTitle,
      description: this.memoryDescription,
      location: this.memoryLocation,
      image: this.capturedImage
    };

    // Guardar el recuerdo en el almacenamiento local
    let storedMemories = await this.storage.get('memories');
    if (!storedMemories) {
      storedMemories = [];
    }
    storedMemories.push(newMemory);
    await this.storage.set('memories', storedMemories);

    console.log('Recuerdo guardado:', newMemory);

    // Fuerza la detección de cambios
    this.cd.detectChanges();

    // Redirige al home después de guardar el recuerdo
    this.navCtrl.navigateBack('/home');
  }
}
