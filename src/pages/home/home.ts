import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { CreateGamePage } from '../createGame/createGame';

import { GameOnProvider } from '../../providers/game-on/game-on';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement:ElementRef;
  listSports:boolean = false;
  map:any;
  data:any;

  constructor(public navCtrl: NavController, public geolocation: Geolocation, private provider: GameOnProvider) {
    this.provider.getAllGames().then(data => {
      this.data = data;
      console.log(this.data);
    });
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      
      let mapOptions = {
        center: latLng,
        zoom: 14,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
  
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.addMarkers();
    }, (err) => {
      console.error(err);
    });
  }

  addMarkers() {
    for (let d of this.data) {
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(d["location_lat"], d["location_long"])
      });
  
      let content = "<h2>" + d["title"] + "</h2>" + "<p>" + d["type"] + "</p>";
  
      this.addInfoWindow(marker, content);
    }
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    })
  }

  //FLOATING ACTION BUTTON FUNCTIONS
  myLocation() {
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.map.panTo(latLng);
    }, (err) => {
      console.error(err);
    });
  }

  toggleSportsList() {
    this.listSports = !this.listSports;
  }

  goToCreateGame() {
    this.navCtrl.push(CreateGamePage);
  }

  goToProfile() {

  }
}
