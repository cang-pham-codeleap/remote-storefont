/**
 * Extension entry point.
 * This code runs inside the host's Web Worker sandbox.
 *
 * IMPORTANT: This code cannot access:
 * - window
 * - document
 * - localStorage/sessionStorage
 * - cookies
 * - Any DOM APIs
 *
 * It only has access to:
 * - self (the worker global scope)
 * - The onRender callback provided by the host
 * - RemoteRoot API from @remote-ui/core
 */

import type { RemoteRoot } from '@remote-ui/core';

/**
 * Extend the global scope for TypeScript.
 */
declare const self: DedicatedWorkerGlobalScope & {
  onRender: (callback: (root: RemoteRoot<string, true>) => void) => void;
};

/**
 * Track the current button click count for demo purposes.
 */
let clickCount = 0;

/**
 * Register the render callback with the host.
 * This is called when the host runs our extension script.
 */
self.onRender((root) => {
  // Create a Card component.
  const card = root.createComponent('Card');

  // Create text content for the card.
  const textNode = root.createText('Hello from Extension! 👋');
  card.appendChild(textNode);

  // Create a Button component with an onPress handler.
  const button = root.createComponent('Button', {
    onPress: () => {
      clickCount++;
      // Update the text content to show click count.
      textNode.updateText(`Clicked ${clickCount} time${clickCount !== 1 ? 's' : ''}! 🎉`);

      // Log to demonstrate we're running in a worker.
      console.log('[Extension] Button clicked! Count:', clickCount);

      // Attempt to access window to prove it's not available.
      try {
        // @ts-expect-error - window is not available in workers
        console.log('Window:', typeof window);
      } catch {
        console.log('[Extension] ✓ Cannot access window (as expected)');
      }
    },
  });
  button.appendChild(root.createText('Click me! 🚀'));

  // Append button to card.
  card.appendChild(button);

  // Add another button to show security demo.
  const securityButton = root.createComponent('Button', {
    onPress: () => {
      // Try to access various browser APIs that should be blocked.
      const results: string[] = [];

      try {
        // @ts-expect-error - document is not available in workers
        results.push(`document: ${typeof document}`);
      } catch {
        results.push('document: blocked ✓');
      }

      try {
        // @ts-expect-error - window is not available in workers
        results.push(`window: ${typeof window}`);
      } catch {
        results.push('window: blocked ✓');
      }

      try {
        // @ts-expect-error - localStorage is not available in workers
        results.push(`localStorage: ${typeof localStorage}`);
      } catch {
        results.push('localStorage: blocked ✓');
      }

      console.log('[Extension] Security check:', results.join(', '));
      textNode.updateText('Security check complete! See console.');
    },
  });
  securityButton.appendChild(root.createText('Test Security 🔒'));
  card.appendChild(securityButton);

  // Append card to root.
  root.appendChild(card);

  // Mount the UI.
  root.mount();

  console.log('[Extension] UI mounted successfully!');
});
