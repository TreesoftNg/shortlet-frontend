'use client';

import { Box } from '@chakra-ui/react';
import Link from 'next/link';
import type { ReactNode } from 'react';

type AppButtonVariant =
  | 'primary'
  | 'outline'
  | 'outlineMuted'
  | 'soft'
  | 'ink';
type AppButtonSize = 'sm' | 'md' | 'lg';

type AppButtonProps = {
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  fullWidth?: boolean;
  href?: string;
  leftIcon?: ReactNode;
  children: ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  'aria-label'?: string;
};

const heights: Record<AppButtonSize, string> = {
  sm: '38px',
  md: '48px',
  lg: '52px',
};

const variantStyles: Record<
  AppButtonVariant,
  {
    bg: string;
    color: string;
    border: string;
    borderColor: string;
    hoverBg: string;
  }
> = {
  primary: {
    bg: 'brand.500',
    color: 'white',
    border: 'none',
    borderColor: 'transparent',
    hoverBg: 'brand.600',
  },
  outline: {
    bg: 'white',
    color: 'ink',
    border: '1px solid',
    borderColor: 'ink',
    hoverBg: 'bg.soft',
  },
  outlineMuted: {
    bg: 'white',
    color: 'ink',
    border: '1px solid',
    borderColor: '#C9C9C4',
    hoverBg: 'bg.soft',
  },
  soft: {
    bg: 'bg.soft',
    color: 'ink',
    border: 'none',
    borderColor: 'transparent',
    hoverBg: 'line.2',
  },
  ink: {
    bg: 'ink',
    color: 'white',
    border: 'none',
    borderColor: 'transparent',
    hoverBg: 'ink.2',
  },
};

export function AppButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  href,
  leftIcon,
  children,
  type = 'button',
  disabled,
  onClick,
  'aria-label': ariaLabel,
}: AppButtonProps) {
  const styles = variantStyles[variant];

  const content = (
    <>
      {leftIcon}
      {children}
    </>
  );

  const visualProps = {
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: '10px',
    h: heights[size],
    px: size === 'sm' ? '14px' : '22px',
    w: fullWidth ? 'full' : undefined,
    borderRadius: size === 'sm' ? '10px' : '12px',
    bg: styles.bg,
    color: styles.color,
    border: styles.border,
    borderColor: styles.borderColor,
    fontWeight: '700',
    fontSize: size === 'sm' ? '13px' : '15px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    _hover: disabled ? undefined : { bg: styles.hoverBg },
    flexShrink: 0,
    textDecoration: 'none',
  };

  if (href) {
    return (
      <Box asChild {...visualProps}>
        <Link href={href} aria-disabled={disabled} aria-label={ariaLabel}>
          {content}
        </Link>
      </Box>
    );
  }

  const nativeProps = {
    type,
    disabled,
    onClick,
    'aria-label': ariaLabel,
  };

  return (
    <Box as="button" {...visualProps} {...(nativeProps as object)}>
      {content}
    </Box>
  );
}
