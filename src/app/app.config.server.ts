// src/app/app.config.server.ts
import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { appConfig } from './app.config';
import { provideServerRendering } from '@angular/platform-server';

const serverOnlyConfig: ApplicationConfig = {
  providers: [provideServerRendering()],
};

export const appConfigServer: ApplicationConfig = mergeApplicationConfig(
  appConfig,
  serverOnlyConfig,
);
