import { Parish } from "@/types/parish";

export const mockParishes: Parish[] = [
  {
    id: "ba-001",
    name: "Parroquia San José",
    pastor: "Pbro. Juan Pérez",
    address: "Av. Siempre Viva 123, CABA",
    country: "Argentina",
    province: "Buenos Aires",
    city: "CABA",
    location: { lat: -34.6037, lng: -58.3816 },
    contact: { phone: "+54 11 4000-0000", email: "contacto@sanjose.org" },
    services: [
      {
        type: "misa",
        schedule: {
          sunday: ["09:00", "11:00", "19:00"],
          monday: ["19:00"],
          wednesday: ["19:00"],
          friday: ["19:00"],
        },
      },
      {
        type: "bautismo",
        schedule: {
          saturday: ["10:00", "11:30"],
        },
      },
      {
        type: "confesiones",
        schedule: {
          friday: ["18:00-19:00"],
          saturday: ["17:00-18:30"],
        },
      },
      {
        type: "catequesis",
        schedule: {
          saturday: ["15:00-17:00"],
        },
      },
    ],
    links: { website: "https://sanjose.org" },
    accessibility: { ramp: true, parking: true, restroom: true },
    languages: ["Español", "Inglés"],
  },
  {
    id: "ba-002",
    name: "Parroquia Nuestra Señora de Luján",
    pastor: "Pbro. Carlos González",
    address: "Calle Falsa 456, Luján",
    country: "Argentina",
    province: "Buenos Aires",
    city: "Luján",
    location: { lat: -34.5708, lng: -59.1156 },
    contact: { phone: "+54 11 4000-1111", email: "info@nslujan.org.ar" },
    services: [
      {
        type: "misa",
        schedule: {
          sunday: ["08:00", "10:00", "12:00", "18:00"],
          saturday: ["18:00"],
        },
      },
      {
        type: "matrimonio",
        schedule: {
          saturday: ["12:00", "17:00"],
        },
      },
      {
        type: "caritas",
        schedule: {
          monday: ["09:00-12:00"],
          wednesday: ["14:00-17:00"],
        },
      },
    ],
    links: { 
      website: "https://nslujan.org.ar",
      facebook: "https://facebook.com/nslujan"
    },
    accessibility: { ramp: true, parking: true },
    languages: ["Español"],
  },
  {
    id: "cor-001",
    name: "Parroquia San Francisco",
    pastor: "Pbro. Miguel Rodríguez",
    address: "Av. Colón 789, Córdoba Capital",
    country: "Argentina",
    province: "Córdoba",
    city: "Córdoba Capital",
    location: { lat: -31.4201, lng: -64.1888 },
    contact: { phone: "+54 351 400-2222", email: "parroquia@sanfrancisco.org" },
    services: [
      {
        type: "misa",
        schedule: {
          sunday: ["09:00", "11:00", "19:30"],
          tuesday: ["19:00"],
          thursday: ["19:00"],
        },
      },
      {
        type: "confesiones",
        schedule: {
          saturday: ["16:00-18:00"],
        },
      },
      {
        type: "retiros",
        schedule: {
          saturday: ["09:00-17:00"],
        },
      },
    ],
    accessibility: { ramp: false, parking: true },
    languages: ["Español", "Italiano"],
  },
  {
    id: "sf-001",
    name: "Parroquia Santa María",
    pastor: "Pbro. Fernando López",
    address: "San Martín 321, Rosario",
    country: "Argentina",
    province: "Santa Fe",
    city: "Rosario",
    location: { lat: -32.9442, lng: -60.6505 },
    contact: { phone: "+54 341 400-3333", email: "santamaria@rosario.org" },
    services: [
      {
        type: "misa",
        schedule: {
          sunday: ["10:00", "18:00"],
          wednesday: ["19:00"],
        },
      },
      {
        type: "bautismo",
        schedule: {
          sunday: ["12:00"],
        },
      },
      {
        type: "catequesis",
        schedule: {
          saturday: ["16:00-18:00"],
        },
      },
    ],
    links: { 
      website: "https://santamaria-rosario.org",
      instagram: "https://instagram.com/santamaria_rosario"
    },
    accessibility: { ramp: true, parking: false, restroom: true },
    languages: ["Español"],
  },
  {
    id: "men-001",
    name: "Parroquia Cristo Rey",
    pastor: "Pbro. Roberto Sánchez",
    address: "Las Heras 567, Mendoza",
    country: "Argentina",
    province: "Mendoza",
    city: "Mendoza Capital",
    location: { lat: -32.8895, lng: -68.8458 },
    contact: { phone: "+54 261 400-4444", email: "cristorey@mendoza.org" },
    services: [
      {
        type: "misa",
        schedule: {
          sunday: ["09:00", "11:00", "19:00"],
          monday: ["19:30"],
          friday: ["19:30"],
        },
      },
      {
        type: "matrimonio",
        schedule: {
          saturday: ["18:00", "20:00"],
        },
      },
      {
        type: "caritas",
        schedule: {
          tuesday: ["10:00-13:00"],
          thursday: ["15:00-18:00"],
        },
      },
    ],
    accessibility: { ramp: true, parking: true, restroom: true },
    languages: ["Español"],
  },
  {
    id: "ba-003",
    name: "Parroquia Santo Domingo",
    pastor: "Pbro. Martín Fernández",
    address: "Defensa 422, San Telmo, CABA",
    country: "Argentina",
    province: "Buenos Aires",
    city: "CABA",
    location: { lat: -34.6204, lng: -58.3731 },
    contact: { phone: "+54 11 4000-5555", email: "info@santodomingo.org.ar" },
    services: [
      {
        type: "misa",
        schedule: {
          sunday: ["10:00", "12:00", "18:00"],
          saturday: ["19:00"],
        },
      },
      {
        type: "confesiones",
        schedule: {
          saturday: ["17:00-18:30"],
          sunday: ["09:00-09:45"],
        },
      },
      {
        type: "catequesis",
        schedule: {
          saturday: ["14:00-16:00"],
        },
      },
    ],
    links: { website: "https://santodomingo.org.ar" },
    accessibility: { ramp: false, parking: false },
    languages: ["Español", "Guaraní"],
  },
];

export const countries = [
  "Argentina",
  "Chile",
  "Uruguay",
  "Paraguay",
  "Brasil",
];

export const provinces = [
  "Buenos Aires",
  "Córdoba",
  "Santa Fe",
  "Mendoza",
  "Tucumán",
  "Salta",
  "Entre Ríos",
  "Misiones",
];

export const serviceTypes = [
  { value: "misa", label: "Misa" },
  { value: "bautismo", label: "Bautismo" },
  { value: "confesiones", label: "Confesiones" },
  { value: "catequesis", label: "Catequesis" },
  { value: "caritas", label: "Cáritas" },
  { value: "retiros", label: "Retiros" },
  { value: "matrimonio", label: "Matrimonio" },
];
