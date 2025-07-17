import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Parcel } from '../../../interfaces/parcel';
import { ParcelService } from '../../../services/parce.service';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-parcel-details',
  standalone: true,
  templateUrl: './parcel-details.component.html',
  styleUrl: './parcel-details.component.css',
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class ParcelDetailsComponent implements OnInit {
  parcel?: Parcel;
  loading = true;
  map?: L.Map;
  pickupCoords?: [number, number];
  destinationCoords?: [number, number];

  constructor(
    private route: ActivatedRoute,
    private parcelService: ParcelService,
    // private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Parcel ID from route:', id);

    if (id) {
      this.parcelService.getParcelById(id).subscribe({
        next: (data) => {
          if (data) {
            this.parcel = data;
            this.getCoordinates();
          } else {
            console.error('Parcel not found');
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('❌ Failed to load parcel:', err);
          this.loading = false;
        }
      });
    } else {
      console.error('No Parcel ID provided');
      this.loading = false;
    }
  }

  getCoordinates(): void {
    if (!this.parcel?.pickupAddress || !this.parcel?.destination) {
      console.error('Parcel address missing');
      return;
    }
  
    const pickup = this.parcel.pickupAddress + ', Kenya';
    const destination = this.parcel.destination + ', Kenya';
  
    this.geocodeAddress(pickup).then(coords => {
      this.pickupCoords = coords;
      this.initMap(coords);
      L.marker(coords).addTo(this.map!)
        .bindPopup('Pickup Location')
        .openPopup();
    }).catch(err => console.error(err));
  
    this.geocodeAddress(destination).then(coords => {
      this.destinationCoords = coords;
      L.marker(coords).addTo(this.map!)
        .bindPopup('Destination');
    }).catch(err => console.error(err));
  }
  

  async geocodeAddress(address: string): Promise<[number, number]> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const response = await fetch(url);
    const results = await response.json();

    if (results.length === 0) {
      throw new Error(`Geocoding failed for ${address}`);
    }

    const { lat, lon } = results[0];
    return [parseFloat(lat), parseFloat(lon)];
  }

  initMap(center: [number, number]) {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView(center, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }
}
