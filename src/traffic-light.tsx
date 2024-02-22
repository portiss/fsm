import React, { useState, useEffect } from "react";
import FSM from "./fsm/finite-state-machine";
import green from "./assets/green.png";
import red from "./assets/red.png";
import yellow from "./assets/yellow.png";
import none from "./assets/none.png";

enum Color {
  RED = "red",
  YELLOW = "yellow",
  GREEN = "green",
  NONE = "none",
}

enum ActionEvent {
  START = "start",
  CHANGE = "change",
  STOP = "stop",
}

const stateToImageMapping: Record<string, string> = {
  [Color.RED]: red,
  [Color.YELLOW]: yellow,
  [Color.GREEN]: green,
  [Color.NONE]: none,
};

const TrafficLight: React.FC = () => {
  const [currentState, setCurrentState] = useState<string>(Color.NONE);
  const [automaticMode, setAutomaticMode] = useState<boolean>(false);

  const handleTransition = (nextState: string): void => {
    setCurrentState(nextState);
  };
  const trafficLightFSM = new FSM(Color.NONE, handleTransition);

  trafficLightFSM.addTransition(Color.NONE, ActionEvent.START, Color.GREEN);
  trafficLightFSM.addTransition(Color.GREEN, ActionEvent.CHANGE, Color.YELLOW);
  trafficLightFSM.addTransition(Color.YELLOW, ActionEvent.CHANGE, Color.RED);
  trafficLightFSM.addTransition(Color.RED, ActionEvent.CHANGE, Color.GREEN);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    const handleTimeout = () => {
      timerId = setTimeout(() => {
        trafficLightFSM.transition(ActionEvent.CHANGE);
        handleTimeout();
      }, 2000);
    };

    if (automaticMode) {
      setCurrentState(Color.NONE);
      trafficLightFSM.transition(ActionEvent.START);
      handleTimeout();
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [automaticMode]);

  const handleStartStop = (): void => {
    setAutomaticMode((prev) => !prev);
  };

  const handleReset = (): void => {
    setCurrentState(Color.NONE);
    setAutomaticMode(false);
  };

  const getImageByColor = (Color: string) => {
    if (!stateToImageMapping[Color]) {
      throw `Color:${Color} not found`;
    }
    return stateToImageMapping[Color];
  };

  return (
    <div data-testid="traffic-light" className="traffic-light-container">
      <div className="title">
        <h1>
          Traffic Light
          <span>Finite State Machine</span>
        </h1>
      </div>
      <img data-testid="img" src={getImageByColor(currentState)} />
      <div className="buttons" data-testid="buttons">
        <button data-testid="start-stop-button" onClick={handleStartStop}>
          {automaticMode ? ActionEvent.STOP : ActionEvent.START}
        </button>
        <button data-testid="reset-button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default TrafficLight;
