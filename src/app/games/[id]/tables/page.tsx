import { getGame } from "@/actions/games";
import { GameEventClientPage } from "../../_components/gamePageContent";

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { game } = await getGame(id);
  return <GameEventClientPage game={game} />;
}
