/**
 * Card component - Native implementation for the host app.
 * Renders as a styled container for grouping related content.
 */

import type { CardProps } from '../shared/types';
import './Card.css';

/**
 * Card component that displays content in a styled container.
 *
 * @param props - Component props containing children to render.
 * @returns A styled div container with the card content.
 */
export function Card({ children }: CardProps) {
  return <div className="remote-card">{children}</div>;
}
