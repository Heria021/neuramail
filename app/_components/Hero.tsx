'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShimmerButton } from '@/components/magicui/shimmer-button';

const Hero: React.FC = () => {
  return (
    <section className="bg-background text-foreground py-20 text-center px-4">
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold max-w-5xl mx-auto mb-6">
        Revolutionize Your Email Management with AI-Powered Replies
      </h1>
      <p className="text-muted-foreground max-w-3xl mx-auto mb-8 text-sm">
        NeuraMail automates your email replies with AI, integrating seamlessly with your company’s knowledge base. Boost productivity with smart, context-aware responses that save time and improve efficiency.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          href="/request-demo"
        >
          <ShimmerButton className="shadow-2xl ">
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              Get Started
            </span>
          </ShimmerButton>
        </Link>
      </div>
      <p className="text-muted-foreground mt-4 text-sm">
        Join 100,000+ businesses automating their communication with NeuraMail
      </p>
    </section>
  );
};

export default Hero;