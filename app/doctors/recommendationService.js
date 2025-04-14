export const getDoctorRecommendations = async (disease, city, specialization = null) => {
  try {
    // Remove timeout to eliminate delay
    const controller = new AbortController();
    
    const response = await fetch('http://localhost:5000/doctorFinder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ disease, city, specialization }),
      signal: controller.signal
    }).catch(err => {
      throw new Error("Network error: API server might be down");
    });

    if (!response.ok) {
      // Check if error response is JSON before parsing
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to get recommendations: ${response.status}`);
      } else {
        throw new Error(`Failed to get recommendations: ${response.status}`);
      }
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Server didn't return JSON data");
    }
  } catch (error) {
    console.error('Error fetching doctor recommendations:', error);
    
    try {
      // Fallback to get all doctors in the specified city without delay
      const controller = new AbortController();
      
      const allDoctorsResponse = await fetch(`http://localhost:5000/doctors?city=${encodeURIComponent(city)}`, {
        signal: controller.signal
      }).catch(err => {
        throw new Error("Network error on fallback request");
      });
      
      if (allDoctorsResponse.ok) {
        const contentType = allDoctorsResponse.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const allDoctors = await allDoctorsResponse.json();
          return allDoctors;
        } else {
          throw new Error("Fallback API didn't return JSON data");
        }
      } else {
        throw new Error(`Fallback failed with status: ${allDoctorsResponse.status}`);
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      
      // Return mock data for specific diseases when all APIs fail
      if (disease && ['heart disease', 'hypertension', 'chest pain', 'cardiovascular', 'heart'].some(
        term => disease.toLowerCase().includes(term))) {
        return [
          {
            id: 33,
            name: "Dr. Reshma Kapoor",
            specialization: "Cardiology",
            hospital: "Shanti Wellness Hospital",
            state: "Uttar Pradesh",
            city: "Noida",
            experience: 9,
            rating: 3.7,
            contact: "9648790558",
          },
          {
            id: 113,
            name: "Dr. Aditya Mohanty",
            specialization: "Cardiology",
            hospital: "Harmony Health Hub",
            state: "Uttar Pradesh",
            city: "Noida",
            experience: 9,
            rating: 1.5,
            contact: "9968564999",
          }
        ];
      }
    }
    
    // Use mockData for more common conditions
    if (disease) {
      return getMockDoctorsForDisease(disease);
    }
    
    throw error;
  }
};

// Helper function to get mock data for common diseases
function getMockDoctorsForDisease(disease) {
  disease = disease.toLowerCase();
  
  if (disease.includes('fever') || disease.includes('flu') || disease.includes('cold')) {
    return [
      {
        id: 40,
        name: "Dr. Suresh Kumar",
        specialization: "General Medicine",
        hospital: "City Hospital",
        state: "Delhi",
        city: "Delhi",
        experience: 12,
        rating: 4.3,
        contact: "9876543210",
      },
      {
        id: 41,
        name: "Dr. Priya Sharma",
        specialization: "General Medicine",
        hospital: "Apollo Hospital",
        state: "Delhi",
        city: "Delhi",
        experience: 8,
        rating: 4.5,
        contact: "8765432109",
      }
    ];
  }
  
  if (disease.includes('diabetes') || disease.includes('thyroid')) {
    return [
      {
        id: 42,
        name: "Dr. Anand Verma",
        specialization: "Endocrinology",
        hospital: "Medanta",
        state: "Haryana",
        city: "Gurgaon",
        experience: 15,
        rating: 4.7,
        contact: "7654321098",
      },
      {
        id: 43,
        name: "Dr. Deepa Kapoor",
        specialization: "Endocrinology",
        hospital: "Fortis",
        state: "Delhi",
        city: "Delhi",
        experience: 10,
        rating: 4.4,
        contact: "6543210987",
      }
    ];
  }
  
  if (disease.includes('skin') || disease.includes('rash') || disease.includes('acne')) {
    return [
      {
        id: 44,
        name: "Dr. Rahul Mehta",
        specialization: "Dermatology",
        hospital: "Skin Care Clinic",
        state: "Delhi",
        city: "Delhi",
        experience: 9,
        rating: 4.6,
        contact: "9876543211",
      }
    ];
  }
  
  // Default mock data for any other disease
  return [
    {
      id: 45,
      name: "Dr. Rajesh Singh",
      specialization: "General Medicine",
      hospital: "Max Hospital",
      state: "Delhi",
      city: "Delhi",
      experience: 14,
      rating: 4.2,
      contact: "8765432100",
    }
  ];
}

export const processDoctorData = (doctors) => {
  if (!doctors || doctors.length === 0) {
    return [];
  }
  
  return doctors.map(doctor => ({
    id: doctor.id,
    name: doctor.name,
  
    specialty: doctor.specialization,
    experience: `${doctor.experience} years`,
    rating: parseFloat(doctor.rating || 0).toFixed(1),
    location: `${doctor.hospital}, ${doctor.city}`,
    distance: Math.round(Math.random() * 10 * 10) / 10, 
    // Use UI Avatars for doctor images witfallback
    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0D8ABC&color=fff&size=200`,
    availability: "Available Today",
    contact: doctor.contact,
    state: doctor.state,
    // Calculate the recommendation score as displayed in the notebook
    score: parseFloat((parseFloat(doctor.rating || 0) * 0.7 + parseFloat(doctor.experience || 0) * 0.3).toFixed(2))
  }));
};

// Get a list of all specializations from the API
export const getAllSpecializations = async () => {
  try {
    const response = await fetch('http://localhost:5000/specializations');
    if (!response.ok) {
      throw new Error('Failed to fetch specializations');
    }
    const data = await response.json();
    return data.specializations || [];
  } catch (error) {
    console.error('Error fetching specializations:', error);
    return [];
  }
};

// Get a list of all diseases from the API
export const getAllDiseases = async () => {
  try {
    const response = await fetch('http://localhost:5000/diseases');
    if (!response.ok) {
      throw new Error('Failed to fetch diseases');
    }
    const data = await response.json();
    return data.diseases || [];
  } catch (error) {
    console.error('Error fetching diseases:', error);
    return [];
  }
};

// Search directly by specialization rather than disease
export const searchDoctorsBySpecialization = async (specialization, city) => {
  try {
    return await getDoctorRecommendations(null, city, specialization);
  } catch (error) {
    console.error('Error searching doctors by specialization:', error);
    throw error;
  }
};

// Mock implementation for testing when API is not available
export const getMockRecommendations = (disease, city) => {
  return new Promise((resolve) => {
    const mockDoctors = [
      {
        id: 33,
        name: "Dr. Reshma Kapoor",
        specialization: "Cardiology",
        hospital: "Shanti Wellness Hospital",
        state: "Uttar Pradesh",
        city: "Noida",
        experience: 9,
        rating: 3.7,
        contact: "9648790558",
      },
      {
        id: 113,
        name: "Dr. Aditya Mohanty",
        specialization: "Cardiology",
        hospital: "Harmony Health Hub",
        state: "Uttar Pradesh",
        city: "Noida",
        experience: 9,
        rating: 1.5,
        contact: "9968564999",
      }
    ];
    resolve(processDoctorData(mockDoctors));
  });
};