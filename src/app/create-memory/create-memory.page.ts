import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage-angular';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Capacitor } from '@capacitor/core';
import { HttpClient } from '@angular/common/http'; // Importación para solicitudes HTTP

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

  // Tu API Key de LocationIQ
  private apiKey: string = 'pk.7a3b067a566ca77d3ed654acd8a6f036';

  constructor(
    private geolocation: Geolocation,
    private camera: Camera,
    private storage: Storage,
    private navCtrl: NavController,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private alertController: AlertController,
    private http: HttpClient // Agregado para solicitudes HTTP
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

      // Llama al método para obtener dirección
      this.getAddressFromCoordinates(lat, lon).then((address) => {
        this.memoryLocation = address; // Actualizar la ubicación con la dirección obtenida
      });
    }).catch((error) => {
      console.log('Error obteniendo ubicación', error);
      this.memoryLocation = 'Ubicación no disponible';
    });
  }

  async getAddressFromCoordinates(lat: number, lon: number): Promise<string> {
    const url = `https://us1.locationiq.com/v1/reverse.php?key=${this.apiKey}&lat=${lat}&lon=${lon}&format=json`;
    try {
      const response: any = await this.http.get(url).toPromise();
      if (response && response.display_name) {
        return response.display_name; // Retorna la dirección
      } else {
        return 'Dirección no encontrada';
      }
    } catch (error) {
      console.error('Error obteniendo dirección:', error);
      return 'Error obteniendo dirección';
    }
  }

  takePicture(fromGallery: boolean = false) {
    if (this.isWeb) {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      fileInput?.click();
    } else {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: fromGallery ? this.camera.PictureSourceType.PHOTOLIBRARY : this.camera.PictureSourceType.CAMERA,
      };

      this.camera.getPicture(options).then(
        (imageData) => {
          this.capturedImage = 'data:image/jpeg;base64,' + imageData;
        },
        (err) => {
          console.error('Error al obtener la imagen', err);
        }
      );
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.capturedImage = reader.result as string;
        this.cd.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  async saveMemory() {
    const newMemory = {
      title: this.memoryTitle,
      description: this.memoryDescription,
      location: this.memoryLocation,
      image: this.capturedImage,
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

  // Método para mostrar confirmación de cierre de sesión
  async presentLogoutConfirmation() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cierre de sesión cancelado');
          },
        },
        {
          text: 'Confirmar',
          handler: async () => {
            await this.authService.logout();
            this.navCtrl.navigateRoot('/login');
          },
        },
      ],
    });

    await alert.present();
  }
}
