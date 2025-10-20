import { Parish } from "@/types/parish";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Mail, Globe, MapPin, Clock, Accessibility, X } from "lucide-react";
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

export const ParishDetail = ({ parish, onSchedule, onClose }: ParishDetailProps) => {
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

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-fade-in relative scrollbar-thin">
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
          <CardTitle className="text-2xl">{parish.name}</CardTitle>
          <CardDescription className="text-sm">{parish.pastor}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary mt-0.5" />
            <span>{parish.address}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-primary" />
            <a href={`tel:${parish.contact.phone}`} className="hover:underline">
              {parish.contact.phone}
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-primary" />
            <a href={`mailto:${parish.contact.email}`} className="hover:underline">
              {parish.contact.email}
            </a>
          </div>

          {parish.links?.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-primary" />
              <a href={parish.links.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Sitio web
              </a>
            </div>
          )}

          {parish.accessibility && (
            <div className="flex items-start gap-2 text-sm">
              <Accessibility className="h-4 w-4 text-primary mt-0.5" />
              <div className="flex flex-wrap gap-1">
                {parish.accessibility.ramp && <Badge variant="secondary">Rampa</Badge>}
                {parish.accessibility.parking && <Badge variant="secondary">Estacionamiento</Badge>}
                {parish.accessibility.restroom && <Badge variant="secondary">Baño accesible</Badge>}
              </div>
            </div>
          )}

          {parish.languages && parish.languages.length > 0 && (
            <div className="text-sm">
              <span className="font-medium">Idiomas: </span>
              {parish.languages.join(", ")}
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
          {parish.services.map((service, index) => {
            const serviceLabel = serviceTypes.find((s) => s.value === service.type)?.label || service.type;
            
            return (
              <div key={index} className="border-l-4 border-primary pl-4 py-2">
                <h4 className="font-semibold text-lg mb-2">{serviceLabel}</h4>
                <div className="space-y-1 text-sm">
                  {Object.entries(service.schedule).map(([day, times]) => (
                    <div key={day} className="flex gap-2">
                      <span className="font-medium min-w-[100px]">{getDayName(day)}:</span>
                      <span className="text-muted-foreground">{Array.isArray(times) ? times.join(", ") : times}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
};
