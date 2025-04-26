import React from 'react';
import Hero from './_components/Hero';
import Features from './_components/Features';
import Navbar from './_components/Navbar';
import Footer from './_components/Footer';
import { Separator } from '@/components/ui/separator';
import { NeuraMail } from './_components/NeuraMail';
import { Cores } from './_components/Cores';
import { Reviews } from './_components/Reviews';
import { cn } from "@/lib/utils";

// Only applicable for `app/` directory metadata
export const metadata = {
  title: 'NeuraMail - AI-Powered Email Assistant',
  description: 'Transform your email experience with AI-powered assistance',
};

export default function Home() {
  return (
    <main className={cn("min-h-screen bg-background text-foreground flex flex-col")}>

      <Navbar />


      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Hero />
          <Features />
        </div>
      </div>

      <section className="mx-auto my-20 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-8 max-w-4xl p-2 mx-auto">
            <h2 className="text-5xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
              The Core Features Behind NeuralMail
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              NeuralMail is designed to revolutionize your email management. With powerful AI, seamless integrations, and top-notch security, these core features make NeuralMail your ultimate email assistant.
            </p>
          </div>
          <Cores />
        </div>
      </section>

      <Separator />

      <Reviews />

      <Footer />

      <NeuraMail />
    </main>
  );
}