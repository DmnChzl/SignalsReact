import Signal, { useComputed, useSignal } from '../lib';
import './App.css';
import reactLogo from './assets/react.svg';
import signalsLogo from './assets/signals.png';

const countSignal = new Signal.State(0);
const xCountSignal = new Signal.Computed(() => countSignal.get() * 2);

export default function App() {
  const [count, setCount] = useSignal(countSignal);
  const xCount = useComputed(xCountSignal);

  return (
    <>
      <div>
        <a
          href="https://github.com/tc39/proposal-signals"
          target="_blank"
          rel="noreferrer">
          <img
            src={signalsLogo}
            className="logo"
            alt="Signals logo"
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
        <button onClick={() => setCount(count + 1)}>count * 2 is {xCount}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Signals and React logos to learn more</p>
    </>
  );
}
