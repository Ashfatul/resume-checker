"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { useSettingsStore } from "@/store/settings-store";
import {
  ArrowRight, Shield, FileCheck, Target, AlertTriangle, Printer,
  Brain, Bot, Server, Settings, FileText, BarChart3, CheckCircle,
  Lock, Eye, Code, MonitorSmartphone,
} from "lucide-react";
import { useEffect } from "react";

const features = [
  { icon: FileCheck, title: "ATS Compatibility", desc: "Check if your resume passes Applicant Tracking Systems" },
  { icon: Eye, title: "Recruiter Perspective", desc: "See your resume through a recruiter's 6-second scan" },
  { icon: Target, title: "Requirement Matching", desc: "Map your skills against every job requirement" },
  { icon: AlertTriangle, title: "Issue Detection", desc: "Find critical, major, and minor issues with severity tags" },
  { icon: CheckCircle, title: "Apply / Don't Apply", desc: "Get a clear verdict with actionable reasoning" },
  { icon: Printer, title: "Printable Report", desc: "Export a clean PDF report of your analysis" },
];

const steps = [
  { icon: Settings, title: "Set Up", desc: "Add your AI provider API key" },
  { icon: FileText, title: "Job Description", desc: "Paste the job posting" },
  { icon: FileCheck, title: "Your Resume", desc: "Upload or paste your resume" },
  { icon: BarChart3, title: "Get Results", desc: "Receive your detailed analysis" },
];

const providers = [
  { icon: Brain, name: "Google Gemini", desc: "Free tier available" },
  { icon: Bot, name: "OpenAI", desc: "GPT-4o and more" },
  { icon: Server, name: "Ollama", desc: "100% local, 100% private" },
];

const privacyPoints = [
  { icon: Shield, text: "Zero-knowledge: we store nothing on our servers" },
  { icon: Lock, text: "API keys encrypted in your browser with AES-256-GCM" },
  { icon: Code, text: "Open source: audit every line of code yourself" },
  { icon: MonitorSmartphone, text: "Self-host on your own infrastructure" },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function LandingPage() {
  const { isConfigured, hydrate } = useSettingsStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const ctaHref = isConfigured ? "/review" : "/settings";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-4 py-20 text-center">
          <motion.div {...fadeUp}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Check Your Resume
              <br />
              <span className="text-primary">Like a Recruiter</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
              AI-powered ATS & recruiter analysis. Get scores, feedback, and a
              clear verdict. 100% private — your data never leaves your browser.
            </p>
            <div className="mt-8">
              <Link href={ctaHref}>
                <Button size="lg" className="text-base px-8">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-center text-2xl font-bold mb-10">How It Works</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-xs font-semibold text-primary mb-1">Step {i + 1}</div>
                  <h3 className="text-sm font-semibold">{step.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-center text-2xl font-bold mb-10">What You Get</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardContent className="pt-6">
                    <feature.icon className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-center text-2xl font-bold mb-10">Privacy & Security</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {privacyPoints.map((point) => (
                <div key={point.text} className="flex items-start gap-3 p-4 rounded-lg bg-background border border-border">
                  <point.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm">{point.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Providers */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-center text-2xl font-bold mb-10">Supported Providers</h2>
            <div className="grid grid-cols-3 gap-4">
              {providers.map((p) => (
                <Card key={p.name} className="text-center">
                  <CardContent className="pt-6">
                    <p.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border py-16 text-center">
          <div className="mx-auto max-w-lg px-4">
            <h2 className="text-2xl font-bold">Ready to improve your resume?</h2>
            <p className="mt-2 text-muted-foreground">
              Free, private, and open source. Get started in under a minute.
            </p>
            <div className="mt-6">
              <Link href={ctaHref}>
                <Button size="lg" className="text-base px-8">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
