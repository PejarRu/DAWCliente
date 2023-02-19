import {
  Directive,
  Input,
  OnChanges, SimpleChanges
} from '@angular/core';
import Graphic from '@arcgis/core/Graphic';
import { ArcgisMapComponent } from '../arcgis-map/arcgis-map.component';
import { LoadArcgisMapsService } from '../load-arcgis-maps.service';

@Directive({
  selector: 'arcgis-marker',
  standalone: true,
})
export class ArcgisMarkerDirective implements OnChanges {
  marker!: Graphic;
  @Input() coords!: [number, number];
  @Input() color: string = 'red';

  constructor(
    private readonly map: ArcgisMapComponent,
    private readonly loadMaps: LoadArcgisMapsService
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['coords'].isFirstChange()) { // First time, generate the marker
      this.map.mapViewLoad$.subscribe((mapView) => {
        this.loadMaps
          .getMarker(
            mapView,
            {
              latitude: this.coords[1],
              longitude: this.coords[0],
            },
            this.color
          )
          .then((marker) => {
            this.marker = marker;
            this.updateMarker(); // Maybe coords have changed while loading
          });
      });
    } else if (changes['coords'].currentValue !== changes['coords'].previousValue) {
      this.updateMarker();
    }

    if (changes['color']?.currentValue !== changes['color']?.previousValue) {
      this.marker?.symbol?.color.setColor(this.color);
    }
  }

  private async updateMarker() {
    if(this.marker) {
      const { Point } = await import('@arcgis/core/geometry');
      this.marker.geometry = new Point({
        latitude: this.coords[1],
        longitude: this.coords[0]
      });
    }
  }
}
