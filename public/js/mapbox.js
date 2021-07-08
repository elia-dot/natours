export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZWxpYWNvaGVuIiwiYSI6ImNrcXE3cjFjMzEzZWcydXN0dWp5MWdtM20ifQ.ZOBmfFQdDmImaqOkidU7Gw';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/eliacohen/ckqq84flt3p2j18pbc3d3zo6w',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p> Day ${loc.day}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
