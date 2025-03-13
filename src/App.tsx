import { type ChangeEvent, useState, useEffect } from "react";
import "./App.css";
import NormVisualization2D from "./components/NormVisualization2D";
import NormVisualization3D from "./components/NormVisualization3D";

type TabType = "2d" | "3d";

function App(): React.ReactNode {
  const [k, setK] = useState<number>(2);
  const [activeTab, setActiveTab] = useState<TabType>("2d");
  const [fixedRotation, setFixedRotation] = useState<{ x: number, y: number, z: number } | undefined>(undefined);
  const [isRotationFixed, setIsRotationFixed] = useState<boolean>(false);

  // Toggle fixed rotation
  const toggleFixedRotation = (): void => {
    if (isRotationFixed) {
      // Release fixed rotation
      setFixedRotation(undefined);
    } else {
      // Fix rotation to a pleasing angle
      setFixedRotation({ x: 0.5, y: 0.5, z: 0 });
    }
    setIsRotationFixed(!isRotationFixed);
  };

  const handleKChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = Number.parseFloat(e.target.value);
    setK(value);
  };

  return (
    <div className="app-container">
      <h1>
        L<sub>k</sub>-Norm Visualization
      </h1>
      <p>
        Showing the boundary where ||x||<sup>k</sup>
        <sub>k</sub> = 1
      </p>

      <div className="controls">
        <label htmlFor="k-value">k value: {k.toFixed(1)}</label>
        <input
          id="k-value"
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={k}
          onChange={handleKChange}
        />

        {activeTab === "3d" && (
          <button
            type="button"
            onClick={toggleFixedRotation}
            style={{
              marginLeft: "20px",
              padding: "8px 12px",
              background: isRotationFixed ? "#4caf50" : "#646cff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            data-testid="toggle-rotation-button"
          >
            {isRotationFixed ? "Enable Rotation" : "Fix Rotation"}
          </button>
        )}
      </div>

      <div className="tabs">
        <button
          type="button"
          className={activeTab === "2d" ? "active" : ""}
          onClick={() => setActiveTab("2d")}
        >
          R<sup>2</sup> Visualization
        </button>
        <button
          type="button"
          className={activeTab === "3d" ? "active" : ""}
          onClick={() => setActiveTab("3d")}
        >
          R<sup>3</sup> Visualization
        </button>
      </div>

      <div className="visualization-container" style={activeTab === "2d" ? undefined : {
        width: "600px",
        height: "500px",
      }}>
        {activeTab === "2d" ? (
          <NormVisualization2D k={k} />
        ) : (
          <NormVisualization3D k={k} fixedRotation={isRotationFixed ? fixedRotation : undefined} />
        )}
      </div>
    </div>
  );
}

export default App;
