/**
 * Shared type definitions for remote-ui components.
 * These types define the props for components available in the remote environment.
 */

import type { ReactNode } from 'react';

/**
 * Props for the Card component.
 * Card is a container component that groups related content.
 */
export interface CardProps {
  /** The content to render inside the card. */
  children?: ReactNode;
}

/**
 * Props for the Button component.
 * Button is an interactive component that triggers actions.
 */
export interface ButtonProps {
  /** The content to render inside the button. */
  children?: ReactNode;
  /** Callback function triggered when the button is pressed. */
  onPress?: () => void | Promise<void>;
}

/**
 * Available component types in the remote-ui environment.
 */
export const COMPONENT_TYPES = ['Card', 'Button'] as const;

/**
 * Type representing all available component names.
 */
export type ComponentType = (typeof COMPONENT_TYPES)[number];
