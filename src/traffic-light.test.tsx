import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TrafficLight from "./traffic-light";

describe("TrafficLight component", () => {
  test("renders traffic light with title and buttons", () => {
    render(<TrafficLight />);
    expect(screen.getByTestId("traffic-light")).toBeInTheDocument();
    expect(screen.getByTestId("title")).toBeInTheDocument();
    expect(screen.getByTestId("img")).toBeInTheDocument();
    expect(screen.getByTestId("buttons")).toBeInTheDocument();
    expect(screen.getByTestId("start-stop-button")).toBeInTheDocument();
    expect(screen.getByTestId("reset-button")).toBeInTheDocument();
  });

  test("initial state is 'none'", () => {
    render(<TrafficLight />);
    expect(screen.getByTestId("img")).toHaveAttribute("src", "none.png");
  });

  test("clicking start button changes to automatic mode", () => {
    render(<TrafficLight />);
    fireEvent.click(screen.getByTestId("start-stop-button"));
    expect(screen.getByTestId("start-stop-button")).toHaveTextContent("stop");
  });

  test("clicking stop button stops automatic mode", () => {
    render(<TrafficLight />);
    fireEvent.click(screen.getByTestId("start-stop-button"));
    fireEvent.click(screen.getByTestId("start-stop-button"));
    expect(screen.getByTestId("start-stop-button")).toHaveTextContent("start");
  });

  test("clicking reset button resets the traffic light", () => {
    render(<TrafficLight />);
    fireEvent.click(screen.getByTestId("start-stop-button"));
    fireEvent.click(screen.getByTestId("reset-button"));
    expect(screen.getByTestId("img")).toHaveAttribute("src", "none.png");
  });

  test("traffic light transition to green on click start for automatic mode", async () => {
    render(<TrafficLight />);
    await fireEvent.click(screen.getByTestId("start-stop-button"));
    await waitFor(() =>
      expect(screen.getByTestId("img")).toHaveAttribute("src", "green.png")
    );
  });

  test("clicking start button multiple times does not affect automatic mode", async () => {
    render(<TrafficLight />);
    fireEvent.click(screen.getByTestId("start-stop-button"));
    fireEvent.click(screen.getByTestId("start-stop-button"));
    fireEvent.click(screen.getByTestId("start-stop-button"));
    await waitFor(() =>
      expect(screen.getByTestId("img")).toHaveAttribute("src", "green.png")
    );
  });

  test("reset button works correctly after automatic mode stops", async () => {
    render(<TrafficLight />);
    fireEvent.click(screen.getByTestId("start-stop-button"));
    fireEvent.click(screen.getByTestId("reset-button"));
    await waitFor(() =>
      expect(screen.getByTestId("img")).toHaveAttribute("src", "none.png")
    );
  });
});
