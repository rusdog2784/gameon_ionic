import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GameOnProvider {
  api_path:string = 'http://localhost:5000/';
  data:any;

  constructor(public http: Http) {
    console.log('[game-on.ts]: GameOnProvider initiated.');
    this.data = null;
  }

  getAllGames() {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.http.get(this.api_path + 'games').map(res => res.json()).subscribe(data => {
        this.data = data;
        resolve(this.data);
      });
    });
  }

}
