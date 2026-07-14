"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Stepper } from "@/components/shared/stepper";
import { ProviderSelector } from "@/components/settings/provider-selector";
import { ApiKeyForm } from "@/components/settings/api-key-form";
import { PrivacyConsent } from "@/components/settings/privacy-consent";
import { useSettingsStore } from "@/store/settings-store";
import { ArrowLeft, ArrowRight, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const { provider, hasConsented, hydrate, saveApiKey, clearSettings } = useSettingsStore();
  const [saving, setSaving] = useState(false);
  const apiKeyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleSave = async () => {
    if (!provider) {
      toast.error("Please select an AI provider");
      return;
    }
    if (provider !== "ollama" && !hasConsented) {
      toast.error("Please accept the privacy notice to continue");
      return;
    }

    setSaving(true);
    try {
      if (provider !== "ollama") {
        const key = apiKeyRef.current?.value?.trim();
        if (!key) {
          toast.error("Please enter your API key");
          setSaving(false);
          return;
        }
        await saveApiKey(key);
      }
      toast.success("Settings saved!");
      router.push("/review");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    clearSettings();
    toast.success("All settings cleared");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-xl px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <Stepper currentStep={0} />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Configure your AI provider to get started
              </p>
            </div>

            <ProviderSelector />
            <ApiKeyForm apiKeyRef={apiKeyRef} />
            {provider && provider !== "ollama" && <PrivacyConsent />}

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground">
                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Clear Data
              </Button>
              <Button
                onClick={handleSave}
                disabled={!provider || saving || (provider !== "ollama" && !hasConsented)}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save & Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
