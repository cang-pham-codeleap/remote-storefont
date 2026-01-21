/**
 * Button component - Native implementation for the host app.
 * Handles user interactions and triggers the onPress callback.
 */

import type { ButtonProps } from '../shared/types';
import './Button.css';

/**
 * Button component that handles user clicks.
 * Proxies the onPress callback from the remote extension.
 *
 * @param props - Component props containing children and onPress handler.
 * @returns A styled button element.
 */
export function Button({ children, onPress }: ButtonProps) {
  /**
   * Handle click events.
   * onPress may return a Promise (from RPC), so we don't block on it.
   */
  const handleClick = () => {
    if (onPress) {
      // Fire and forget - the remote callback handles its own state
      onPress();
    }
  };

  return (
    <button type="button" className="remote-button" onClick={handleClick}>
      {children}
    </button>
  );
}
