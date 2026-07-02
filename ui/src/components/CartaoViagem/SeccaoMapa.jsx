import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useItinerario, useToast } from '../../hooks';
import { MENSAGENS } from '../../utils';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

const SeccaoMapa = ({ 
  mostrarMapa, setMostrarMapa, setMostrarMembros, setMostrarAcertos, 
  setMostrarChecklist, setMostrarItinerario, setMostrarCofre, setMostrarTransportes, viagem 
}) => {
  const [centro, setCentro] = useState([38.7223, -9.1393]);
  const [pontos, setPontos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [novoPontoClicado, setNovoPontoClicado] = useState(null);

  const { criarItinerario, carregarItinerarios } = useItinerario(viagem.id);
  const { mostrarSucesso, mostrarErro } = useToast();

  useEffect(() => {
    if (mostrarMapa && viagem && viagem.destino) {
      carregarDadosMapa();
    }
  }, [mostrarMapa, viagem]);

  const carregarDadosMapa = async () => {
    setLoading(true);
    setPontos([]);
    
    const primeiraCidade = viagem.destino.split(/ e |,| ou | - | \/ /i)[0].trim();

    try {
      const respGeo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(primeiraCidade)}`);
      const dataGeo = await respGeo.json();

      if (dataGeo && dataGeo.length > 0) {
        const lat = parseFloat(dataGeo[0].lat);
        const lon = parseFloat(dataGeo[0].lon);
        setCentro([lat, lon]);

        // 2. Usar nwr (Node, Way, Relation) apanha muito mais monumentos do que apenas "node"
        const query = `
          [out:json][timeout:15];
          (
            nwr["historic"](around:4000, ${lat}, ${lon});
            nwr["tourism"="attraction"](around:4000, ${lat}, ${lon});
            nwr["tourism"="museum"](around:4000, ${lat}, ${lon});
          );
          out center 25;
        `;
        
        const respOverpass = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
        const dataOverpass = await respOverpass.json();
        
        if (dataOverpass && dataOverpass.elements) {
          const locaisValidos = dataOverpass.elements.filter(el => el.tags && (el.tags.name || el.tags.historic));
          setPontos(locaisValidos);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar mapa:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItinerario = async (localName) => {
    const result = await criarItinerario({
      viagem_id: parseInt(viagem.id),
      data: '',
      hora: '',
      local: localName,
      notas: 'Adicionado via Mapa Interativo 🗺️'
    });

    if (result.sucesso) {
      carregarItinerarios();
      mostrarSucesso(`${localName} adicionado ao itinerário!`);
      setMostrarMapa(false);
      setMostrarItinerario(true);
      setNovoPontoClicado(null);
    } else {
      mostrarErro(MENSAGENS.ERRO_SERVIDOR);
    }
  };

  const InteracoesMapa = () => {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        setNovoPontoClicado({ lat, lon: lng, nome: 'A identificar local...' });

        try {
          const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
          const data = await resp.json();
          
          let nomeLocal = 'Local Selecionado';
          if (data && data.name) nomeLocal = data.name;
          else if (data && data.address) {
            nomeLocal = data.address.tourism || data.address.historic || data.address.road || 'Ponto de Interesse';
          }
          
          setNovoPontoClicado({ lat, lon: lng, nome: nomeLocal });
        } catch (err) {
          setNovoPontoClicado({ lat, lon: lng, nome: 'Coordenada Selecionada' });
        }
      }
    });
    return null;
  };

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
          setMostrarCofre(false);
          setMostrarTransportes(false);
        }}
      >
        <span>🗺️ Mapa e Localização</span>
        <span>{mostrarMapa ? '▲' : '▼'}</span>
      </button>

      {mostrarMapa && (
        <div className="card-viagem__membros-content" style={{ padding: '0', height: '400px', position: 'relative', zIndex: 1 }}>
          
          {loading && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, fontWeight: 'bold', color: '#3b82f6' }}>
              A carregar atrações em {viagem.destino.split(/ e |,/i)[0]}...
            </div>
          )}
          
          <MapContainer center={centro} zoom={13} style={{ height: '100%', width: '100%', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
            <ChangeView center={centro} />
            <InteracoesMapa />
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {pontos.map((ponto, idx) => (
              <Marker key={`ponto-${idx}`} position={[ponto.lat || ponto.center.lat, ponto.lon || ponto.center.lon]}>
                <Popup>
                  <div style={{ textAlign: 'center', padding: '4px' }}>
                    <h4 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '1rem' }}>
                      {ponto.tags.name || 'Monumento Histórico'}
                    </h4>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '10px', textTransform: 'capitalize' }}>
                      {ponto.tags.tourism || ponto.tags.historic || 'Ponto de Interesse'}
                    </span>
                    <button 
                      onClick={() => handleAddItinerario(ponto.tags.name || 'Monumento')}
                      style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
                    >
                      ➕ Adicionar
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {novoPontoClicado && (
              <Marker position={[novoPontoClicado.lat, novoPontoClicado.lon]}>
                <Popup autoPan={true}>
                  <div style={{ textAlign: 'center', padding: '4px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#10b981', fontSize: '1rem' }}>📍 {novoPontoClicado.nome}</h4>
                    <button 
                      onClick={() => handleAddItinerario(novoPontoClicado.nome)}
                      style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
                    >
                      ➕ Guardar no Itinerário
                    </button>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default SeccaoMapa;