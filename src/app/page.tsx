"use client"
import React, { useState } from 'react';
import { Plus, Users, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Define types
interface Game {
  id: string;
  name: string;
  tables: number;
  createdAt: string;
}

interface GameCardProps {
  game: Game;
  onClick: (id: string) => void;
}

interface NewGameCardProps {
  onClick: () => void;
}

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGame: (name: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  return (
    <Link 
      href={`/games/${game.id}`}
      className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:translate-y-[-4px] cursor-pointer border border-slate-700 hover:border-indigo-500/50"
    >
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 truncate">{game.name}</h3>
        <div className="flex items-center text-slate-400 mb-4">
          <Users className="h-4 w-4 mr-2" />
          <span>{game.tables} {game.tables === 1 ? 'Table' : 'Tables'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">Created {game.createdAt}</span>
          <ChevronRight className="h-5 w-5 text-indigo-400" />
        </div>
      </div>
    </Link>
  );
};

const NewGameCard: React.FC<NewGameCardProps> = ({ onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-slate-800/50 rounded-lg overflow-hidden shadow border border-dashed border-slate-600 hover:border-indigo-400 flex flex-col items-center justify-center p-8 cursor-pointer h-full hover:bg-slate-800 transition-all duration-200"
    >
      <div className="bg-slate-700/50 p-3 rounded-full mb-3">
        <Plus className="h-6 w-6 text-indigo-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-300">Create New Game</h3>
      <p className="text-sm text-slate-500 text-center mt-2">Start a new adventure with your players</p>
    </div>
  );
};

const CreateGameModal: React.FC<CreateGameModalProps> = ({ isOpen, onClose, onCreateGame }) => {
  const [gameName, setGameName] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (gameName.trim()) {
      onCreateGame(gameName);
      setGameName('');
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-white mb-4">Create New Game</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="game-name" className="block text-sm font-medium text-slate-300 mb-1">
              Game Name
            </label>
            <input
              id="game-name"
              type="text"
              value={gameName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGameName(e.target.value)}
              className="w-full py-2 px-3 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter game name..."
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-medium"
            >
              Create Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const GamesPage: React.FC = () => {
  // Sample initial games - in a real app this would come from an API
  const [games, setGames] = useState<Game[]>([
    { id: '1', name: 'Dragons Lair Campaign', tables: 3, createdAt: '3 days ago' },
    { id: '2', name: 'Forgotten Realms Adventure', tables: 1, createdAt: '1 week ago' },
    { id: '3', name: 'Shadow of the Lich King', tables: 2, createdAt: '2 weeks ago' },
    { id: '4', name: 'Curse of Strahd', tables: 5, createdAt: '1 month ago' },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const handleCreateGame = (gameName: string): void => {
    const newGame: Game = {
      id: `${games.length + 1}`,
      name: gameName,
      tables: 0,
      createdAt: 'Just now'
    };
    
    setGames([...games, newGame]);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Games</h1>
          <p className="text-slate-400">Manage and access your RPG campaigns</p>
        </header>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
          
          <NewGameCard onClick={() => setIsModalOpen(true)} />
        </div>
      </div>
      
      <CreateGameModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreateGame={handleCreateGame} 
      />
    </div>
  );
};

export default GamesPage;