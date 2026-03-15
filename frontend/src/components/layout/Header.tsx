import { ConnectionStatus } from "./ConnectionStatus";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
      <h1 className="text-xl font-bold text-white tracking-tight">
        <span className="text-purple-400">Quant</span>Spot
      </h1>
      <ConnectionStatus />
    </header>
  );
}
