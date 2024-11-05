import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { Geolocation } from '@ionic-native/geolocation/ngx';  
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';  
import { Storage } from '@ionic/storage-angular';  
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Capacitor } from '@capacitor/core';

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
  isWeb: boolean;

  constructor(
    private geolocation: Geolocation,  
    private camera: Camera,  
    private storage: Storage,  
    private navCtrl: NavController,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {
    this.initStorage();
    this.isWeb = !Capacitor.isNativePlatform();
  }

  async initStorage() {
    await this.storage.create();
  }

  async ngOnInit() {
    const isAuthenticated = await this.authService.isAuthenticated();
    if (!isAuthenticated) {
      this.navCtrl.navigateRoot('/login');
    } else {
      this.getLocation();
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

  takePicture(fromGallery: boolean = false) {
    if (this.isWeb) {
      // Usa <input type="file"> para seleccionar imagen en el navegador
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      fileInput?.click();
    } else {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: fromGallery ? this.camera.PictureSourceType.PHOTOLIBRARY : this.camera.PictureSourceType.CAMERA
      };

      this.camera.getPicture(options).then((imageData) => {
        this.capturedImage = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
        console.error('Error al obtener la imagen', err);
      });
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.capturedImage = reader.result as string;
        this.cd.detectChanges(); // Forzar la actualización de la imagen en la vista
      };
      reader.readAsDataURL(file);
    }
  }

  async saveMemory() {
    const newMemory = {
      title: this.memoryTitle,
      description: this.memoryDescription,
      location: this.memoryLocation,
      image: this.capturedImage
    };

    let storedMemories = await this.storage.get('memories');
    if (!storedMemories) {
      storedMemories = [];
    }
    storedMemories.push(newMemory);
    await this.storage.set('memories', storedMemories);

    console.log('Recuerdo guardado:', newMemory);
    this.cd.detectChanges();
    this.navCtrl.navigateBack('/home');
  }
}

