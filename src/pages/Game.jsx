import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import games from "../data/games.json";
import PageHeading from "../components/PageHeading";
import GameDetails from "../components/GameDetails";
import "./Home.css";

const Game = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);

  useEffect(() => {
    const foundGame = games.find(g => String(g.id) === String(id));
    setGame(foundGame);
  }, [id]);

  return (
    <div className="home">
      <div className="home-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="featured" style={{ maxWidth: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <PageHeading title="" highlight="Game Details" center={false} />
          <button className="game-btn" onClick={() => navigate('/store')} style={{ padding: '12px 24px' }}>
            ← Back to Store
          </button>
        </div>
        {game ? (
          <div style={{
            background: 'rgba(17, 24, 39, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '24px',
            backdropFilter: 'blur(20px)'
          }}>
            <GameDetails game={game} />
          </div>
        ) : (
          <div style={{ color: 'var(--text-dim)' }}>Game not found.</div>
        )}
      </div>
    </div>
  );
};

export default Game;
