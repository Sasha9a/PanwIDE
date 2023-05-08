import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import 'reflect-metadata';
import { AppComponent } from './app/core/app.component';
import { APP_CONFIG } from './environments/environment';

if (APP_CONFIG.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(withInterceptorsFromDi()), provideAnimations()]
}).catch(console.error);
