import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';

type ButtonColor = 'primary' | 'secondary' | 'danger' | 'discord' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  children: React.ReactNode;
  color?: ButtonColor;
  size?: ButtonSize;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const COLORS: Record<ButtonColor, {bg: string; text: string; border?: string}> = {
  primary: {bg: '#7c3aed', text: '#fff'},
  secondary: {bg: 'rgba(255,255,255,0.06)', text: '#fff', border: 'rgba(255,255,255,0.15)'},
  danger: {bg: 'transparent', text: '#ff4444', border: 'rgba(255, 68, 68, 0.3)'},
  discord: {bg: '#5865F2', text: '#fff'},
  ghost: {bg: 'transparent', text: '#A78BFA'},
};

const SIZES: Record<ButtonSize, {paddingVertical: number; paddingHorizontal: number; fontSize: number; borderRadius: number}> = {
  sm: {paddingVertical: 8, paddingHorizontal: 16, fontSize: 13, borderRadius: 10},
  md: {paddingVertical: 12, paddingHorizontal: 20, fontSize: 15, borderRadius: 12},
  lg: {paddingVertical: 16, paddingHorizontal: 24, fontSize: 16, borderRadius: 12},
  xl: {paddingVertical: 18, paddingHorizontal: 28, fontSize: 17, borderRadius: 14},
};

export const Button: React.FC<ButtonProps> = ({
  children,
  color = 'primary',
  size = 'md',
  onPress,
  disabled = false,
  loading = false,
  icon,
  style,
}) => {
  const colorStyle = COLORS[color];
  const sizeStyle = SIZES[size];

  return (
    <TouchableOpacity
      style={[
        styles.base,
        {
          backgroundColor: colorStyle.bg,
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          borderRadius: sizeStyle.borderRadius,
          borderWidth: colorStyle.border ? 1 : 0,
          borderColor: colorStyle.border,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={colorStyle.text} size="small" />
      ) : (
        <>
          {icon && icon}
          <Text
            style={[
              styles.text,
              {color: colorStyle.text, fontSize: sizeStyle.fontSize},
            ]}>
            {children}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  text: {
    fontFamily: 'ModernEra-Bold',
  },
});
