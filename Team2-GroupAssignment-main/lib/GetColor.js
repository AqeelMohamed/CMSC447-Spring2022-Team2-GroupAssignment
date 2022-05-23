export default function GetColor(d) {
  return d > 4000
    ? '#800026'
    : d > 3000
    ? '#BD0026'
    : d > 2000
    ? '#E31A1C'
    : d > 1000
    ? '#FC4E2A'
    : d > 500
    ? '#FD8D3C'
    : d > 200
    ? '#FEB24C'
    : d > 100
    ? '#FED976'
    : '#FFEDA0'
}
