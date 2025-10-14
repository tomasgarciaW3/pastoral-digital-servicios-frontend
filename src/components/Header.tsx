import { Church, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <Church className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Parroquias Argentina</h1>
              <p className="text-xs text-muted-foreground">Encontrá tu parroquia más cercana</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar parroquia..."
                className="pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring w-64"
              />
            </div>
            
            <Button 
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-medium"
            >
              ¿Tu parroquia no está? → Registrala
            </Button>
          </div>
        </div>

        <div className="md:hidden mt-3">
          <Button 
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground text-sm"
            size="sm"
          >
            ¿Tu parroquia no está? → Registrala
          </Button>
        </div>
      </div>
    </header>
  );
};
