import React, { useState, useEffect, useRef } from "react";
import FSM from "./fsm/finite-state-machine";
import green from "./assets/green.png";
import red from "./assets/red.png";
import yellow from "./assets/yellow.png";
import none from "./assets/none.png";

const Color = {
  RED: "red",
  YELLOW: "yellow",
  GREEN: "green",
  PINK: "pink",
  NONE: "none",
} as const;

const Action = {
  START: "start",
  CHANGE: "change",
  STOP: "stop",
} as const;

type LightState = (typeof Color)[keyof typeof Color];

const stateToImageMapping: Record<string, string> = {
  [Color.RED]: red,
  [Color.YELLOW]: yellow,
  [Color.GREEN]: green,
  none: none,
};

const TrafficLight: React.FC = () => {
  const [currentState, setCurrentState] = useState<LightState>(Color.NONE);
  const [automaticMode, setAutomaticMode] = useState<boolean>(false);
  const errorRef = useRef<string>("");

  const handleTransition = (nextState: LightState): void => {
    setCurrentState(nextState);
  };

  const trafficLightFSM = new FSM(Color.NONE, handleTransition);

  trafficLightFSM.addTransition(Color.NONE, Action.START, Color.GREEN);
  trafficLightFSM.addTransition(Color.GREEN, Action.CHANGE, Color.YELLOW);
  trafficLightFSM.addTransition(Color.YELLOW, Action.CHANGE, Color.RED);
  trafficLightFSM.addTransition(Color.RED, Action.CHANGE, Color.GREEN);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    const handleTimeout = () => {
      timerId = setTimeout(() => {
        trafficLightFSM.transition(Action.CHANGE);
        handleTimeout();
      }, 1800);
    };

    if (automaticMode) {
      setCurrentState(Color.NONE);
      trafficLightFSM.transition(Action.START);
      handleTimeout();
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [automaticMode]);

  const handleStartStop = (): void => {
    errorRef.current = "";
    setAutomaticMode((prev) => !prev);
  };

  const handleReset = (): void => {
    setCurrentState(Color.NONE);
    setAutomaticMode(false);
  };

  const getImageByColor = (color: LightState) => {
    if (!stateToImageMapping[color]) {
      errorRef.current = `Invalid state: ${color}`;
      return stateToImageMapping[Color.NONE];
    }
    return stateToImageMapping[color];
  };

  return (
    <div data-testid="traffic-light" className="traffic-light-container">
      <div className="title" data-testid="title">
        <h1>
          Traffic Light
          <span>Finite State Machine</span>
        </h1>
      </div>
      <img
        data-testid="img"
        src={getImageByColor(currentState)}
        alt={`Traffic light is ${currentState}`}
      />
      <div className="buttons" data-testid="buttons">
        <button data-testid="start-stop-button" onClick={handleStartStop}>
          {automaticMode ? Action.STOP : Action.START}
        </button>
        <button data-testid="reset-button" onClick={handleReset}>
          Reset
        </button>
        {currentState === "pink" && ( //TEST: pink is not a valid state
          <span style={{ color: "red" }}>{errorRef.current}</span>
        )}
      </div>
    </div>
  );
};

export default TrafficLight;
