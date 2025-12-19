import React, { useEffect, useState, useRef } from "react";
import {
  getAllCandidatePlans,
  getRegisterdCandidate,
  activateEmployeePlan,
} from "../../api/service/axiosService";

const AssignPackage = () => {
  const [candidates, setCandidates] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const candidatesRes = await getRegisterdCandidate();
        // Handling potential response structures
        const candidateData =
          candidatesRes?.data?.data || candidatesRes?.data || [];
        if (Array.isArray(candidateData)) {
          setCandidates(candidateData);
        } else {
          console.error("Unexpected candidate data structure", candidatesRes);
        }

        const plansRes = await getAllCandidatePlans();
        const planData = plansRes?.data?.data || plansRes?.data || [];
        if (Array.isArray(planData)) {
          setPlans(planData);
        } else {
          console.error("Unexpected plan data structure", plansRes);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
    setSearchTerm(candidate.userName);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedCandidate(null); // Clear selection if typing new search
    setIsDropdownOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedCandidate?._id || !selectedPlan) {
      alert("Please select both a candidate and a plan.");
      return;
    }

    try {
      const res = await activateEmployeePlan(
        selectedCandidate._id,
        selectedPlan
      );
      if (res.status === 200 || res.status === 201) {
        alert("Plan assigned successfully!");
        // Optional: Reset form
        setSelectedCandidate(null);
        setSearchTerm("");
        setSelectedPlan("");
      } else {
        alert("Failed to assign plan. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while assigning the plan.");
    }
  };

  const styles = {
    container: {
      padding: "40px",
      maxWidth: "800px",
      margin: "0 auto",
      fontFamily: "'Inter', sans-serif",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      padding: "30px",
      border: "1px solid #f0f0f0",
    },
    header: {
      marginBottom: "30px",
      textAlign: "center",
    },
    title: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#1a1a1a",
      marginBottom: "8px",
    },
    subtitle: {
      color: "#666",
      fontSize: "14px",
    },
    formGroup: {
      marginBottom: "25px",
      position: "relative",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "500",
      color: "#344054",
      fontSize: "14px",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #d0d5dd",
      fontSize: "15px",
      color: "#101828",
      outline: "none",
      transition: "border-color 0.2s, box-shadow 0.2s",
      boxSizing: "border-box",
    },
    select: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #d0d5dd",
      fontSize: "15px",
      color: "#101828",
      outline: "none",
      backgroundColor: "white",
      cursor: "pointer",
      boxSizing: "border-box",
      appearance: "none", // Custom arrow can be added with CSS background if needed
      backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 16px center",
      backgroundSize: "12px",
    },
    dropdown: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      backgroundColor: "white",
      border: "1px solid #d0d5dd",
      borderRadius: "8px",
      marginTop: "4px",
      maxHeight: "250px",
      overflowY: "auto",
      zIndex: 1000,
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    dropdownItem: {
      padding: "10px 16px",
      cursor: "pointer",
      borderBottom: "1px solid #f2f4f7",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "background-color 0.2s",
    },
    dropdownItemHover: {
      backgroundColor: "#f9fafb",
    },
    candidateName: {
      fontWeight: "500",
      color: "#101828",
    },
    candidateEmail: {
      fontSize: "13px",
      color: "#667085",
    },
    button: {
      width: "100%",
      padding: "14px",
      backgroundColor: "#1976D2", // Matches plan color from data
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.2s",
      marginTop: "10px",
    },
    noResults: {
      padding: "12px 16px",
      color: "#666",
      fontSize: "14px",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Assign Candidate Package</h2>
          <p style={styles.subtitle}>
            Select a candidate and a plan to assign.
          </p>
        </div>

        {/* Candidate Search/Select */}
        <div style={styles.formGroup} ref={dropdownRef}>
          <label style={styles.label}>Search Candidate</label>
          <input
            type="text"
            placeholder="Type to search by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsDropdownOpen(true)}
            style={styles.input}
          />

          {isDropdownOpen && (
            <div style={styles.dropdown}>
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate) => (
                  <div
                    key={candidate._id}
                    onClick={() => handleCandidateSelect(candidate)}
                    style={styles.dropdownItem}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f9fafb")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    <div>
                      <div style={styles.candidateName}>
                        {candidate.userName}
                      </div>
                      <div style={styles.candidateEmail}>
                        {candidate.userEmail}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.noResults}>No candidates found.</div>
              )}
            </div>
          )}
        </div>

        {/* Plan Select */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Select Plan</label>
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            style={styles.select}
          >
            <option value="" disabled>
              -- Choose a Plan --
            </option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} - {plan.displayPrice}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          style={styles.button}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#1565C0")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#1976D2")
          }
          disabled={loading}
        >
          {loading ? "Processing..." : "Assign Package"}
        </button>
      </div>
    </div>
  );
};

export default AssignPackage;
