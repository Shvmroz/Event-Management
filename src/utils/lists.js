// ===================================== Industries =====================================
export const industries = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "real-estate", label: "Real Estate" },
  { value: "consulting", label: "Consulting" },
  { value: "media", label: "Media & Entertainment" },
  { value: "transportation", label: "Transportation" },
  { value: "energy", label: "Energy" },
  { value: "agriculture", label: "Agriculture" },
  { value: "construction", label: "Construction" },
  { value: "hospitality", label: "Hospitality" },
  { value: "non-profit", label: "Non-Profit" },
  { value: "government", label: "Government" },
  { value: "telecommunications", label: "Telecommunications" },
  { value: "automotive", label: "Automotive" },
  { value: "pharmaceuticals", label: "Pharmaceuticals" },
  { value: "aerospace", label: "Aerospace" },
  { value: "other", label: "Other" }
];

// ===================================== Years =====================================
export const generateYears = (startYear, endYear) => {
  const currentYear = new Date().getFullYear();
  const start = startYear || 1900; // Default to 1900
  const end = endYear || currentYear; // Default to current year only
  
  const years = [];
  
  // Generate years from end to start (descending order)
  for (let year = end; year >= start; year--) {
    years.push({
      value: year.toString(),
      label: year.toString()
    });
  }
  
  return years;
};

export const years = generateYears(); // Export Years list


