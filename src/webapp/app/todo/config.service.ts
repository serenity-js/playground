import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConfigService {
    private config;

    constructor(private http: HttpClient) { }

    load() {
        return this.http.get('/api/config')
            .toPromise()
            .then(data => {
                this.config = data;
            });
    }

    get(key: string): string {
        return this.config[key];
    }
}
