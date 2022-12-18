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
    ) { }

    static createMapService(
        coords: { latitude: number; longitude: number },
        divMapId: string
    ): MapService {
        const mapService = new MapService(coords, divMapId);

        esriConfig.apiKey = "AAPKc2940b004f38491b869000328dd73685GNKiJxJwOBscpCvz9Pxpae-LVDdvsqr_p6VDTqAas1Kj7idPwcMZqSc-fuDAY91R";

        const map = new Map({ basemap: "streets-vector" });
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

        return this.search;
    }

    async getDireccion(lng: number, lat: number): Promise<string> {
        const url = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=" + lng + "," + lat + "&langCode=es&f=pjson&apiKey=" + ARCGIS_TOKEN;
        let direccion = " ";

        try {
            const response = await fetch(url);
            const data = await response.json();

            const address = data.address;
            const street = address.Address;
            const zipCode = address.Postal;
            const neighborhood = address.Neighborhood;
            const city = address.City;
            const state = address.Region;
            direccion = street + ", " + zipCode + ", " + neighborhood + ", " + city + ", " + state;

        } catch (error) {
            console.log("Error: " + error);
        }
        //console.log(direccion);
        return direccion;
    }
}
