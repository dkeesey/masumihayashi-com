import L from 'leaflet';

// Camp locations data
interface Camp {
  name: string;
  location: [number, number];
  years: string;
}

const camps: Camp[] = [
  { name: "Manzanar", location: [36.7286, -118.1541], years: "1942-1945" },
  { name: "Tule Lake", location: [41.8889, -121.3722], years: "1942-1946" },
  { name: "Heart Mountain", location: [44.6736, -108.9427], years: "1942-1945" },
  { name: "Minidoka", location: [42.6778, -114.2450], years: "1942-1945" },
  { name: "Topaz", location: [39.4166, -112.7727], years: "1942-1945" },
  { name: "Granada (Amache)", location: [38.0516, -102.3272], years: "1942-1945" },
  { name: "Poston", location: [33.9961, -114.4000], years: "1942-1945" },
  { name: "Gila River", location: [33.0147, -111.8735], years: "1942-1945" },
  { name: "Rohwer", location: [33.7645, -91.2767], years: "1942-1945" },
  { name: "Jerome", location: [33.4115, -91.4659], years: "1942-1944" }
];

export function initMap() {
  const mapElement = document.getElementById('camp-map');
  if (!mapElement) return;

  // Create map centered on US
  const map = L.map('camp-map').setView([39.8283, -98.5795], 4);
  
  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Add markers for each camp
  camps.forEach(camp => {
    L.marker(camp.location)
      .bindPopup(`<strong>${camp.name}</strong><br>Years: ${camp.years}`)
      .addTo(map);
  });
}
