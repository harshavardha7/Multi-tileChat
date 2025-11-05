import { create } from 'zustand';

export const useChatStore = create((set) => ({
  tiles: {
    0: { sessionId: null, sessionPublicId: null, messages: [], isTyping: false },
    1: { sessionId: null, sessionPublicId: null, messages: [], isTyping: false },
    2: { sessionId: null, sessionPublicId: null, messages: [], isTyping: false },
    3: { sessionId: null, sessionPublicId: null, messages: [], isTyping: false },
  },
  
  setSession: (tileIndex, sessionId, sessionPublicId) =>
    set((state) => ({
      tiles: {
        ...state.tiles,
        [tileIndex]: {
          ...state.tiles[tileIndex],
          sessionId,
          sessionPublicId,
        },
      },
    })),
  
  addMessage: (tileIndex, message) =>
    set((state) => ({
      tiles: {
        ...state.tiles,
        [tileIndex]: {
          ...state.tiles[tileIndex],
          messages: [...state.tiles[tileIndex].messages, message],
        },
      },
    })),
  
  updateLastMessage: (tileIndex, content) =>
    set((state) => {
      const messages = [...state.tiles[tileIndex].messages];
      if (messages.length > 0) {
        messages[messages.length - 1] = {
          ...messages[messages.length - 1],
          content: content,
        };
      }
      return {
        tiles: {
          ...state.tiles,
          [tileIndex]: {
            ...state.tiles[tileIndex],
            messages,
          },
        },
      };
    }),
  
  setTyping: (tileIndex, isTyping) =>
    set((state) => ({
      tiles: {
        ...state.tiles,
        [tileIndex]: {
          ...state.tiles[tileIndex],
          isTyping,
        },
      },
    })),
  
  clearTile: (tileIndex) =>
    set((state) => ({
      tiles: {
        ...state.tiles,
        [tileIndex]: {
          sessionId: null,
          sessionPublicId: null,
          messages: [],
          isTyping: false,
        },
      },
    })),
}));
