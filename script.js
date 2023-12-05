let map;

(async function () {
  const { Map } = await google.maps.importLibrary('maps');

  const mapContainer = document.getElementById('map');

  const mapOptions = {
    center: { lat: 37.551458, lng: 126.988182 },
    zoom: 15,
    /**
     * Controls
     */
    scaleControl: true,
    // rotateControl: true,
    fullscreenControl: true,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER,
    },
    streetViewControl: true,
    streetViewControlOptions: {
      position: google.maps.ControlPosition.LEFT_CENTER,
    },
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP,
    },
    /**
     * Map Type
     */
    // mapTypeId: google.maps.MapTypeId.ROADMAP,
    // mapTypeId: google.maps.MapTypeId.TERRAIN,
    // mapTypeId: google.maps.MapTypeId.SATELLITE,
    // mapTypeId: google.maps.MapTypeId.HYBRID,
  };

  map = new Map(mapContainer, mapOptions);

  //
  setMapEvents();

  //
  setMapInfoWindows();

  //
  setGeolocation();

  //
  setTransitLayer();

  //
  setGeoJSON();
})();

/* change map type */
let isRoadmap = true;
const btn0 = document.querySelector('#btn-0');
btn0.addEventListener('click', () => {
  if (isRoadmap) map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
  else map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
  isRoadmap = !isRoadmap;
});

/* marker */
let isOnMarker = false;
let marker;
const btn1 = document.querySelector('#btn-1');
btn1.addEventListener('click', () => {
  if (!marker) {
    marker = new google.maps.Marker({
      position: { lat: 37.551458, lng: 126.988182 },
      title: 'Hello',
      label: 'A',
    });
  }

  if (isOnMarker) {
    marker.setMap(null);
  } else {
    marker.setMap(map);
  }
  isOnMarker = !isOnMarker;
});

/* polyline */
let isOnPolyline = false;
let polyline;
const btn2 = document.querySelector('#btn-2');
btn2.addEventListener('click', () => {
  if (!polyline) {
    const myPlaces = [
      { lat: 37.551458, lng: 126.988182 },
      { lat: 37.561458, lng: 126.978182 },
      { lat: 37.531458, lng: 126.968182 },
    ];
    polyline = new google.maps.Polyline({
      path: myPlaces,
      strokeColor: '#ff0000',
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });
  }

  if (isOnPolyline) {
    polyline.setMap(null);
  } else {
    polyline.setMap(map);
  }
  isOnPolyline = !isOnPolyline;
});

/* polygon */
let isOnPolygon = false;
let polygon;
const btn3 = document.querySelector('#btn-3');
btn3.addEventListener('click', () => {
  if (!polygon) {
    const myPlaces = [
      { lat: 37.551458, lng: 126.988182 },
      { lat: 37.561458, lng: 126.978182 },
      { lat: 37.531458, lng: 126.968182 },
    ];
    polygon = new google.maps.Polygon({
      path: myPlaces,
      strokeColor: '#ff0000',
      strokeWeight: 3,
      fillColor: '#ff0000',
    });
  }

  if (isOnPolygon) {
    polygon.setMap(null);
  } else {
    polygon.setMap(map);
  }
  isOnPolygon = !isOnPolygon;
});

/* ground overlay */
let isOnGroundOverlay = false;
let groundOverlay;
const btn4 = document.querySelector('#btn-4');
btn4.addEventListener('click', () => {
  if (!groundOverlay) {
    const imageBounds = {
      north: 37.551458,
      south: 37.541458,
      east: 126.988182,
      west: 126.968182,
    };
    groundOverlay = new google.maps.GroundOverlay(
      'https://i.namu.wiki/i/DK-BcaE6wDCM-N9UJbeQTn0SD9eWgsX9YKWK827rqjbrzDz0-CxW-JFOCiAsUL3CBZ4zE0UDR-p4sLaYPiUjww.webp',
      imageBounds
    );
  }

  if (isOnGroundOverlay) {
    groundOverlay.setMap(null);
  } else {
    groundOverlay.setMap(map);
  }
  isOnGroundOverlay = !isOnGroundOverlay;
});

/* Map Events */
const log = document.querySelector('#log > p:nth-child(2)');
function setLog(m) {
  // log.innerHTML += '<br />' + m;
  log.innerHTML = m;
}

function setMapEvents() {
  map.addListener('center_changed', () => {
    setLog(`Center changed to: ${map.getCenter()}`);
  });
  map.addListener('click', (e) => {
    setLog(`Map is Clicked Over: ${e.latLng.toString()}`);
  });

  // Removing Event Listeners
  // https://developers.google.com/maps/documentation/javascript/events
}

/* Info Windows */
function setMapInfoWindows() {
  map.addListener('click', (e) => {
    const content = `<div><p>Info Window</p></div>`;
    const infoWindow = new google.maps.InfoWindow({ content });
    const marker = new google.maps.Marker({
      position: e.latLng,
      map,
    });
    infoWindow.open(map, marker);
    infoWindow.addListener('closeclick', () => {
      console.log('InfoWindow Close Click');
    });
  });
}

/* Geolocation */
function setGeolocation() {
  let lat, lng;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      setLog(`Device Location is - lat: ${lat}, lng: ${lng}`);
      // map.setCenter({ lat, lng });
    });
  }
}

/* TransitLayer */
function setTransitLayer() {
  const transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);
}

/**
 * MapData: GeoJSON
 */
function setGeoJSON() {
  document.querySelector('#btn-5').addEventListener('click', () => {
    loadGeoJSON();
  });
  document.querySelector('#btn-6').addEventListener('click', () => {
    loadGeoJSONSelection();
  });

  //
  setMapDataEvents();

  //
  setMapDataStyle();
}

function setMapDataEvents() {
  // data Layer 이벤트이므로 InfoWindow는 안뜸
  map.data.addListener('click', (e) => {
    setLog(`Map is Clicked Over: ${e.feature.h['ADMIN'].toString()}`);

    e.feature.setProperty('isHighlighted', true);
    e.feature.setProperty('highlightedColor', 'red');
  });
  map.data.addListener('mouseover', (e) => {
    map.data.revertStyle();
    map.data.overrideStyle(e.feature, { strokeWeight: 8 });
  });
  map.data.addListener('mouseout', (e) => {
    map.data.revertStyle();
  });
}

// 나라별 구분 GeoJSON
// ! 현재는 Layer가 쌓이면서 계속 로드됨
const geoJSONURL = 'https://datahub.io/core/geo-countries/r/countries.geojson';
// 나라별 구분 데이터 이므로 지도를 축소해서 나라별 구분이 되어 보이도록 해야됨
function loadGeoJSON() {
  map.data.loadGeoJson(geoJSONURL);
}
async function loadGeoJSONSelection() {
  const d = await fetch(geoJSONURL);
  const json = await d.json();
  // console.log(json);
  json.features.forEach((feature) => {
    // 나라 이름 출력
    // console.log(feature.properties.ADMIN);
    if (feature.properties.ADMIN == 'South Korea') {
      map.data.addGeoJson(feature, { idPropertyName: 'id' });
    }
  });
}

//
function setMapDataStyle() {
  map.data.setStyle({
    fillColor: 'green',
    strokeColor: 'red',
    strokeWeight: 1,
  });

  map.data.setStyle(function (feature) {
    let color = 'green';
    if (feature.getProperty('isHighlighted')) {
      color = feature.getProperty('highlightedColor');
    }

    return { fillColor: color, strokeColor: color, strokeWeight: 1 };
  });
}
