// References:
// - Loading Google Maps Platform JavaScript in Modern Web Applications: https://mapsplatform.google.com/resources/blog/loading-google-maps-platform-javascript-modern-web-applications/
// - Add a Google map to a React app: https://developers.google.com/codelabs/maps-platform/maps-platform-101-react-js#0

// 3rd-party
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import React, { useEffect, useState, useRef } from "react";

const locations = [
  { key: "operaHouse", location: { lat: -33.8567844, lng: 151.213108 } },
  { key: "tarongaZoo", location: { lat: -33.8472767, lng: 151.2188164 } },
  { key: "manlyBeach", location: { lat: -33.8209738, lng: 151.2563253 } },
  { key: "hyderPark", location: { lat: -33.8690081, lng: 151.2052393 } },
  { key: "theRocks", location: { lat: -33.8587568, lng: 151.2058246 } },
  { key: "circularQuay", location: { lat: -33.858761, lng: 151.2055688 } },
  { key: "harbourBridge", location: { lat: -33.852228, lng: 151.2038374 } },
  { key: "kingsCross", location: { lat: -33.8737375, lng: 151.222569 } },
  { key: "botanicGardens", location: { lat: -33.864167, lng: 151.216387 } },
  { key: "museumOfSydney", location: { lat: -33.8636005, lng: 151.2092542 } },
  { key: "maritimeMuseum", location: { lat: -33.869395, lng: 151.198648 } },
  { key: "kingStreetWharf", location: { lat: -33.8665445, lng: 151.1989808 } },
  { key: "aquarium", location: { lat: -33.869627, lng: 151.202146 } },
  { key: "darlingHarbour", location: { lat: -33.87488, lng: 151.1987113 } },
  { key: "barangaroo", location: { lat: -33.8605523, lng: 151.1972205 } },
];

function PoiMarkers(props) {
  const map = useMap();
  const [markers, setMarkers] = useState({});
  const clusterer = useRef(null);

  // Initialize MarkerClusterer, if the map has changed
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  // Update markers, if the markers array has changed
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker, key) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {props.pois.map((poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={(marker) => setMarkerRef(marker, poi.key)}
        >
          <Pin
            background={"#FBBC04"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
      ))}
    </>
  );
}

function SydneyView({ apiKey }) {
  return (
    <Box
      style={{
        height: 1000,
        width: 2000,
      }}
    >
      <APIProvider
        apiKey={apiKey}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        <Map
          mapId="Syndey_View"
          defaultZoom={13}
          defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
          onCameraChanged={(ev) =>
            console.log(
              "camera changed:",
              ev.detail.center,
              "zoom:",
              ev.detail.zoom
            )
          }
        >
          <PoiMarkers pois={locations} />
        </Map>
      </APIProvider>
    </Box>
  );
}

function DemoGoogleMaps() {
  const [showMap, setShowMap] = useState(false);
  const [apiKey, setApiKey] = useState(null);

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          paddingTop: 2.5,
          paddingBottom: 2.5,
          minHeight: "100%",
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            paddingBottom: 2.5,
            minHeight: "100%",
          }}
        >
          <Box sx={{ margin: 1 }}>
            <TextField
              label="Google Maps API key"
              required
              sx={{ width: "50%" }}
              type="url"
              onChange={(event) => {
                setApiKey(event.target.value);
                setShowMap(event.target.value.length > 0);
              }}
            />
          </Box>
          {showMap ? <SydneyView apiKey={apiKey} /> : null}
        </Grid>
      </Grid>
    </>
  );
}

export default DemoGoogleMaps;
