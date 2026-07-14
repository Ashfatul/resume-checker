"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettingsStore } from "@/store/settings-store";
import type { AIProvider } from "@/types";
import { Bot, Brain, Server } from "lucide-react";

const providers = [
  { id: "gemini" as AIProvider, label: "Gemini", desc: "Free tier available", icon: Brain },
  { id: "openai" as AIProvider, label: "OpenAI", desc: "GPT-4o", icon: Bot },
  { id: "ollama" as AIProvider, label: "Ollama", desc: "Local, private", icon: Server },
];

export function ProviderSelector() {
  const { provider, setProvider } = useSettingsStore();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Choose Your AI Provider</h3>
      <Tabs value={provider || ""} onValueChange={(v) => setProvider(v as AIProvider)}>
        <TabsList className="grid w-full grid-cols-3">
          {providers.map((p) => (
            <TabsTrigger key={p.id} value={p.id} className="flex flex-col gap-0.5 py-2.5">
              <div className="flex items-center gap-1.5">
                <p.icon className="h-3.5 w-3.5" />
                <span className="font-medium">{p.label}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{p.desc}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
