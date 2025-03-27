import {
  type Appointment,
  AppointmentStatus,
  type Patient,
  type User,
} from "./types";

export function generateSampleData() {
  // Generate dates for sample data
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(today.getDate() - 14);
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  // Format dates to ISO string and split to get just the date part
  const todayStr = today.toISOString().split("T")[0];
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  const nextWeekStr = nextWeek.toISOString().split("T")[0];
  const lastWeekStr = lastWeek.toISOString().split("T")[0];
  const twoWeeksAgoStr = twoWeeksAgo.toISOString().split("T")[0];
  const nextMonthStr = nextMonth.toISOString().split("T")[0];

  // Sample patients data
  const samplePatients: Patient[] = [
    {
      id: "p1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      dateOfBirth: "1985-05-15",
      address: "123 Main St, Anytown, CA 12345",
      medicalHistory:
        "No known allergies. Previous Botox treatment 6 months ago.",
    },
    {
      id: "p2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "234-567-8901",
      dateOfBirth: "1990-08-22",
      address: "456 Oak Ave, Somewhere, NY 67890",
      medicalHistory: "Allergic to lidocaine. History of rosacea.",
    },
    {
      id: "p3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "345-678-9012",
      dateOfBirth: "1978-12-10",
      address: "789 Pine Rd, Elsewhere, TX 54321",
      medicalHistory:
        "Hypertension controlled with medication. No known allergies.",
    },
    {
      id: "p4",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "456-789-0123",
      dateOfBirth: "1992-03-28",
      address: "321 Elm St, Nowhere, FL 98765",
      medicalHistory:
        "Previous laser treatments with good results. Sensitive skin.",
    },
    {
      id: "p5",
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      phone: "567-890-1234",
      dateOfBirth: "1980-11-05",
      address: "654 Maple Dr, Anywhere, WA 13579",
      medicalHistory:
        "No significant medical history. First-time aesthetic treatment.",
    },
    {
      id: "p6",
      name: "Sarah Thompson",
      email: "sarah.thompson@example.com",
      phone: "678-901-2345",
      dateOfBirth: "1988-07-17",
      address: "987 Cedar Ln, Someplace, IL 24680",
      medicalHistory:
        "History of keloid scarring. Careful monitoring required.",
    },
    {
      id: "p7",
      name: "David Martinez",
      email: "david.martinez@example.com",
      phone: "789-012-3456",
      dateOfBirth: "1975-09-30",
      address: "246 Birch Blvd, Othertown, GA 97531",
      medicalHistory:
        "Diabetic, well-controlled. Previous facial fillers 1 year ago.",
    },
    {
      id: "p8",
      name: "Jennifer Garcia",
      email: "jennifer.garcia@example.com",
      phone: "890-123-4567",
      dateOfBirth: "1995-02-14",
      address: "135 Walnut Way, Newtown, PA 86420",
      medicalHistory:
        "No significant medical history. Interested in preventative treatments.",
    },
    {
      id: "p9",
      name: "Thomas Anderson",
      email: "thomas.anderson@example.com",
      phone: "901-234-5678",
      dateOfBirth: "1983-04-02",
      address: "864 Spruce St, Oldtown, MI 75319",
      medicalHistory: "Previous microdermabrasion treatments. Mild rosacea.",
    },
    {
      id: "p10",
      name: "Lisa Rodriguez",
      email: "lisa.rodriguez@example.com",
      phone: "012-345-6789",
      dateOfBirth: "1987-06-25",
      address: "753 Aspen Ave, Uptown, OR 42086",
      medicalHistory:
        "Thyroid condition, on medication. Previous chemical peels with good results.",
    },
  ];

  // Mock data for appointments
  const sampleAppointments: Appointment[] = [
    // Today's appointments
    {
      id: "1",
      patient: samplePatients[0],
      date: todayStr,
      time: "09:00",
      service: "Facial Treatment",
      status: AppointmentStatus.CONFIRMED,
      notes: "First-time patient, sensitive skin",
    },
    {
      id: "2",
      patient: samplePatients[1],
      date: todayStr,
      time: "10:30",
      service: "Botox Consultation",
      status: AppointmentStatus.PENDING,
      notes: "Interested in forehead and crow's feet treatment",
    },
    {
      id: "3",
      patient: samplePatients[2],
      date: todayStr,
      time: "11:30",
      service: "Follow-up Consultation",
      status: AppointmentStatus.COMPLETED,
      notes: "Post-treatment check-up",
      treatmentResults: {
        notes: "Patient recovering well. Swelling has reduced significantly.",
        recommendations:
          "Continue with the prescribed skincare routine. Avoid direct sunlight for another week.",
        followUpDate: nextMonthStr,
        images: [
          "https://placehold.co/300x300",
          "https://placehold.co/300x300",
        ],
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
    },
    {
      id: "4",
      patient: samplePatients[3],
      date: todayStr,
      time: "13:00",
      service: "Dermal Fillers",
      status: AppointmentStatus.CONFIRMED,
      notes: "Focusing on nasolabial folds and lips",
    },
    {
      id: "5",
      patient: samplePatients[4],
      date: todayStr,
      time: "14:30",
      service: "Chemical Peel",
      status: AppointmentStatus.CONFIRMED,
      notes: "Medium depth peel for acne scars",
    },
    {
      id: "6",
      patient: samplePatients[5],
      date: todayStr,
      time: "16:00",
      service: "Laser Hair Removal",
      status: AppointmentStatus.CANCELLED,
      notes: "Patient called to reschedule",
    },

    // Tomorrow's appointments
    {
      id: "7",
      patient: samplePatients[6],
      date: tomorrowStr,
      time: "09:30",
      service: "Microdermabrasion",
      status: AppointmentStatus.CONFIRMED,
      notes: "Treatment for hyperpigmentation",
    },
    {
      id: "8",
      patient: samplePatients[7],
      date: tomorrowStr,
      time: "11:00",
      service: "Botox Treatment",
      status: AppointmentStatus.CONFIRMED,
      notes: "Follow-up from consultation last week",
    },
    {
      id: "9",
      patient: samplePatients[8],
      date: tomorrowStr,
      time: "13:30",
      service: "Facial Consultation",
      status: AppointmentStatus.PENDING,
      notes: "New patient interested in anti-aging treatments",
    },
    {
      id: "10",
      patient: samplePatients[9],
      date: tomorrowStr,
      time: "15:00",
      service: "Lip Fillers",
      status: AppointmentStatus.CONFIRMED,
      notes: "Returning patient for maintenance treatment",
    },

    // Yesterday's appointments
    {
      id: "11",
      patient: samplePatients[0],
      date: yesterdayStr,
      time: "10:00",
      service: "Skin Analysis",
      status: AppointmentStatus.COMPLETED,
      notes: "Comprehensive skin assessment",
      treatmentResults: {
        notes:
          "Patient has combination skin with mild sun damage on cheeks and forehead. Recommended a customized skincare routine.",
        recommendations:
          "Start with gentle cleanser, vitamin C serum in the morning, and retinol at night. Schedule a follow-up in 4 weeks.",
        followUpDate: nextMonthStr,
        images: ["https://placehold.co/300x300"],
        completedAt: yesterday.toISOString(),
      },
    },
    {
      id: "12",
      patient: samplePatients[2],
      date: yesterdayStr,
      time: "13:00",
      service: "Botox Treatment",
      status: AppointmentStatus.COMPLETED,
      notes: "Treatment for forehead lines and crow's feet",
      treatmentResults: {
        notes:
          "Administered 20 units to forehead, 12 units to crow's feet. Patient tolerated procedure well with no complications.",
        recommendations:
          "No strenuous exercise for 24 hours. Avoid facial massages for 2 weeks. Results should be visible within 7-10 days.",
        followUpDate: twoWeeksAgoStr,
        images: [
          "https://placehold.co/300x300",
          "https://placehold.co/300x300",
        ],
        completedAt: yesterday.toISOString(),
      },
    },
    {
      id: "13",
      patient: samplePatients[4],
      date: yesterdayStr,
      time: "15:30",
      service: "Dermal Fillers",
      status: AppointmentStatus.COMPLETED,
      notes: "Treatment for nasolabial folds",
      treatmentResults: {
        notes:
          "Used 1 syringe of hyaluronic acid filler. Achieved good correction with natural results.",
        recommendations:
          "Apply cold compress if swelling occurs. Avoid extreme facial expressions for 24 hours. Follow up in 2 weeks.",
        followUpDate: nextWeekStr,
        images: [
          "https://placehold.co/300x300",
          "https://placehold.co/300x300",
        ],
        completedAt: yesterday.toISOString(),
      },
    },

    // Last week's appointments
    {
      id: "14",
      patient: samplePatients[1],
      date: lastWeekStr,
      time: "09:30",
      service: "Initial Consultation",
      status: AppointmentStatus.COMPLETED,
      notes: "First visit to discuss treatment options",
      treatmentResults: {
        notes:
          "Patient is interested in non-surgical facial rejuvenation. Discussed options including Botox, fillers, and laser treatments.",
        recommendations:
          "Recommended starting with Botox for upper face and reassessing in 2 weeks for potential filler treatment.",
        followUpDate: todayStr,
        images: ["https://placehold.co/300x300"],
        completedAt: lastWeek.toISOString(),
      },
    },
    {
      id: "15",
      patient: samplePatients[3],
      date: lastWeekStr,
      time: "11:00",
      service: "Chemical Peel",
      status: AppointmentStatus.COMPLETED,
      notes: "Light peel for skin rejuvenation",
      treatmentResults: {
        notes:
          "Applied glycolic acid peel at 30% concentration. Patient experienced mild tingling but no discomfort.",
        recommendations:
          "Use gentle cleanser and moisturizer for 3 days. Apply SPF 50 daily. Avoid retinoids for 1 week.",
        followUpDate: nextWeekStr,
        images: [
          "https://placehold.co/300x300",
          "https://placehold.co/300x300",
        ],
        completedAt: lastWeek.toISOString(),
      },
    },

    // Next week's appointments
    {
      id: "16",
      patient: samplePatients[5],
      date: nextWeekStr,
      time: "10:00",
      service: "Microneedling",
      status: AppointmentStatus.CONFIRMED,
      notes: "Treatment for acne scars",
    },
    {
      id: "17",
      patient: samplePatients[7],
      date: nextWeekStr,
      time: "13:30",
      service: "Botox Follow-up",
      status: AppointmentStatus.CONFIRMED,
      notes: "Check results from previous treatment",
    },
    {
      id: "18",
      patient: samplePatients[9],
      date: nextWeekStr,
      time: "15:00",
      service: "Laser Skin Resurfacing",
      status: AppointmentStatus.CONFIRMED,
      notes: "Treatment for fine lines and texture",
    },

    // Next month's appointments
    {
      id: "19",
      patient: samplePatients[6],
      date: nextMonthStr,
      time: "09:00",
      service: "Facial Treatment",
      status: AppointmentStatus.CONFIRMED,
      notes: "Monthly maintenance facial",
    },
    {
      id: "20",
      patient: samplePatients[8],
      date: nextMonthStr,
      time: "11:30",
      service: "Dermal Fillers",
      status: AppointmentStatus.CONFIRMED,
      notes: "Treatment for cheek volume",
    },

    // Additional appointments for today at different times
    {
      id: "21",
      patient: samplePatients[0],
      date: todayStr,
      time: "08:30",
      service: "Quick Consultation",
      status: AppointmentStatus.COMPLETED,
      notes: "Brief follow-up from previous treatment",
      treatmentResults: {
        notes:
          "Patient is satisfied with previous treatment results. No concerns or adverse effects reported.",
        recommendations:
          "Continue with current skincare routine. Next treatment can be scheduled in 3 months.",
        followUpDate: nextMonthStr,
        images: [],
        completedAt: new Date(today.setHours(8, 45, 0, 0)).toISOString(),
      },
    },
    {
      id: "22",
      patient: samplePatients[2],
      date: todayStr,
      time: "12:00",
      service: "Lunch Break Consultation",
      status: AppointmentStatus.CONFIRMED,
      notes: "Quick consultation during patient's lunch break",
    },
    {
      id: "23",
      patient: samplePatients[4],
      date: todayStr,
      time: "17:30",
      service: "End of Day Treatment",
      status: AppointmentStatus.CONFIRMED,
      notes: "Last appointment of the day",
    },
  ];

  // Mock user data
  const mockUser: User = {
    id: "u1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@aestheticclinic.com",
    phone: "123-456-7890",
    specialization: "Aesthetic Dermatology",
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      appointmentReminders: true,
      marketingEmails: false,
    },
  };

  return { sampleAppointments, mockUser };
}
