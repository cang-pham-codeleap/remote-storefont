/**
 * Worker sandbox entry point.
 * This file runs inside a Web Worker and provides the isolated environment
 * for extensions to render UI without access to window/document/cookies.
 *
 * SECURITY: Web Workers cannot access:
 * - window
 * - document
 * - localStorage/sessionStorage
 * - cookies
 * - DOM APIs
 */

/// <reference lib="webworker" />

import { createRemoteRoot, retain } from '@remote-ui/core';
import type { RemoteRoot, RemoteChannel } from '@remote-ui/core';
import { createEndpoint } from '@remote-ui/rpc';
import type { MessageEndpoint } from '@remote-ui/rpc';

import { COMPONENT_TYPES } from '../shared/types';

/**
 * Type for the render callback function.
 * Extensions register this callback to render their UI.
 */
type RenderCallback = (root: RemoteRoot<string, true>) => void;

/**
 * Stored render callback from the extension.
 */
let renderCallback: RenderCallback | undefined;

/**
 * Extend the global scope for TypeScript.
 */
declare const self: DedicatedWorkerGlobalScope & {
  onRender: (callback: RenderCallback) => void;
};

/**
 * Global API for extensions to register their render callback.
 * Extensions call this to provide their UI rendering logic.
 *
 * @example
 * self.onRender((root) => {
 *   const card = root.createComponent('Card');
 *   card.appendChild('Hello from extension!');
 *   root.appendChild(card);
 *   root.mount();
 * });
 */
self.onRender = (callback: RenderCallback) => {
  renderCallback = callback;
};

/**
 * Create a MessageEndpoint adapter for the worker's self object.
 * This translates the worker global scope to the interface expected by RPC.
 */
const workerEndpoint: MessageEndpoint = {
  postMessage: (message) => self.postMessage(message),
  addEventListener: (_event, listener) => {
    self.addEventListener('message', listener);
  },
  removeEventListener: (_event, listener) => {
    self.removeEventListener('message', listener);
  },
};

/**
 * Create an RPC endpoint for communication with the host.
 */
const endpoint = createEndpoint(workerEndpoint);

/**
 * Run an extension script in this worker sandbox.
 * This function is exposed to the host via RPC.
 *
 * @param scriptUrl - URL of the extension script to load.
 * @param channel - RemoteChannel from the host to send UI updates.
 */
async function run(scriptUrl: string, channel: RemoteChannel): Promise<void> {
  // Retain the channel to prevent garbage collection.
  // This is required because we use it outside the function scope.
  retain(channel);

  try {
    // Load and execute the extension script.
    // Since this is a Module Worker (Vite default), we must use dynamic import
    // instead of importScripts which is only for Classic Workers.
    await import(scriptUrl);
  } catch (error) {
    console.error('[Sandbox] Failed to load extension script:', error);
    return;
  }

  // If the extension registered a render callback, create the root and call it.
  if (renderCallback != null) {
    // Create a remote root with the allowed component types.
    const remoteRoot = createRemoteRoot(channel, {
      components: [...COMPONENT_TYPES],
    });

    // Let the extension render its UI.
    renderCallback(remoteRoot);
  } else {
    console.warn('[Sandbox] Extension did not register a render callback');
  }
}

// Expose the run function to the host.
endpoint.expose({ run });
