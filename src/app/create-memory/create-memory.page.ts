import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';  // Para obtener la ubicación
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';  // Para capturar imágenes
import { Storage } from '@ionic/storage-angular';  // Para almacenar los recuerdos

@Component({
  selector: 'app-create-memory',
  templateUrl: './create-memory.page.html',
  styleUrls: ['./create-memory.page.scss'],
})
export class CreateMemoryPage implements OnInit {
  memoryTitle: string = '';  // Para almacenar el título del recuerdo
  memoryDescription: string = '';  // Para almacenar la descripción del recuerdo
  memoryLocation: string = 'Ubicación no disponible';  // Almacenar la ubicación del recuerdo
  capturedImage: string = '';  // Almacenar la imagen capturada

  constructor(
    private geolocation: Geolocation,  // Servicio para obtener la ubicación
    private camera: Camera,  // Servicio para capturar imágenes
    private storage: Storage  // Servicio para almacenar datos localmente
  ) {
    this.initStorage();  // Inicializar el almacenamiento al crear el componente
  }

  // Inicializa el almacenamiento de Ionic
  async initStorage() {
    await this.storage.create();
  }

  // Captura la ubicación actual del usuario
  ngOnInit() {
    this.getLocation();
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

  // Captura una imagen usando la cámara
  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      // Convertir la imagen capturada en base64 para mostrarla
      this.capturedImage = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.error('Error al capturar la imagen', err);
    });
  }

  // Guarda el recuerdo en el almacenamiento local
  saveMemory() {
    const newMemory = {
      title: this.memoryTitle,
      description: this.memoryDescription,
      location: this.memoryLocation,
      image: this.capturedImage
    };

    // Obtener los recuerdos guardados anteriormente y agregar el nuevo
    this.storage.get('memories').then((storedMemories) => {
      if (!storedMemories) {
        storedMemories = [];  // Si no hay recuerdos, inicializar como un array vacío
      }
      storedMemories.push(newMemory);  // Agregar el nuevo recuerdo
      this.storage.set('memories', storedMemories);  // Guardar los recuerdos actualizados
      console.log('Recuerdo guardado:', newMemory);
    });
  }
}





