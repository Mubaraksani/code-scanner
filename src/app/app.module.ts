import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { FormsModule } from '@angular/forms';
import { ZXingScannerModule } from "@zxing/ngx-scanner";
import { QRCodeModule } from 'angular2-qrcode';
import { NgxQrscannerComponent } from './ngx-qrscanner/ngx-qrscanner.component';
import { LOAD_WASM, NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
LOAD_WASM().subscribe((res: any) => console.log('LOAD_WASM', res))
@NgModule({
  declarations: [
    AppComponent,
    QrCodeComponent,
    NgxQrscannerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ZXingScannerModule,
    NgxScannerQrcodeModule
    
  ],
  schemas:[NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  providers: [QRCodeModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
