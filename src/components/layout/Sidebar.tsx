import React from "react";
import {
  LayoutDashboard,
  Activity,
  BarChart3,
  Settings,
  LogOut,
  Network,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Resumen", active: true },
  { icon: Activity, label: "Estado en Vivo" },
  { icon: BarChart3, label: "Analíticas" },
  { icon: Network, label: "Infraestructura" },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-white/5 bg-[#27293d] flex flex-col justify-between hidden md:flex">
      <div>
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Network className="h-5 w-5 text-white" />
            </div>
            NetOps
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                item.active
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-white/5 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors">
          <Settings className="h-5 w-5" />
          Configuración
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-red-400 transition-colors">
          <LogOut className="h-5 w-5" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
