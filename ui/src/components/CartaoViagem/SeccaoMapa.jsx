import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const iconDestino = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconUser = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const FlyToLocation = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      map.flyTo(coords[0].coords, 6);
    }
  }, [coords, map]);
  return null;
}

const SeccaoMapa = ({ mostrarMapa, setMostrarMapa, setMostrarMembros, setMostrarAcertos, setMostrarChecklist, setMostrarItinerario, viagem }) => {
  const [locaisDestino, setLocaisDestino] = useState([]);
  const [coordsUser, setCoordsUser] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (mostrarMapa && locaisDestino.length === 0) {
      setCarregando(true);
      
      const extrairCidades = (texto) => {
        if (!texto) return [];
        return texto.replace(/ e /gi, ',').replace(/ y /gi, ',').replace(/ and /gi, ',').split(',').map(c => c.trim()).filter(c => c !== '');
      };

      const cidadesParaProcurar = [];
      extrairCidades(viagem.destino).forEach(c => {
        if (!cidadesParaProcurar.includes(c)) cidadesParaProcurar.push(c);
      });
      extrairCidades(viagem.etapas).forEach(c => {
        if (!cidadesParaProcurar.includes(c)) cidadesParaProcurar.push(c);
      });

      const fetchLocais = async () => {
        const resultados = [];
        for (const cidade of cidadesParaProcurar) {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cidade)}`);
            const data = await res.json();
            if (data && data.length > 0) {
              resultados.push({
                nome: cidade,
                coords: [parseFloat(data[0].lat), parseFloat(data[0].lon)]
              });
            }
          } catch (error) {}
          await new Promise(r => setTimeout(r, 500));
        }
        setLocaisDestino(resultados);
        setCarregando(false);
      };

      fetchLocais();

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((pos) => {
          setCoordsUser([pos.coords.latitude, pos.coords.longitude]);
        });
      }
    }
  }, [mostrarMapa, viagem.destino, viagem.etapas, locaisDestino.length]);

  const centroInicial = locaisDestino.length > 0 ? locaisDestino[0].coords : [38.7223, -9.1393];

  return (
    <div className="card-viagem__membros-container" style={{ marginTop: '-10px' }}>
      <button
        type="button"
        className="card-viagem__membros-toggle"
        onClick={() => {
          setMostrarMapa(!mostrarMapa);
          setMostrarMembros(false);
          setMostrarAcertos(false);
          setMostrarChecklist(false);
          setMostrarItinerario(false);
        }}
      >
        <span>🗺️ Mapa e Localização</span>
        <span>{mostrarMapa ? '▲' : '▼'}</span>
      </button>

      {mostrarMapa && (
        <div className="card-viagem__membros-content" style={{ padding: '12px' }}>
          {carregando && <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem', marginBottom: '10px' }}>A procurar coordenadas no mapa...</p>}
          
          <div style={{ height: '350px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', zIndex: 0 }}>
            <MapContainer center={centroInicial} zoom={6} style={{ height: '100%', width: '100%', zIndex: 0 }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              
              {locaisDestino.length > 0 && !carregando && <FlyToLocation coords={locaisDestino} />}
              
              {locaisDestino.map((local, index) => (
                <Marker key={index} position={local.coords} icon={iconDestino}>
                  <Popup>📍 Etapa da Viagem:<br/><b>{local.nome}</b></Popup>
                </Marker>
              ))}

              {coordsUser && (
                <Marker position={coordsUser} icon={iconUser}>
                  <Popup>🔴 <b>Tu estás aqui!</b></Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeccaoMapa;