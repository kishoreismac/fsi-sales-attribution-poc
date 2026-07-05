"use client";

import { Columns2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type UiDesignMode = "original" | "new";

const modes: Array<{ value: UiDesignMode; label: string }> = [
  { value: "original", label: "Original Design" },
  { value: "new", label: "New Design" }
];

export function UiComparisonToggle() {
  const [mode, setMode] = useState<UiDesignMode>("new");

  useEffect(() => {
    const savedMode = window.localStorage.getItem("fsi-ui-design");
    const nextMode: UiDesignMode = savedMode === "original" ? "original" : "new";
    setMode(nextMode);
    document.documentElement.dataset.uiDesign = nextMode;
  }, []);

  function selectMode(nextMode: UiDesignMode) {
    setMode(nextMode);
    window.localStorage.setItem("fsi-ui-design", nextMode);
    document.documentElement.dataset.uiDesign = nextMode;
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1 shadow-sm" aria-label="UI design comparison">
      <Columns2 size={15} className="ml-2 text-muted-foreground" aria-hidden="true" />
      {modes.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => selectMode(item.value)}
          className={cn(
            "h-8 rounded-md px-3 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground",
            mode === item.value && "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground"
          )}
        >
          <span className="hidden lg:inline">{item.label}</span>
          <span className="lg:hidden">{item.value === "original" ? "Original" : "New"}</span>
        </button>
      ))}
    </div>
  );
}
