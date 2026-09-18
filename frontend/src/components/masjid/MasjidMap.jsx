import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { MAP_CONFIG } from '../../utils/constants.js';
import { fixLeafletDefaultIcon, masjidIcon } from '../map/leafletIcon.js';
import { formatDistance } from '../../utils/masjid.js';

fixLeafletDefaultIcon();

function Recenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom ?? map.getZoom());
  }, [center?.[0], center?.[1], zoom]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

function ClickHandler({ onClick }) {
  useMapEvents({ click: (e) => onClick?.(e.latlng.lat, e.latlng.lng) });
  return null;
}

/**
 * Map showing masjid markers around a centre point.
 * - `userLocation` [lat, lng] draws the blue "you are here" pin + radius circle
 * - `onMapClick(lat, lng)` makes the map a coordinate picker (used on the add page)
 * - `selected` [lat, lng] draws a single draggable-free pin (add page preview)
 */
export default function MasjidMap({
  center,
  zoom = 13,
  masjids = [],
  userLocation = null,
  radiusKm = null,
  selected = null,
  onMapClick = null,
  height = '360px',
}) {
  const mapCenter = center || userLocation || MAP_CONFIG.center;

  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter center={mapCenter} zoom={zoom} />
        {onMapClick && <ClickHandler onClick={onMapClick} />}

        {userLocation && (
          <>
            <Marker position={userLocation}>
              <Popup>You are here</Popup>
            </Marker>
            {radiusKm && (
              <Circle
                center={userLocation}
                radius={radiusKm * 1000}
                pathOptions={{ color: '#16a34a', fillColor: '#16a34a', fillOpacity: 0.05, weight: 1 }}
              />
            )}
          </>
        )}

        {selected && (
          <Marker position={selected} icon={masjidIcon} />
        )}

        {masjids.map((m) => (
          <Marker key={m.id} position={[m.latitude, m.longitude]} icon={masjidIcon}>
            <Popup>
              <div className="text-sm">
                <Link to={`/masjids/${m.id}`} className="font-semibold text-primary-700 hover:underline">
                  {m.name}
                </Link>
                {m.address && <div className="text-gray-600 text-xs mt-0.5">{m.address}</div>}
                {m.distance_km != null && (
                  <div className="text-gray-500 text-xs mt-0.5">{formatDistance(m.distance_km)}</div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
