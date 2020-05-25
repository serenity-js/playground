import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { TodoComponent } from './todo/todo.component';
import { AppComponent } from './app.component';
import { ConfigService } from './todo/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InMemoryStorageService, LocalStorageService, StorageService } from './todo/storage';

const routes: Routes = [
    { path: '', component: TodoComponent, pathMatch: 'full' },
    { path: ':filter', component: TodoComponent },
];

const appInitializerFn = (config: ConfigService) =>
    () => config.load();

export function storageServiceFactory(config: ConfigService, http: HttpClient) {
    console.log({http});

    switch (config.get('storage')) {
        case 'LocalStorageService':
            return new LocalStorageService();

        case 'InMemoryStorageService':
            return new InMemoryStorageService();

        default:
            throw new Error(`"${ config.get('storage') }" is not defined. Maybe a configuration error?`);
    }
}

@NgModule({
    declarations: [
        AppComponent,
        TodoComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot(routes, { useHash: true }),
    ],
    providers: [
        ConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFn,
            multi: true,
            deps: [ ConfigService ],
        },
        {
            provide: StorageService,
            useFactory: storageServiceFactory,
            deps: [ ConfigService, HttpClient ]}
    ],
    bootstrap: [ AppComponent ],
})
export class AppModule {
}
