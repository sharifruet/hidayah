import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { BANGLADESH_BOUNDS, MAP_CONFIG } from '../../utils/constants.js';
import { Icon } from 'leaflet';
import { useEffect, useCallback } from 'react';
import { validateBangladeshBounds } from '../../utils/validators.js';

// Fix for default marker icon issue
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/**
 * Map click handler component
 */
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e);
    }
  });
  return null;
}

/**
 * Component to update map center when center prop changes
 */
function MapCenterUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center && center.length === 2) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
}

export default function LocationMap({
  center = null,
  zoom = MAP_CONFIG.defaultZoom,
  onLocationSelect = null,
  selectedLocation = null,
  height = '400px'
}) {
  const handleClick = useCallback((e) => {
    const { lat, lng } = e.latlng;

    // Validate coordinates
    const validation = validateBangladeshBounds(lat, lng);
    if (!validation.valid) {
      console.warn('Coordinates outside Bangladesh bounds:', validation.error);
      return;
    }

    if (onLocationSelect) {
      onLocationSelect(lat, lng);
    }
  }, [onLocationSelect]);

  const bounds = [
    [BANGLADESH_BOUNDS.south, BANGLADESH_BOUNDS.west],
    [BANGLADESH_BOUNDS.north, BANGLADESH_BOUNDS.east]
  ];

  const mapCenter = center || [MAP_CONFIG.center[0], MAP_CONFIG.center[1]];

  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        maxBounds={bounds}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapCenterUpdater center={center} />
        <MapClickHandler onMapClick={handleClick} />

        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>
              {selectedLocation.name || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
