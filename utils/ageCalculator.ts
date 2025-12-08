// Calculate age from date of birth and return formatted string
export const calculateAge = (dateOfBirth: string): string => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  
  // Adjust if birthday hasn't occurred this year
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Adjust for day of month
  if (today.getDate() < dob.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }
  
  // Format output
  if (years >= 1) {
    return years === 1 ? '1 Year' : `${years} Years`;
  } else {
    return months === 1 ? '1 Month' : `${months} Months`;
  }
};
