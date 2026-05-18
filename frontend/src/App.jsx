import React from "react";
import "./App.css";
import BlochSphere from "./BlochSphere";

function App() {
  return (
    <div className="layout">

      <div className="left-panel">
        <h2 className="panel-heading">Bloch Sphere</h2>
        <BlochSphere />
      </div>

      <div className="middle-panel">
        <h2 className="panel-heading">Quantum Gates</h2>
      </div>

      <div className="right-panel">
        <h2 className="panel-heading">Math Breakdown</h2>
      </div>

    </div>
  );
}

export default App;