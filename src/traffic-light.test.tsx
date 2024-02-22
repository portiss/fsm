import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TrafficLight from "./traffic-light";

describe("TrafficLight component", () => {
  test("renders traffic light with start button", () => {
    render(<TrafficLight />);
    const startButton = screen.getByText("Start");
    expect(startButton).toBeInTheDocument();
    expect(screen.getByTestId("traffic-light")).toHaveClass(
      "traffic-light-container"
    );
  });

  test("reset button on the screen, onclick show start and not show stop", async () => {
    render(<TrafficLight />);
    const resetButton = screen.getByText("Reset");
    fireEvent.click(resetButton);
    await waitFor(() => screen.getByText("Reset"));
    expect(screen.getByText("Reset")).toBeInTheDocument();
    const startButton = screen.getByText("Start");
    expect(startButton).toBeInTheDocument();
    const stopButton = screen.queryByLabelText("Stop");
    expect(stopButton).not.toBeInTheDocument();
  });

  test('switches back to "Start" button when "Stop" is clicked', async () => {
    render(<TrafficLight />);
    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);
    await waitFor(() => screen.getByText("Stop"));
    expect(screen.getByText("Stop")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Stop"));
    await waitFor(() => screen.getByText("Start"));
    expect(screen.getByText("Start")).toBeInTheDocument();
  });

  test('does not transition when "Start" is clicked while already in automatic mode', async () => {
    render(<TrafficLight />);
    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);
    await waitFor(() => screen.getByText("Stop"));
    expect(screen.getByText("Stop")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Stop"));
    await waitFor(() => screen.getByText("Start"));
    expect(screen.getByText("Start")).toBeInTheDocument();
  });
});
