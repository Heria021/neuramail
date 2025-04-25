'use client';

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { OmniFeature } from './features/OmniFeature';
import { GuidanceFeature } from './features/GuidanceFeature';
import { PlatformFeature } from './features/PlatformFeature';
import { featureData } from './features/data';
import { AuroraBackground } from '@/components/ui/aurora-background';

const Features = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    containScroll: 'trimSnaps'
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
        setSelectedIndex(index);
      }
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleScroll = useCallback((e: React.WheelEvent) => {
    setScrollDirection(e.deltaY > 0 ? 'down' : 'up');
  }, []);

  const featureComponents = useMemo(() => [
    <OmniFeature key="omni" />,
    <GuidanceFeature key="guidance" />,
    <PlatformFeature key="platform" />,
  ], []);

  const renderFeatureCarousel = useCallback((index: number) => (
    <motion.div
      key={index}
      className="min-w-full flex flex-col items-center gap-4 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: 'easeInOut',
      }}
    >
      {featureComponents[index]}
    </motion.div>
  ), [featureComponents]);

  return (
    <motion.section
      className="bg-background text-white py-16 px-4"
      onWheel={handleScroll}
      animate={{
        scale: scrollDirection === 'down' ? 1.05 : 1,
        opacity: scrollDirection === 'down' ? 0.95 : 1,
      }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Feature Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full">
          {featureData.map((feature) => (
            <motion.button
              key={feature.key}
              onClick={() => scrollTo(feature.scrollToIndex)}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-opacity duration-300 ${selectedIndex === feature.scrollToIndex
                  ? 'opacity-100'
                  : 'opacity-50 hover:opacity-80'
                }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <feature.icon className="h-6 w-6" />
              <p className="text-sm font-medium mt-2">{feature.title}</p>
              <p className="text-xs text-muted-foreground text-center">
                {feature.description}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Carousel */}
          <motion.div
            className="overflow-hidden w-full"
            ref={emblaRef}
            animate={{
              scale: scrollDirection === 'down' ? 1.05 : 1,
              opacity: scrollDirection === 'down' ? 0.95 : 1,
            }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
            }}
          >
            <div className="flex">
              {featureComponents.map((_, index) => renderFeatureCarousel(index))}
            </div>
          </motion.div>
      </div>
    </motion.section>
  );
};

export default Features;