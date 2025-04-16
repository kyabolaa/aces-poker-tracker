import { useNavigate } from "react-router-dom";
export default function NewGameButton() {
  const navigate = useNavigate();
  return (
    <button
      className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all text-lg font-semibold"
      onClick={() => navigate("/setup")}
    >
      + New Game
    </button>
  );
}
