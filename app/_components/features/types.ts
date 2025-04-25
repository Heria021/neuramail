import { LucideIcon } from 'lucide-react';

export interface Feature {
  key: string;
  icon: LucideIcon;
  title: string;
  description: string;
  scrollToIndex: number;
}

export interface FeatureComponentProps {
  className?: string;
} 