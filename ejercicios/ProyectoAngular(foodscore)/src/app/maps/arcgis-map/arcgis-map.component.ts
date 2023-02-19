import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadArcgisMapsService } from '../load-arcgis-maps.service';
import MapView from '@arcgis/core/views/MapView';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'arcgis-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './arcgis-map.component.html',
  styleUrls: ['./arcgis-map.component.css'],
})
export class ArcgisMapComponent implements OnChanges, AfterViewInit {
  @Input() coords!: [number, number];
  @ViewChild('map') mapDiv!: ElementRef;
  mapViewLoad$ = new ReplaySubject<MapView>(1);
  mapView!: MapView;

  constructor(private readonly loadMaps: LoadArcgisMapsService) {}

  ngAfterViewInit(): void {
    this.loadMaps
    .getMapView(this.mapDiv.nativeElement, {
      latitude: this.coords[1],
      longitude: this.coords[0],
    })
    .then((mapView) => {
      this.mapView = mapView;
      this.mapView.goTo({center: this.coords}); // Maybe coords have changed while loading the map
      this.mapViewLoad$.next(mapView);
      this.mapViewLoad$.complete();
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mapView) {
      this.mapView.goTo({center: this.coords});
    }
  }
}
