import { ChatTile } from './ChatTile';

export const TileGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-6xl mx-auto">
      <ChatTile tileIndex={0} />
      <ChatTile tileIndex={1} />
      <ChatTile tileIndex={2} />
      <ChatTile tileIndex={3} />
    </div>
  );
};
