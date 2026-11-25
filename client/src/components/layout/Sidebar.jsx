import {
  LayoutDashboard,
  Server,
  Activity,
  Bell,
  Settings,
  ShieldCheck,
  Cloud,
} from "lucide-react";

const navigation = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Infrastructure", icon: Server },
  { name: "Metrics", icon: Activity },
  { name: "Alerts", icon: Bell },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#111827] text-gray-300 flex flex-col border-r border-gray-800">
      <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-800">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Cloud size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">InfraSight</h1>
          <p className="text-xs text-gray-500">Infrastructure Monitoring</p>
        </div>
      </div>

      <div className="px-4 py-6 flex-1">
        <p className="text-xs uppercase tracking-wider text-gray-500 px-3 mb-4">
          Workspace
        </p>

        <nav className="space-y-2">
          {navigation.map(({ name, icon: Icon }, index) => (
            <button
              key={name}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition ${
                index === 0
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={19} />
              {name}
            </button>
          ))}
        </nav>

        <p className="text-xs uppercase tracking-wider text-gray-500 px-3 mt-10 mb-4">
          System
        </p>

        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm hover:bg-gray-800">
          <Settings size={19} />
          Settings
        </button>
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 bg-gray-800/60 p-3 rounded-lg">
          <ShieldCheck className="text-green-400" size={22} />
          <div>
            <p className="text-sm text-white">System Status</p>
            <p className="text-xs text-green-400">Monitoring Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
}