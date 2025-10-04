import {Suspense} from 'react';
import './App.css';
import { useRoutes } from 'react-router-dom'
import {routes} from "./router/router";

function App() {
    const routing = useRoutes(routes)
  return (
    <main className="w-full h-screen bg-gray-800 flex items-center justify-center ">
        <Suspense fallback={<div className="text-2xl text-white">Loading...</div>}>
        {routing}
        </Suspense>
    </main>
  );
}

export default App;
