"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Plus, Users, ChevronRight, Trash, Trash2 } from "lucide-react";
import Link from "next/link";
import { createGame, deleteGame, getUserGames } from "@/actions/games";
import dayjs from "dayjs";
import type { Game } from "@/@types";
import { logout } from "@/actions/users";
import { getSession } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface GameCardProps {
  game: Game;
  onDeleteGame: (id: number) => void;
}

interface NewGameCardProps {
  onClick: () => void;
}

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGame: (name: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onDeleteGame }) => {
  return (
    <div className="relative bg-slate-950 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:translate-y-[-4px] border border-slate-700 hover:border-indigo-500/50">
      <button
        type="button"
        onClick={() => onDeleteGame(game.id)}
        className="absolute top-7 right-6 z-10 hover:cursor-pointer"
      >
        <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-600" />
      </button>

      <Link href={`/games/${game.id}`} className="block p-5">
        <div className="flex justify-between">
          <h3 className="text-xl font-bold text-white mb-2 truncate">
            {game.name}
          </h3>
        </div>

        <div className="flex items-center text-slate-400 mb-4">
          <Users className="h-4 w-4 mr-2" />
          <span>
            {game.tables.length} {game.tables.length === 1 ? "Table" : "Tables"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">
            Created {dayjs(game.createdAt).format("DD/MM/YYYY")}
          </span>
          <ChevronRight className="h-5 w-5 text-indigo-400" />
        </div>
      </Link>
    </div>
  );
};

const NewGameCard: React.FC<NewGameCardProps> = ({ onClick }) => {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      onClick={onClick}
      className="bg-slate-900/50 rounded-lg overflow-hidden shadow border border-dashed border-slate-600 hover:border-indigo-400 flex flex-col items-center justify-center p-8 cursor-pointer h-full hover:bg-slate-800 transition-all duration-200"
    >
      <div className="bg-slate-700/50 p-3 rounded-full mb-3">
        <Plus className="h-6 w-6 text-indigo-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-300">Create New Game</h3>
      <p className="text-sm text-slate-500 text-center mt-2">
        Start a new adventure with your players
      </p>
    </div>
  );
};

const CreateGameModal: React.FC<CreateGameModalProps> = ({
  isOpen,
  onClose,
  onCreateGame,
}) => {
  const [gameName, setGameName] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (gameName.trim()) {
      onCreateGame(gameName);
      setGameName("");
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-white mb-4">Create New Game</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="game-name"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Game Name
            </label>
            <input
              id="game-name"
              type="text"
              value={gameName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setGameName(e.target.value)
              }
              className="w-full py-2 px-3 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter game name..."
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
  const [games, setGames] = useState<Game[]>([]);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const router = useRouter();

  async function handleCreateGame(gameName: string) {
    //create game
    try {
      const { game } = await createGame({ name: gameName });
      setGames([...games, game]);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleDeleteGame(id: number) {
    try {
      await deleteGame(id);
      setGames(games.filter((game) => game.id !== id));
    } catch (error) {
      console.log(error);
      console.log("Error when deleting a game");
    }
  }
  async function handleLogOut() {
    try {
      await logout();
      setGames([]);
      setUser(null);
    } catch (error) {
      console.log(error);
      console.log("Error while logging out");
    }
  }
  async function handleGoToLogin() {
    router.push("/signin");
  }

  useEffect(() => {
    async function fetchGames() {
      const sessionCookie = await getSession();
      if (!sessionCookie) {
        return;
      }
      setUser(sessionCookie);
      const fetchedGames = await getUserGames();
      setGames(fetchedGames.gamesWithTables);
    }
    fetchGames();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto p-6">
        <header className="mb-8 flex justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Games</h1>
            <p className="text-slate-400">
              Manage and access your RPG campaigns
            </p>
          </div>
          <div>
            {user ? (
              <div className="flex gap-2 items-center">
                <span className="text-slate-400 text-xs ">{user?.email}</span>
                <button
                  className="hover:cursor-pointer font-semibold hover:text-slate-400"
                  type="button"
                  onClick={handleLogOut}
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                className="hover:cursor-pointer font-semibold hover:text-slate-400"
                type="button"
                onClick={handleGoToLogin}
              >
                Log in
              </button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onDeleteGame={handleDeleteGame}
            />
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
