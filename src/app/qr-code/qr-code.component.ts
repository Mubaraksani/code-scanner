import { Component, ElementRef, EventEmitter, Output, VERSION, ViewChild } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { NotFoundException, Result } from '@zxing/library'
import { DeviceDetectorService } from 'ngx-device-detector';
import { BrowserMultiFormatReader } from '@zxing/library';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent {
  @ViewChild('next', { static: true }) next: ElementRef;
  @ViewChild('openDownloadModal', { static: true }) openDownloadModal: ElementRef;
  @ViewChild('openDownloadModalSafari', { static: true }) openDownloadModalSafari: ElementRef;
  @ViewChild('openStepOneHintModal', { static: true }) openStepOneHintModal: ElementRef;
  @Output('parentFun') parentFun: EventEmitter<any> = new EventEmitter();
  @Output('stepOne') stepOne: EventEmitter<any> = new EventEmitter();
  @ViewChild('scanner', {static: false}) 
  scanner: ZXingScannerComponent;
  myAngularxQrCode = 'hellowWorld'
  ngVersion = VERSION.full;

  @ViewChild('scanner')
  browserVersion: any
  deviceSelected: string;
  hasDevices: boolean;
  hasPermission: boolean;
  qrResultString: string ='';
  qrResult: Result;
  deviceInfo: any;
  availableDevices: MediaDeviceInfo[];
  deviceCurrent: MediaDeviceInfo;
  currentDevice: MediaDeviceInfo;
  tryHarder = false;
  data = [{
    'name': 'John Doe',
    'profile': 'Software Developer',
    'email': 'john@doe.com',
    'hobby': 'coding'
  }]
  dataToString = JSON.stringify(this.data);
  errorMessage: string = '';
  private codeReader: BrowserMultiFormatReader;
  
  constructor(
    private deviceService: DeviceDetectorService,) {
    this.codeReader = new BrowserMultiFormatReader()
     }
  ngOnInit(): void { }
  displayCameras(cameras: MediaDeviceInfo[]) {
    // console.debug('Devices: ', cameras);
    this.availableDevices = cameras;
  }

  handleQrCodeResult(resultString: string) {
    // console.debug('Result: ', resultString);
    this.qrResultString = resultString;
  }
  onDeviceSelectChange(selected: string) {
    const selectedStr = selected || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    const device = this.availableDevices.find(x => x.deviceId === selected);
    // this.deviceCurrent = device || null;
  }

  onDeviceChange(device: MediaDeviceInfo) {
    const selectedStr = (device && device.deviceId) ? device.deviceId : '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || null;
  }

  onHasPermission(has: boolean) {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.hasPermission = has;
    if (navigator.mediaDevices.getUserMedia == undefined) {
      // console.log('Your browser does not support navigator.mediaDevices.getUserMedia');
      // console.log(this.deviceInfo);
      this.browserVersion = this.deviceInfo.browser_version;
      // console.log(this.browserVersion);
      if (this.deviceInfo.os == "iOS" && this.deviceInfo.browser == "Chrome") {
        setTimeout(() => {
          this.openDownloadModal.nativeElement.click();
        }, 200)
      }
      // For Safari
      if (this.deviceInfo.os == "iOS" && this.deviceInfo.browser == "Safari") {
        setTimeout(() => {
          this.openDownloadModalSafari.nativeElement.click();
        }, 200)
      }
    }
  }
  onCamerasFound(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  toggleTryHarder(): void {
    this.tryHarder = !this.tryHarder;
  }
  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    console.log(this.qrResultString)
    if(this.scanner){
      this.scanner.scanStop();
    } else {
      this.scanner.scanStart();
    }
    // this.deviceCurrent = null;
  }
  onImageselected(event: Event) {    
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.scanner.scanStop();
      let imageFile = inputElement.files[0];
      this.decodeQRCodeFromImage(imageFile);
      /** Display the selected image in the <img> tag*/
      // const selectedImageElement = document.getElementById('selectedImage') as HTMLImageElement;
      // selectedImageElement.src = URL.createObjectURL(imageFile);
    }
  }
  decodeQRCodeFromImage(imageFile) {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);

    reader.onload = async (event) => {
      const imageElement = new Image();
      imageElement.src = event.target.result as string;
      imageElement.onload = async () => {
        const codeReader = new BrowserMultiFormatReader();
        try {
          const result = await codeReader.decode(imageElement);
          if (result) {
            this.onCodeResult(result.getText());
          } else {
            this.displayErrorMessage('No QR code found in the selected image.');
          }
        } catch (error) {
          if (error instanceof NotFoundException) {
            // Handle NotFoundException (QR code not found)
            this.displayErrorMessage('No QR code found in the selected image.');
          } else {
            // Handle other errors
            console.error('Error decoding QR code:', error);
            this.displayErrorMessage('An error occurred while decoding the QR code.');
          }
        }
      };
    };
  }
  // Function to display error messages
  displayErrorMessage(message: string) {
    setTimeout(() => {
      this.errorMessage = message;
    }, 3000);
    this.qrResultString = '';
    // You can choose how to display this message in your HTML template.
  }

  // Function to clear error messages
  clearErrorMessage() {
    this.errorMessage = '';
  }

  // Function to retry scanning
  retryScanning() {
    this.clearErrorMessage();
    if (this.scanner) {
      this.scanner.scanStart();
    }
  }
}
