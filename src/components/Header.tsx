import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/favicon.png" alt="Logo" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Pastoral digital - Encontrá tu parroquia</h1>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
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
