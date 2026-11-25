import { Search, Bell, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
        <p className="text-sm text-gray-500">
          Monitor your infrastructure in real time
        </p>
      </div>

      <div className="flex items-center gap-6">
        <Search className="text-gray-500 cursor-pointer" size={20} />
        <div className="relative">
          <Bell className="text-gray-500 cursor-pointer" size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <UserCircle size={30} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Admin</span>
        </div>
      </div>
    </header>
  );
}