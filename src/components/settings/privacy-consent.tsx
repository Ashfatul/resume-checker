"use client";

import { useSettingsStore } from "@/store/settings-store";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

export function PrivacyConsent() {
  const { hasConsented, setConsented } = useSettingsStore();

  return (
    <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-3 text-sm">
            <p>
              Your API key is encrypted and stored <strong>only</strong> in this
              browser&apos;s localStorage. We cannot access it.
            </p>
            <p className="text-muted-foreground">
              If you clear browser data, you will need to enter it again.
            </p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasConsented}
                onChange={(e) => setConsented(e.target.checked)}
                className="rounded border-border"
              />
              <span>I understand and consent</span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
