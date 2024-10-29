export type IconName = 'home' | 'user' | 'settings';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}
