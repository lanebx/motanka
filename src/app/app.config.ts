import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'motanka-store',
          appId: '1:201562882808:web:a63de28b2825b82377f10d',
          databaseURL:
            'https://motanka-store-default-rtdb.europe-west1.firebasedatabase.app',
          storageBucket: 'motanka-store.appspot.com',
          apiKey: 'AIzaSyCqh2XrVhdzC_KyueWbAMRuAeIbnG2GyWI',
          authDomain: 'motanka-store.firebaseapp.com',
          messagingSenderId: '201562882808',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideDatabase(() => getDatabase())),
  ],
};
