'use client';
import { FeatureComponentProps } from './types';
import { AnimatedBeamMultipleOutputDemo } from './NetworkFlow';

export const GuidanceFeature = ({ className }: FeatureComponentProps) => (
  <>
    <div className={` bg-none w-full h-auto ${className}`}>
      <AnimatedBeamMultipleOutputDemo />
    </div>
    <div className="text-white text-center space-y-4 mb-8 max-w-4xl p-2 mx-auto">
      <p className="text-4xl font-semibold text-primary">Seamless Integrations</p>
      <p className="text-foreground text-base">
        NeuraMail connects effortlessly with other platforms, ensuring smooth data flow and enhancing your productivity with AI-powered email responses and external tool support.
      </p>
    </div>
  </>
); 