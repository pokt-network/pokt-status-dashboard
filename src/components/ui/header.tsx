import { Logo } from "./logo";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo */}
        <div className="flex items-center">
          <Logo size="sm" className="h-8 w-auto" />
        </div>

        {/* Right side - Navigation */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">Mainnet</span>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
        </div>
      </div>
    </header>
  );
} 