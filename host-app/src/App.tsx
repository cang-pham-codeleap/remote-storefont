/**
 * Main App component.
 * Renders the WorkerRenderer with a demo extension.
 */

import { WorkerRenderer } from './WorkerRenderer';
import './App.css';

/**
 * URL of the extension script to load.
 * In development, the extension is served from a separate server.
 */
const EXTENSION_URL = 'http://localhost:3001/extension.js';

/**
 * App component that demonstrates remote-ui with a sandboxed extension.
 *
 * @returns The main application UI.
 */
function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Remote-UI Demo</h1>
        <p className="app-subtitle">
          Extension UI rendered from an isolated Web Worker
        </p>
      </header>

      <main className="app-main">
        <section className="extension-container">
          <h2 className="section-title">Extension Output</h2>
          <div className="extension-content">
            <WorkerRenderer extensionUrl={EXTENSION_URL} />
          </div>
        </section>

        <section className="info-section">
          <h2 className="section-title">Security Features</h2>
          <ul className="info-list">
            <li>
              <span className="check">✓</span>
              Extension runs in a Web Worker sandbox
            </li>
            <li>
              <span className="check">✓</span>
              No access to window, document, or DOM
            </li>
            <li>
              <span className="check">✓</span>
              No access to cookies or localStorage
            </li>
            <li>
              <span className="check">✓</span>
              Separate JavaScript execution context
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
