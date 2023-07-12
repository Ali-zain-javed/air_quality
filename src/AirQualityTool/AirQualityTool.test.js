import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import AirQualityTool from "./index.js";

describe("AirQualityTool", () => {
  it("renders without crashing", () => {
    render(<AirQualityTool />);
  });

  it("updates city 1 input value correctly", () => {
    const { getByPlaceholderText } = render(<AirQualityTool />);
    const city1Input = getByPlaceholderText("Enter City 1");
    const city1Value = "City 1";
    fireEvent.change(city1Input, { target: { value: city1Value } });
    expect(city1Input.value).toEqual(city1Value);
  });

  it("updates city 2 input value correctly", () => {
    const { getByPlaceholderText } = render(<AirQualityTool />);
    const city2Input = getByPlaceholderText("Enter City 2");
    const city2Value = "City 2";
    fireEvent.change(city2Input, { target: { value: city2Value } });
    expect(city2Input.value).toEqual(city2Value);
  });

  it("fetches air quality data for both cities on form submission", async () => {
    const mockData = {
      results: [
        { city: "City 1", measurements: [] },
        { city: "City 2", measurements: [] },
      ],
    };
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    const { getByLabelText, getByText } = render(<AirQualityTool />);
    const city1Input = getByLabelText("City 1");
    const city2Input = getByLabelText("City 2");
    const compareButton = getByText("Compare");

    fireEvent.change(city1Input, { target: { value: "City 1" } });
    fireEvent.change(city2Input, { target: { value: "City 2" } });
    fireEvent.click(compareButton);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.openaq.org/v1/measurements?city=City%201"
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.openaq.org/v1/measurements?city=City%202"
    );
  });
});
