import { Parish } from "@/types/parish";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Phone, Mail, Globe, MapPin, Clock, X } from "lucide-react";
import { serviceTypes } from "@/data/mockParishes";

interface ParishDetailProps {
  parish: Parish | null;
  onSchedule: () => void;
  onClose: () => void;
}

const getDayName = (day: string) => {
  const days: Record<string, string> = {
    sunday: "Domingo",
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
  };
  return days[day] || day;
};

const getCountryCode = (country: string) => {
  const countryCodes: Record<string, string> = {
    Argentina: "ARG",
    Uruguay: "URY",
    Paraguay: "PRY",
    Chile: "CHL",
    "República Dominicana": "DOM",
    Perú: "PER",
  };
  return countryCodes[country] || country;
};

export const ParishDetail = ({ parish, onSchedule, onClose }: ParishDetailProps) => {
  try {

    if (!parish) {
      return (
        <div className="h-full flex items-center justify-center p-8">
          <div className="text-center text-muted-foreground">
            <MapPin className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Seleccioná una parroquia en el mapa</p>
            <p className="text-sm">para ver sus detalles y horarios</p>
          </div>
        </div>
      );
    }

  } catch (error) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center text-red-500">
          <p className="text-lg">Error mostrando detalles de la parroquia</p>
          <p className="text-sm">{error instanceof Error ? error.message : "Error desconocido"}</p>
        </div>
      </div>
    );
  }

  try {
     return (
       <div className="flex-1 overflow-y-auto px-6 pb-6 pt-1 space-y-6 animate-fade-in relative scrollbar-thin">
         <Button
           variant="ghost"
           size="icon"
           onClick={onClose}
           className="absolute top-2 right-2 z-10"
         >
           <X className="h-4 w-4" />
         </Button>

         <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-2xl">{parish.name || "Sin nombre"}</CardTitle>
            <CardDescription className="text-sm">{parish.priest || "Sin información"}</CardDescription>
          </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary mt-0.5" />
            <span>{parish.address}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-primary" />
            <a href={`tel:${parish.phone}`} className="hover:underline">
              {parish.phone}
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-primary" />
            <a href={`mailto:${parish.email}`} className="hover:underline">
              {parish.email}
            </a>
          </div>

          {parish.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-primary" />
              <a href={parish.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Sitio web
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Servicios y Horarios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {parish.services && parish.services.length > 0 ? (
            parish.services.map((service) => {
              try {
                return (
                  <div key={service.id} className="border-l-4 border-primary pl-4 py-2">
                    <h4 className="font-semibold text-lg mb-2">{service.name}</h4>
                    <div className="space-y-1 text-sm">
                      {service.days && service.days.length > 0 ? (
                        service.days.map((day, idx) => {
                          return (
                            <div key={idx} className="flex gap-2">
                              <span className="font-medium min-w-[100px]">{getDayName(day.name)}:</span>
                              <span className="text-muted-foreground">
                                {day.times && day.times.length > 0
                                  ? day.times.map((time) => `${time.startTime} - ${time.endTime}`).join(", ") + ` (${getCountryCode(parish.country)})`
                                  : "Sin horarios específicos"}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-muted-foreground">Sin días especificados</div>
                      )}
                    </div>
                  </div>
                );
              } catch (error) {
                return (
                  <div key={service.id} className="border-l-4 border-red-500 pl-4 py-2 text-red-500">
                    Error mostrando servicio: {service.name}
                  </div>
                );
              }
            })
          ) : (
            <div className="text-muted-foreground">No hay servicios disponibles</div>
          )}
        </CardContent>
      </Card>

      <Button
        onClick={onSchedule}
        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
        size="lg"
      >
        <Calendar className="h-5 w-5 mr-2" />
        Agendar un Servicio
      </Button>
    </div>
    );
  } catch (renderError) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center text-red-500">
          <p className="text-lg">Error mostrando detalles de la parroquia</p>
          <p className="text-sm">{renderError instanceof Error ? renderError.message : "Error de renderizado"}</p>
        </div>
      </div>
    );
  }
};
