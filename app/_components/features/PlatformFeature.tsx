'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { FeatureComponentProps } from './types';

export const PlatformFeature = ({ className }: FeatureComponentProps) => (
  <>
    <Card className={` bg-none w-full max-h-[500px] ${className}`}>
      <CardContent className="flex-grow overflow-hidden">
        <Image
          src="/features/platform.png"
          alt="Platform"
          width={1200}
          height={600}
          className="w-full h-auto max-w-6xl mx-auto rounded-xl object-cover"
          priority
          quality={90}
        />
      </CardContent>
    </Card>
    <div className="text-white text-center space-y-4 mb-8 max-w-4xl p-2 mx-auto">
      <p className="text-4xl font-semibold text-primary">Platform for Efficient Communication</p>
      <p className="text-foreground text-base">
        NeuraMail offers a powerful platform designed for businesses to streamline email replies, integrate AI, and enhance communication through intelligent features.
      </p>
    </div>
  </>
); 