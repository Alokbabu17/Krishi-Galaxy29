import React, { useState, useRef } from "react";
import {
  LoadScript,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import "./BhandarGhar.css";

const containerStyle = { width: "100%", height: "100%" };

export default function BhandarGhar() {
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);
  const [userPos, setUserPos] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [directions, setDirections] = useState(null);

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef(null);

  // ✅ Call Flask backend API instead of direct Google API
  const fetchNearby = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserPos({ lat, lng });

        try {
          const url = `http://localhost:5000/api/bhandar-ghar?lat=${lat}&lon=${lng}`;
          const res = await fetch(url);
          const data = await res.json();

          if (data.status === "success" && data.data) {
            const mapped = data.data.map((place, idx) => ({
              id: idx,
              name: place.name,
              lat: place.location.lat,
              lng: place.location.lng,
              address: place.address || "No address",
              distance_km: "Approx",
            }));
            setStores(mapped);
          } else {
            alert("No stores found nearby.");
          }
        } catch (err) {
          console.error(err);
          alert("❌ Error fetching from backend API.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        alert("Location permission denied or error.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const showOnMap = (store) => {
    setSelectedStore(store);
    setDirections(null);

    if (!userPos) return alert("Please fetch your location first.");

    if (window.google && window.google.maps) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: userPos.lat, lng: userPos.lng },
          destination: { lat: store.lat, lng: store.lng },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") setDirections(result);
          else alert("Directions failed: " + status);
        }
      );
    }
  };

  return (
    <div className="bhandar-page">
      <h2>भण्डार घर खोजें / Find Nearby Warehouses</h2>

      <div className="fetch-panel">
        <button className="fetch-btn" onClick={fetchNearby} disabled={loading}>
          {loading ? "Fetching location..." : "📍 Click here to fetch your Location / अपनी लोकेशन पाएं"}
        </button>
      </div>

      <div className="bhandar-layout">
        <div className="store-list">
          {stores.length === 0 ? (
            <div className="empty">Nearby warehouses will appear here (within ~20 km)</div>
          ) : (
            stores.map((s) => (
              <div key={s.id} className="store-item">
                <div className="store-title">{s.name}</div>
                <div className="store-addr">{s.address}</div>
                <div className="store-dist">{s.distance_km}</div>
                <div className="store-actions">
                  <button onClick={() => showOnMap(s)}>Show on map / नक्शे पर दिखाएँ</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="map-area">
          <LoadScript googleMapsApiKey={apiKey}>
            <div className="map-wrapper">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={userPos || { lat: 20.5937, lng: 78.9629 }}
                zoom={userPos ? 13 : 5}
                onLoad={(map) => (mapRef.current = map)}
              >
                {userPos && <Marker position={userPos} label="You" />}

                {stores.map((s) => (
                  <Marker
                    key={s.id}
                    position={{ lat: s.lat, lng: s.lng }}
                    onClick={() => setSelectedStore(s)}
                  />
                ))}

                {directions && <DirectionsRenderer directions={directions} />}

                {selectedStore && (
                  <InfoWindow
                    position={{ lat: selectedStore.lat, lng: selectedStore.lng }}
                    onCloseClick={() => setSelectedStore(null)}
                  >
                    <div>
                      <h3>{selectedStore.name}</h3>
                      <p>{selectedStore.address}</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>
          </LoadScript>
          <div className="map-info">
            {selectedStore ? (
              <>
                <h3>{selectedStore.name}</h3>
                <p>{selectedStore.address}</p>
              </>
            ) : (
              <p>Select a warehouse to view on map</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
