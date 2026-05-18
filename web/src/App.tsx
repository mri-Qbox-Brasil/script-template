import React from 'react';
import { NuiProvider } from './context/NuiContext';

const App: React.FC = () => {
  return (
    <NuiProvider>
      <div className="flex items-center justify-center w-full h-full text-white bg-slate-900/80">
        <div className="p-8 text-center bg-slate-800 rounded-lg shadow-xl shadow-black/50 border border-slate-700">
          <h1 className="text-4xl font-bold mb-4">FiveM React Template</h1>
          <p className="text-lg text-slate-400">
            Pronto para começar a criar interfaces incríveis!
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">React</span>
            <span className="px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full text-sm border border-sky-500/30">Tailwind</span>
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm border border-yellow-500/30">Vite</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">TypeScript</span>
          </div>
        </div>
      </div>
    </NuiProvider>
  );
};

export default App;
