import { createComputed, createSignal, useComputed, useSignal } from '../lib';
import './App.css';
import signalsLogo from './assets/alien-signals.png';
import reactLogo from './assets/react.svg';

const countSignal = createSignal(0);
const xCountSignal = createComputed(() => countSignal() * 2);

export default function App() {
  const [_count, setCount] = useSignal(countSignal);
  const xCount = useComputed(xCountSignal);

  return (
    <>
      <div className="logo-wrapper">
        <a
          href="https://github.com/stackblitz/alien-signals"
          target="_blank"
          rel="noreferrer">
          <img
            src={signalsLogo}
            className="logo signals"
            alt="Alien Signals logo"
          />
        </a>
        <a
          href="https://react.dev"
          target="_blank"
          rel="noreferrer">
          <img
            src={reactLogo}
            className="logo react"
            alt="React logo"
          />
        </a>
      </div>
      <h1>Signals + React</h1>
      <div className="card">
        <button onClick={() => setCount(val => val + 1)}>count * 2 is {xCount}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Alien Signals and React logos to learn more</p>
    </>
  );
}
