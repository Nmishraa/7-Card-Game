import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleProp, ViewStyle } from 'react-native';

interface SeoLinkProps extends TouchableOpacityProps {
  href: string;
  onNavigate?: (route: string) => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SeoLink: React.FC<SeoLinkProps> = ({
  href,
  onNavigate,
  onPress,
  children,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      href={href}
      accessibilityRole="link"
      onPress={(e: any) => {
        if (e && typeof e.preventDefault === 'function') {
          e.preventDefault();
        }
        if (onNavigate) {
          onNavigate(href);
        }
        if (onPress) {
          onPress(e);
        }
      }}
      style={style}
      activeOpacity={props.activeOpacity ?? 0.8}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};
