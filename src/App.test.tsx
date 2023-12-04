import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import App from "./App";

// Mock Axios to prevent actual network requests
jest.mock("axios");

describe("App Component", () => {
  // Mock the duties data
  const mockDuties = [
    { id: 1, name: "Duty 1" },
    { id: 2, name: "Duty 2" },
    // Add more duties as needed
  ];

  beforeEach(() => {
    // Mock the Axios get function to resolve with the mockDuties
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
      data: mockDuties,
    });
  });

  test("renders duties and updates duty", async () => {
    // Render the component
    render(<App />);

    // Ensure duties are rendered
    await waitFor(() => {
      mockDuties.forEach((duty) => {
        expect(screen.getByText(duty.name)).toBeInTheDocument();
      });
    });

    // Click on a duty to select it
    fireEvent.click(screen.getByText("Duty 1"));

    // Update the duty name
    fireEvent.change(screen.getByLabelText("Duty Name:"), {
      target: { value: "Updated Duty" },
    });

    // Submit the form to update the duty
    fireEvent.click(screen.getByText("Update Duty"));

    // Ensure the Axios PUT function was called with the correct parameters
    expect(axios.put).toHaveBeenCalledWith("http://localhost:5000/api/data/1", {
      name: "Updated Duty",
    });

    // Ensure the updated duties are rendered
    await waitFor(() => {
      expect(screen.getByText("Updated Duty")).toBeInTheDocument();
    });
  });
});
