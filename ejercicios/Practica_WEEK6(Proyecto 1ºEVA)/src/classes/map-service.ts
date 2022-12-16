import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import { Point } from "@arcgis/core/geometry";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import esriConfig from "@arcgis/core/config";
import Search from "@arcgis/core/widgets/Search";
import { ARCGIS_TOKEN } from "../constants";

export class MapService {
    private mapView: MapView = null;
    private search: Search = null;

    private constructor(
        private coords: { latitude: number; longitude: number },
        private divMapId: string
    ) {}

    static createMapService(
        coords: { latitude: number; longitude: number },
        divMapId: string
    ): MapService {
        const mapService = new MapService(coords, divMapId);

        esriConfig.apiKey = ARCGIS_TOKEN;

        const map = new Map({ basemap: "osm-streets-relief" });
        mapService.mapView = new MapView({
            map: map,
            center: [coords.longitude, coords.latitude], // Longitude, latitude
            zoom: 15, // Zoom level
            container: divMapId, // Div element (id)
        });

        return mapService;
    }

    getMapView(): MapView {
        return this.mapView;
    }

    createMarker(
        coords: { latitude: number; longitude: number },
        color = "red"
    ): Graphic {
        const pointGraphic = new Graphic({
            geometry: new Point({
                longitude: coords.longitude,
                latitude: coords.latitude,
            }),
            symbol: new SimpleMarkerSymbol({
                color: color,
            }),
        });

        // Add the graphics to the view's graphics layer
        this.mapView.graphics.add(pointGraphic);

        return pointGraphic;
    }

    getSearch(): Search {
        if (this.search !== null) return this.search;

        this.search = new Search({  //Add Search widget
            view: this.mapView,
            popupEnabled: false
        });
        this.mapView.ui.add(this.search, "top-right");

        return this.search ;
    }
}
