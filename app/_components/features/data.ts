import { MessageSquare, Rocket, LayoutDashboard } from 'lucide-react';
import { Feature } from './types';

export const featureData: Feature[] = [
  {
    key: 'omni',
    icon: MessageSquare,
    title: 'Omni-channel',
    description: 'Chat, email, phone, social, and more',
    scrollToIndex: 0,
  },
  {
    key: 'guidance',
    icon: Rocket,
    title: 'Guidance',
    description: 'Setup, integration, escalation',
    scrollToIndex: 1,
  },
  {
    key: 'platform',
    icon: LayoutDashboard,
    title: 'Platform',
    description: 'Unified inbox, tickets, evaluation',
    scrollToIndex: 2,
  },
]; 

