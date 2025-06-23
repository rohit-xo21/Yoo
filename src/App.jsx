import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank" className="hover:drop-shadow-[0_0_2em_#646cffaa] transition-all duration-300">
          <img src={viteLogo} className="h-24 w-24 animate-spin" style={{animationDuration: '20s'}} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="hover:drop-shadow-[0_0_2em_#61dafbaa] transition-all duration-300">
          <img src={reactLogo} className="h-24 w-24 animate-spin" style={{animationDuration: '10s'}} alt="React logo" />
        </a>
      </div>
      <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Vite + React</h1>
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 mb-8">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg border border-gray-600 transition-colors duration-200 mb-4"
        >
          count is {count}
        </button>
        <p className="text-gray-300">
          Edit <code className="bg-gray-700 px-2 py-1 rounded text-sm font-mono text-yellow-300">src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-gray-400 text-sm max-w-md text-center">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
