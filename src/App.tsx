// Import required modules
import React, { useState, useEffect } from "react";
import axios from "axios";

// Interface for Duty object
interface Duty {
  id: number;
  name: string;
}

// React component
const App: React.FC = () => {
  // State for duties
  const [duties, setDuties] = useState<Duty[]>([]);
  // State to track the selected duty for editing
  const [selectedDuty, setSelectedDuty] = useState<Duty | null>(null);
  // State for form input
  const [formData, setFormData] = useState({ name: "" });

  // Effect to fetch duties from backend on component mount
  useEffect(() => {
    const fetchDuties = async () => {
      try {
        const response = await axios.get<Duty[]>(
          "http://localhost:5000/api/data"
        );
        setDuties(response.data);
      } catch (error) {
        console.error("Error fetching duties", error);
      }
    };

    fetchDuties();
  }, []);

  // Function to handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle duty item click
  const handleDutyClick = (selectedDuty: Duty) => {
    setSelectedDuty(selectedDuty);
    setFormData({ name: selectedDuty.name });
  };

  // Function to handle form submission for updating a duty
  const handleUpdateDuty = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!formData.name.trim()) {
      alert("Duty name cannot be empty");
      return;
    }

    try {
      // Update the duty on the server
      await axios.put(`http://localhost:5000/api/data/${selectedDuty?.id}`, {
        name: formData.name,
      });

      // Refresh duties after updating
      const response = await axios.get<Duty[]>(
        "http://localhost:5000/api/data"
      );
      setDuties(response.data);

      // Clear selected duty and form data
      setSelectedDuty(null);
      setFormData({ name: "" });
    } catch (error) {
      console.error("Error updating duty", error);
    }
  };

  // Function to handle delete button click
  const handleDeleteDuty = async () => {
    try {
      // Delete the duty on the server
      await axios.delete(`http://localhost:5000/api/data/${selectedDuty?.id}`);

      // Refresh duties after deleting
      const response = await axios.get<Duty[]>(
        "http://localhost:5000/api/data"
      );
      setDuties(response.data);

      // Clear selected duty and form data
      setSelectedDuty(null);
      setFormData({ name: "" });
    } catch (error) {
      console.error("Error deleting duty", error);
    }
  };

  return (
    <div>
      <h1>Duties</h1>

      {/* Render duties list */}
      <ul>
        {duties.map((duty) => (
          <li key={duty.id} onClick={() => handleDutyClick(duty)}>
            {duty.name}
            <button onClick={handleDeleteDuty}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Form for updating duty */}
      <form onSubmit={handleUpdateDuty}>
        <label>
          Duty Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Update Duty</button>
      </form>
    </div>
  );
};

export default App;
