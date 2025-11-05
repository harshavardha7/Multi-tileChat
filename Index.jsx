import { TileGrid } from '@/components/TileGrid';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="p-6 border-b border-border/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Multi-Tile Chat
          </h1>
          <p className="text-muted-foreground mt-1">
            Four independent AI conversations at your fingertips
          </p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="py-8">
        <TileGrid />
      </main>
    </div>
  );
};

export default Index;
