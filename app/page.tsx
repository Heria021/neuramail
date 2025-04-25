import React from 'react';
import Hero from './_components/Hero';
import Features from './_components/Features';
import Navbar from './_components/Navbar';
import { cn } from "@/lib/utils";
import Footer from './_components/Footer';
import { Separator } from '@/components/ui/separator';
import { NeuraMail } from './_components/NeuraMail';
import { Cores } from './_components/Cores';

export const metadata = {
  title: 'Neuramail - AI-Powered Email Assistant',
  description: 'Transform your email experience with AI-powered assistance',
};

export default function Home() {
  return (
    <main className={cn(
      "min-h-screen bg-black text-white",
      "flex flex-col"
    )}>

      <Navbar />
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Hero />
          <Features />
        </div>
      </div>
      <div className="mx-auto my-20">
        <div className="max-w-7xl">
          <div className="text-white text-center space-y-4 mb-8 max-w-4xl p-2 mx-auto ">
            <p className="text-5xl font-semibold">Cores Beind NeuraMail</p>
            <p className=' text-foreground '>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat rem tempore pariatur dolore, labore asperiores libero, minima quisquam excepturi perspiciatis eligendi dicta dolorem vero.</p>
          </div>
          <Cores />
        </div>
      </div>
      <Separator />
      <Footer />
      <NeuraMail />
    </main>
  );
}

