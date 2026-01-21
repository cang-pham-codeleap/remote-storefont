/**
 * WorkerRenderer component.
 * Manages the web worker sandbox and renders remote UI from extensions.
 */

import { useEffect, useMemo, useRef } from 'react';
import {
  createRemoteReceiver,
  RemoteRenderer,
  createController,
} from '@remote-ui/react/host';
import { createEndpoint, fromWebWorker } from '@remote-ui/rpc';

import { Card, Button } from './components';

// Import the worker as a URL using Vite's worker syntax
import SandboxWorker from './worker/sandbox?worker';

/**
 * Controller that maps remote component names to native implementations.
 */
const CONTROLLER = createController({ Card, Button });

/**
 * Props for the WorkerRenderer component.
 */
interface WorkerRendererProps {
  /** URL of the extension script to load in the worker. */
  extensionUrl: string;
}

/**
 * WorkerRenderer loads an extension in a sandboxed web worker
 * and renders its UI using native host components.
 *
 * @param props - Component props with the extension URL.
 * @returns The rendered remote UI.
 */
export function WorkerRenderer({ extensionUrl }: WorkerRendererProps) {
  // Create a receiver to track UI updates from the remote environment.
  const receiver = useMemo(() => createRemoteReceiver(), []);

  // Track the worker instance for cleanup.
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create the worker from our sandbox entry point.
    const worker = new SandboxWorker();
    workerRef.current = worker;

    // Create an RPC endpoint to communicate with the worker.
    const endpoint = createEndpoint<{
      run: (scriptUrl: string, channel: unknown) => Promise<void>;
    }>(fromWebWorker(worker));

    // Call the run function in the worker to load the extension.
    // receiver.receive is the channel that receives UI updates.
    endpoint.call.run(extensionUrl, receiver.receive);

    // Cleanup: terminate the worker on unmount.
    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, [extensionUrl, receiver]);

  return <RemoteRenderer receiver={receiver} controller={CONTROLLER} />;
}
