/* =========================================================
   CROP PROCUREMENT SYSTEM
   COMPLETE FRONTEND LOGIN FLOW
   ========================================================= */

/* =========================================================
   ELEMENTS
   ========================================================= */

const farmerLoginButton = document.getElementById("farmerLoginButton");
const adminLoginButton = document.getElementById("adminLoginButton");

const farmerModal = document.getElementById("farmerModal");
const adminModal = document.getElementById("adminModal");

const closeFarmerModal = document.getElementById("closeFarmerModal");
const closeAdminModal = document.getElementById("closeAdminModal");

const farmerLoginForm = document.getElementById("farmerLoginForm");
const adminLoginForm = document.getElementById("adminLoginForm");

const farmerOtpScreen = document.getElementById("farmerOtpScreen");
const newFarmerScreen = document.getElementById("newFarmerScreen");

const loginContainer = document.querySelector(".login-container");
const backgroundOverlay = document.querySelector(".background-overlay");
const languageSwitcher = document.querySelector(".language-switcher");

const otpInput = document.getElementById("otpInput");
const verifyOtpButton = document.getElementById("verifyOtpButton");
const backToLoginButton = document.getElementById("backToLoginButton");

const newFarmerForm = document.getElementById("newFarmerForm");

/* =========================================================
      DEMO AUTHENTICATION DATA
      ========================================================= */

const DEMO_OTP = "123456";

let currentMobileNumber = "";

/* =========================================================
      LANGUAGE SYSTEM
      ========================================================= */

const languageToggle = document.getElementById("languageToggle");
const languageText = document.getElementById("languageText");

let currentLanguage = "en";

/* =========================================================
      TRANSLATIONS
      ========================================================= */

const translations = {
  /* -------------------------------------------------------
        ENGLISH
        ------------------------------------------------------- */

  en: {
    pageTitle: "Crop Procurement",

    pageDescription: "Smart procurement and queue management system",

    farmerTitle: "Farmer Login",

    farmerDescription: "Book procurement slots and manage your queue status.",

    farmerButton: "Login as Farmer",

    adminTitle: "Admin / Operator",

    adminDescription:
      "Monitor procurement centers, farmers and queue activity.",

    adminButton: "Login as Admin",

    ivrTitle: "Don't have a smartphone?",

    ivrDescription:
      "You can use our IVR service to book your procurement slot using a keypad phone.",

    footer: "Smart Crop Procurement System",

    /* Farmer Login Modal */

    farmerLoginTitle: "Farmer Login",

    mobileNumber: "Mobile Number",

    mobilePlaceholder: "Enter 10-digit mobile number",

    sendOtp: "Send OTP",

    close: "Close",

    /* Admin Login Modal */

    adminLoginTitle: "Admin Login",

    adminId: "Admin ID",

    adminPassword: "Password",

    adminIdPlaceholder: "Enter Admin ID",

    adminPasswordPlaceholder: "Enter password",

    continueButton: "Continue",

    /* Alerts */

    invalidMobile: "Please enter a valid mobile number (7–15 digits).",

    otpSent: "OTP sent successfully!",

    demoOtp: "Demo OTP: 123456",

    enterOtp: "Please enter the OTP.",

    invalidOtp: "Invalid OTP.",

    demoOtpInstruction: "For this demo, enter: 123456",

    mobileVerified: "Mobile number verified successfully!",

    newFarmerDetected: "New farmer detected. Please complete your profile.",

    completeProfile: "Please complete all profile fields.",

    profileCompleted: "Profile completed successfully!",

    welcome: "Welcome, ",

    adminFields: "Please enter your Admin ID and password.",

    adminConnection: "Admin authentication will be connected here.",

    adminIdDisplay: "Admin ID: ",
  },

  /* -------------------------------------------------------
        BENGALI
        ------------------------------------------------------- */

  bn: {
    pageTitle: "ফসল সংগ্রহ ব্যবস্থা",

    pageDescription: "স্মার্ট ফসল সংগ্রহ এবং সারি ব্যবস্থাপনা ব্যবস্থা",

    farmerTitle: "কৃষক লগইন",

    farmerDescription: "সংগ্রহের সময় বুক করুন এবং আপনার সারির অবস্থান দেখুন।",

    farmerButton: "কৃষক হিসেবে লগইন",

    adminTitle: "অ্যাডমিন / অপারেটর",

    adminDescription:
      "সংগ্রহ কেন্দ্র, কৃষক এবং সারির কার্যক্রম পর্যবেক্ষণ করুন।",

    adminButton: "অ্যাডমিন হিসেবে লগইন",

    ivrTitle: "স্মার্টফোন নেই?",

    ivrDescription:
      "কীপ্যাড ফোন ব্যবহার করে IVR পরিষেবার মাধ্যমে আপনার সংগ্রহের সময় বুক করতে পারেন।",

    footer: "স্মার্ট ফসল সংগ্রহ ব্যবস্থা",

    /* Farmer Login Modal */

    farmerLoginTitle: "কৃষক লগইন",

    mobileNumber: "মোবাইল নম্বর",

    mobilePlaceholder: "১০ সংখ্যার মোবাইল নম্বর লিখুন",

    sendOtp: "OTP পাঠান",

    close: "বন্ধ করুন",

    /* Admin Login Modal */

    adminLoginTitle: "অ্যাডমিন লগইন",

    adminId: "অ্যাডমিন আইডি",

    adminPassword: "পাসওয়ার্ড",

    adminIdPlaceholder: "অ্যাডমিন আইডি লিখুন",

    adminPasswordPlaceholder: "পাসওয়ার্ড লিখুন",

    continueButton: "চালিয়ে যান",

    /* Alerts */

    invalidMobile: "অনুগ্রহ করে একটি সঠিক মোবাইল নম্বর লিখুন (৭–১৫ সংখ্যা)।",

    otpSent: "OTP সফলভাবে পাঠানো হয়েছে!",

    demoOtp: "ডেমো OTP: 123456",

    enterOtp: "অনুগ্রহ করে OTP লিখুন।",

    invalidOtp: "ভুল OTP।",

    demoOtpInstruction: "এই ডেমোর জন্য লিখুন: 123456",

    mobileVerified: "মোবাইল নম্বর সফলভাবে যাচাই করা হয়েছে!",

    newFarmerDetected:
      "নতুন কৃষক শনাক্ত হয়েছে। অনুগ্রহ করে আপনার প্রোফাইল সম্পূর্ণ করুন।",

    completeProfile: "অনুগ্রহ করে সমস্ত প্রোফাইল তথ্য পূরণ করুন।",

    profileCompleted: "প্রোফাইল সফলভাবে সম্পূর্ণ হয়েছে!",

    welcome: "স্বাগতম, ",

    adminFields: "অনুগ্রহ করে আপনার অ্যাডমিন আইডি এবং পাসওয়ার্ড লিখুন।",

    adminConnection: "অ্যাডমিন authentication এখানে সংযুক্ত করা হবে।",

    adminIdDisplay: "অ্যাডমিন আইডি: ",
  },
};

/* =========================================================
      UPDATE MODAL LANGUAGE
      ========================================================= */

function updateModalLanguage() {
  const text = translations[currentLanguage];

  /* -------------------------------------------------------
        FARMER MODAL
        ------------------------------------------------------- */

  if (farmerModal) {
    const farmerTitle = farmerModal.querySelector("h2");

    const farmerMobileLabel = farmerModal.querySelector(
      'label[for="farmerMobile"]'
    );

    const farmerMobileInput = document.getElementById("farmerMobile");

    const farmerSubmitButton = farmerModal.querySelector(
      '#farmerLoginForm button[type="submit"]'
    );

    if (farmerTitle) {
      farmerTitle.textContent = text.farmerLoginTitle;
    }

    if (farmerMobileLabel) {
      farmerMobileLabel.textContent = text.mobileNumber;
    }

    if (farmerMobileInput) {
      farmerMobileInput.placeholder = text.mobilePlaceholder;
    }

    if (farmerSubmitButton) {
      farmerSubmitButton.textContent = text.sendOtp;
    }

    if (closeFarmerModal) {
      closeFarmerModal.setAttribute("aria-label", text.close);

      closeFarmerModal.setAttribute("title", text.close);
    }
  }

  /* -------------------------------------------------------
        ADMIN MODAL
        ------------------------------------------------------- */

  if (adminModal) {
    const adminTitle = adminModal.querySelector("h2");

    const adminIdLabel = adminModal.querySelector('label[for="adminId"]');

    const adminPasswordLabel = adminModal.querySelector(
      'label[for="adminPassword"]'
    );

    const adminIdInput = document.getElementById("adminId");

    const adminPasswordInput = document.getElementById("adminPassword");

    const adminSubmitButton = adminModal.querySelector(
      '#adminLoginForm button[type="submit"]'
    );

    if (adminTitle) {
      adminTitle.textContent = text.adminLoginTitle;
    }

    if (adminIdLabel) {
      adminIdLabel.textContent = text.adminId;
    }

    if (adminPasswordLabel) {
      adminPasswordLabel.textContent = text.adminPassword;
    }

    if (adminIdInput) {
      adminIdInput.placeholder = text.adminIdPlaceholder;
    }

    if (adminPasswordInput) {
      adminPasswordInput.placeholder = text.adminPasswordPlaceholder;
    }

    if (adminSubmitButton) {
      adminSubmitButton.textContent = text.continueButton;
    }

    if (closeAdminModal) {
      closeAdminModal.setAttribute("aria-label", text.close);

      closeAdminModal.setAttribute("title", text.close);
    }
  }
}

/* =========================================================
      OPEN FARMER LOGIN
      ========================================================= */

farmerLoginButton.addEventListener("click", function () {
  /*
        Make sure the popup always uses
        the currently selected language.
     */

  updateModalLanguage();

  farmerModal.classList.remove("hidden");
});

/* =========================================================
      OPEN ADMIN LOGIN
      ========================================================= */

adminLoginButton.addEventListener("click", function () {
  /*
        Make sure the popup always uses
        the currently selected language.
     */

  updateModalLanguage();

  adminModal.classList.remove("hidden");
});

/* =========================================================
      CLOSE FARMER MODAL
      ========================================================= */

closeFarmerModal.addEventListener("click", function () {
  farmerModal.classList.add("hidden");
});

/* =========================================================
      CLOSE ADMIN MODAL
      ========================================================= */

closeAdminModal.addEventListener("click", function () {
  adminModal.classList.add("hidden");
});

/* =========================================================
      CLOSE MODALS WHEN CLICKING OUTSIDE
      ========================================================= */

farmerModal.addEventListener("click", function (event) {
  if (event.target === farmerModal) {
    farmerModal.classList.add("hidden");
  }
});

adminModal.addEventListener("click", function (event) {
  if (event.target === adminModal) {
    adminModal.classList.add("hidden");
  }
});

/* =========================================================
      ESCAPE KEY
      ========================================================= */

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    farmerModal.classList.add("hidden");

    adminModal.classList.add("hidden");
  }
});

/* =========================================================
      FARMER LOGIN
      MOBILE NUMBER → OTP
      ========================================================= */

farmerLoginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  event.stopPropagation();

  const mobileInput = document.getElementById("farmerMobile");

  const mobile = mobileInput.value.trim();

  const text = translations[currentLanguage];

  /* -------------------------------------------------------
        MOBILE NUMBER VALIDATION
        ------------------------------------------------------- */

  if (!/^\+?[0-9]{7,15}$/.test(mobile)) {
    alert(text.invalidMobile);

    return;
  }

  /* -------------------------------------------------------
        SAVE MOBILE NUMBER
        ------------------------------------------------------- */

  currentMobileNumber = mobile;

  /* -------------------------------------------------------
        CLOSE FARMER LOGIN MODAL
        ------------------------------------------------------- */

  farmerModal.classList.add("hidden");

  /* -------------------------------------------------------
        HIDE NEW FARMER SCREEN
        ------------------------------------------------------- */

  newFarmerScreen.classList.add("hidden");

  /* -------------------------------------------------------
        SHOW OTP SCREEN
        ------------------------------------------------------- */

  farmerOtpScreen.classList.remove("hidden");

  /* -------------------------------------------------------
        RESET OTP INPUT
        ------------------------------------------------------- */

  otpInput.value = "";

  /* -------------------------------------------------------
        FOCUS OTP
        ------------------------------------------------------- */

  setTimeout(function () {
    otpInput.focus();
  }, 100);

  /* -------------------------------------------------------
        DEMO OTP MESSAGE
        ------------------------------------------------------- */

  alert(text.otpSent + "\n\n" + text.demoOtp);
});

/* =========================================================
      VERIFY OTP
      ========================================================= */

verifyOtpButton.addEventListener("click", async function () {
  const enteredOTP = otpInput.value.trim();

  const text = translations[currentLanguage];

  /* -------------------------------------------------------
        EMPTY OTP
        ------------------------------------------------------- */

  if (enteredOTP === "") {
    alert(text.enterOtp);

    return;
  }

  /* -------------------------------------------------------
        WRONG OTP
        ------------------------------------------------------- */

  if (enteredOTP !== DEMO_OTP) {
    alert(text.invalidOtp + "\n\n" + text.demoOtpInstruction);

    return;
  }

  /* -------------------------------------------------------
        OTP SUCCESS
        ------------------------------------------------------- */

  farmerOtpScreen.classList.add("hidden");
  localStorage.setItem("loggedInFarmerMobile", currentMobileNumber);

  /* -------------------------------------------------------
        LOOK UP THE FARMER FOR REAL (Supabase), NOT A HARDCODED
        DEMO NUMBER — any mobile already registered in the
        `farmers` table is treated as an existing farmer.
        ------------------------------------------------------- */

  let existingFarmer = null;
  try {
    if (window.AnnasetuSync) {
      existingFarmer = await window.AnnasetuSync.findFarmerByMobile(currentMobileNumber);
    }
  } catch (err) {
    console.error("Could not look up farmer:", err);
  }

  if (existingFarmer) {
    localStorage.setItem("farmerId", existingFarmer.id);
    localStorage.setItem("farmerName", existingFarmer.name);

    alert(text.mobileVerified);

    openFarmerDashboard();

    return;
  }

  /* -------------------------------------------------------
        NEW FARMER
        ------------------------------------------------------- */

  alert(text.mobileVerified + "\n\n" + text.newFarmerDetected);

  newFarmerScreen.classList.remove("hidden");
});

/* =========================================================
      BACK TO LOGIN
      ========================================================= */

backToLoginButton.addEventListener("click", function () {
  farmerOtpScreen.classList.add("hidden");

  otpInput.value = "";

  currentMobileNumber = "";

  /*
        Re-apply selected language before reopening modal.
     */

  updateModalLanguage();

  farmerModal.classList.remove("hidden");
});

/* =========================================================
      NEW FARMER PROFILE
      ========================================================= */

newFarmerForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("farmerName").value.trim();

  const village = document.getElementById("farmerVillage").value.trim();

  const district = document.getElementById("farmerDistrict").value.trim();

  const text = translations[currentLanguage];

  /* -------------------------------------------------------
        VALIDATION
        ------------------------------------------------------- */

  if (!name || !village || !district) {
    alert(text.completeProfile);

    return;
  }

  /* -------------------------------------------------------
      PROFILE SUCCESS — create the real farmer record in
      Supabase so this farmer (and every booking they make)
      shows up in the admin portal.
      ------------------------------------------------------- */

  try {
    if (window.AnnasetuSync) {
      const farmer = await window.AnnasetuSync.upsertFarmer({
        mobile: currentMobileNumber,
        name,
        village,
        district,
      });
      localStorage.setItem("farmerId", farmer.id);
    }
  } catch (err) {
    console.error("Could not save farmer profile:", err);
    alert("Could not save your profile right now. Please check your connection and try again.");
    return;
  }

  localStorage.setItem("farmerName", name);

  alert(text.profileCompleted + "\n\n" + text.welcome + name + "!");
  openFarmerDashboard();
});

/* =========================================================
   FARMER DASHBOARD
   ========================================================= */

function openFarmerDashboard() {
  /* =========================================
       HIDE LOGIN VIEW
       ========================================= */

  farmerModal.classList.add("hidden");
  farmerOtpScreen.classList.add("hidden");
  newFarmerScreen.classList.add("hidden");

  if (loginContainer) {
    loginContainer.classList.add("hidden");
  }

  if (backgroundOverlay) {
    backgroundOverlay.classList.add("hidden");
  }

  if (languageSwitcher) {
    languageSwitcher.classList.add("hidden");
  }

  /* =========================================
       SHOW FARMER DASHBOARD
       ========================================= */

  const farmerDashboard = document.getElementById("farmerDashboard");

  if (farmerDashboard) {
    farmerDashboard.classList.remove("hidden");

    setDashboardFarmerName();
    applyDashboardLanguage();

    /* Restart crop ticker after dashboard becomes visible */
    if (cropTrack) {
      cropTrack.style.animation = "none";

      void cropTrack.offsetWidth;

      cropTrack.style.animation = "cropScroll 10s linear infinite";

      cropTrack.style.animationPlayState = "running";
    }

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  } else {
    console.error("Farmer Dashboard section was not found in index.html.");
  }
}

/* =========================================================
      ADMIN LOGIN
      TEMPORARY FRONTEND LOGIC
      ========================================================= */

adminLoginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const adminId = document.getElementById("adminId").value.trim();

  const password = document.getElementById("adminPassword").value;

  const text = translations[currentLanguage];

  if (adminId === "" || password === "") {
    alert(text.adminFields);

    return;
  }

  // Mock login (unchanged): any non-empty ID + password "succeeds".
  // Once verified, hand off to the admin portal.
  sessionStorage.setItem("adminSession", adminId);
  window.location.href = "admin.html";
});

/* =========================================================
      LOGIN CARDS ARE STATIC (NO DRAGGING)
      ========================================================= */

/* =========================================================
      DASHBOARD LANGUAGE + FARMER NAME
      ========================================================= */

const dashboardLanguage = document.getElementById("dashboardLanguage");
const dashboardFarmerName = document.getElementById("dashboardFarmerName");
const dashboardLogout = document.getElementById("dashboardLogout");

const dashboardTranslations = {
  en: {
    "Crop Procurement": "Crop Procurement",
    "FARMER PROCUREMENT DESK": "FARMER PROCUREMENT DESK",
    "Farmer": "Farmer",
    "Registered Farmer": "Registered Farmer",
    "Logout": "Logout",
    "LIVE MSP 2026–27": "LIVE MSP 2026–27",
    "GOVERNMENT BENCHMARKS": "GOVERNMENT BENCHMARKS",
    "All": "All", "Kharif": "Kharif", "Rabi": "Rabi", "Commercial": "Commercial",
    "Pause": "Pause", "Resume": "Resume",
    "OFFICIAL FARMER DESK": "OFFICIAL FARMER DESK",
    "Farmer Procurement Dashboard": "Farmer Procurement Dashboard",
    "Welcome to your integrated crop procurement portal. Book procurement slots, register your crop, track your queue position, and monitor procurement status.": "Welcome to your integrated crop procurement portal. Book procurement slots, register your crop, track your queue position, and monitor procurement status.",
    "FARMER SERVICES": "FARMER SERVICES", "Procurement Services": "Procurement Services",
    "Choose a service to manage your crop procurement journey.": "Choose a service to manage your crop procurement journey.",
    "CROP & MSP INFORMATION": "CROP & MSP INFORMATION",
    "Check MSP, crop season, and procurement status before booking your procurement slot.": "Check MSP, crop season, and procurement status before booking your procurement slot.",
    "View Information": "View Information",
    "PROCUREMENT SLOT BOOKING": "PROCUREMENT SLOT BOOKING",
    "Select a procurement center, delivery date, and available time slot.": "Select a procurement center, delivery date, and available time slot.",
    "Book Slot": "Book Slot",
    "CROP REGISTRATION": "CROP REGISTRATION",
    "Register your produce details before booking procurement.": "Register your produce details before booking procurement.",
    "Register Crop": "Register Crop",
    "TOKEN & QUEUE STATUS": "TOKEN & QUEUE STATUS",
    "Track your procurement token, queue position, congestion, and estimated waiting time.": "Track your procurement token, queue position, congestion, and estimated waiting time.",
    "View Queue Status": "View Queue Status",
    "PROCUREMENT & PAYMENT": "PROCUREMENT & PAYMENT",
    "View final procurement details, MSP amount, and payment status.": "View final procurement details, MSP amount, and payment status.",
    "View Procurement": "View Procurement",
    "TRANSACTION HISTORY": "TRANSACTION HISTORY",
    "View your previous procurement and payment records.": "View your previous procurement and payment records.",
    "View History": "View History",
    "FARMER INFORMATION": "FARMER INFORMATION",
    "🌾 Crop & MSP Information": "🌾 Crop & MSP Information",
    "Check crop season, MSP and current procurement status.": "Check crop season, MSP and current procurement status.",
    "Source:": "Source:", "Official source:": "Official source:", "Check official CACP MSP page ↗": "Check official CACP MSP page ↗", "Commission for Agricultural Costs & Prices (CACP)": "Commission for Agricultural Costs & Prices (CACP)",
    "← Back to Crops": "← Back to Crops", "Minimum Support Price": "Minimum Support Price",
    "Procurement Status": "Procurement Status", "🟢 Procurement Open": "🟢 Procurement Open",
    "Procurement Period": "Procurement Period", "Crop Year": "Crop Year", "Last Updated": "Last Updated",
    "Book Procurement Slot": "Book Procurement Slot",
    "Information based on official procurement/MSP data.": "Information based on official procurement/MSP data.",
    "📅 Procurement Slot Booking": "📅 Procurement Slot Booking",
    "Select your procurement center, date, and intake slot.": "Select your procurement center, date, and intake slot.",
    "Selected Crop": "Selected Crop", "Procurement Center": "Procurement Center",
    "Select a procurement center": "Select a procurement center",
    "Central Procurement Center": "Central Procurement Center",
    "North Procurement Center": "North Procurement Center",
    "South Procurement Center": "South Procurement Center",
    "Preferred Date": "Preferred Date", "Select Intake Slot": "Select Intake Slot",
    "Morning": "Morning", "Afternoon": "Afternoon",
    "24 slots available": "24 slots available", "18 slots available": "18 slots available",
    "8:00 AM – 12:00 PM": "8:00 AM – 12:00 PM", "1:00 PM – 5:00 PM": "1:00 PM – 5:00 PM",
    "Booking Summary": "Booking Summary", "Center": "Center", "Date": "Date", "Time Slot": "Time Slot",
    "Confirm Reservation": "Confirm Reservation",
    "Your booking confirmation and queue token will be generated after reservation.": "Your booking confirmation and queue token will be generated after reservation.",
    "📝 Crop Registration": "📝 Crop Registration",
    "Register your produce details for procurement.": "Register your produce details for procurement.",
    "Farmer Information": "Farmer Information", "Farmer Name": "Farmer Name",
    "Mobile Number": "Mobile Number", "Produce Information": "Produce Information",
    "Expected Quantity": "Expected Quantity", "Quintals": "Quintals",
    "Harvest / Ready Date": "Harvest / Ready Date", "Land / Plot Reference": "Land / Plot Reference",
    "Your crop details will be used to prepare your procurement booking and queue information.": "Your crop details will be used to prepare your procurement booking and queue information.",
    "Submit Crop Registration": "Submit Crop Registration",
    "Payment and bank details are handled separately during the procurement payment process.": "Payment and bank details are handled separately during the procurement payment process.",
    "🎟️ Live Token & Queue": "🎟️ Live Token & Queue",
    "Track your procurement token and queue progress.": "Track your procurement token and queue progress.",
    "YOUR PROCUREMENT TOKEN": "YOUR PROCUREMENT TOKEN", "Crop": "Crop", "Center": "Center", "Date": "Date", "Slot": "Slot",
    "LIVE QUEUE": "LIVE QUEUE", "Your Queue Position": "Your Queue Position", "● LIVE": "● LIVE",
    "Your current position": "Your current position", "6 farmers ahead of you": "6 farmers ahead of you",
    "Currently serving": "Currently serving", "Queue is moving normally": "Queue is moving normally",
    "CENTER INTELLIGENCE": "CENTER INTELLIGENCE", "Procurement Center Congestion": "Procurement Center Congestion",
    "Current Congestion": "Current Congestion", "MODERATE": "MODERATE",
    "Moderate waiting pressure at this center.": "Moderate waiting pressure at this center.",
    "Farmers waiting": "Farmers waiting", "Counters active": "Counters active", "Avg. processing": "Avg. processing",
    "Congestion is estimated from current queue volume, active processing counters, and average processing time.": "Congestion is estimated from current queue volume, active processing counters, and average processing time.",
    "YOUR ESTIMATED WAIT": "YOUR ESTIMATED WAIT", "minutes": "minutes",
    "Based on your queue position,active counters and the current center processing speed.": "Based on your queue position, active counters and the current center processing speed.",
    "This is an estimated waiting time and may change as the queue moves.": "This is an estimated waiting time and may change as the queue moves.",
    "PROCUREMENT JOURNEY": "PROCUREMENT JOURNEY", "Your Current Status": "Your Current Status",
    "Booked": "Booked", "Slot successfully reserved": "Slot successfully reserved",
    "Waiting": "Waiting", "You are currently in the queue": "You are currently in the queue",
    "Processing": "Processing", "Your produce will be processed": "Your produce will be processed",
    "Completed": "Completed", "Procurement completed": "Procurement completed",
    "📜 Transaction History": "📜 Transaction History",
    "Total Transactions": "Total Transactions", "Total Quantity": "Total Quantity",
    "Total Procurement Value": "Total Procurement Value", "PROCUREMENT RECORDS": "PROCUREMENT RECORDS",
    "Your Transactions": "Your Transactions", "Accepted Quantity": "Accepted Quantity", "MSP Applied": "MSP Applied",
    "Procurement Amount": "Procurement Amount", "Token": "Token", "Booking Reference": "Booking Reference",
    "No Transactions Yet": "No Transactions Yet", "Your completed procurement records will appear here.": "Your completed procurement records will appear here.",
    "💰 Finalize Procurement & Payment": "💰 Finalize Procurement & Payment",
    "Review your final procurement details and payment status.": "Review your final procurement details and payment status.",
    "PROCUREMENT RESULT":"PROCUREMENT RESULT","Final Procurement Summary":"Final Procurement Summary","Procurement Completed":"Procurement Completed",
    "Your produce has been processed at the procurement center.":"Your produce has been processed at the procurement center.","Procurement Date":"Procurement Date",
    "MSP CALCULATION":"MSP CALCULATION","Final Quantity & Procurement Amount":"Final Quantity & Procurement Amount","Final Accepted Quantity":"Final Accepted Quantity",
    "MSP per Quintal":"MSP per Quintal","Total Procurement Amount":"Total Procurement Amount","Final quantity × MSP":"Final quantity × MSP",
    "REGISTERED PAYMENT ACCOUNT":"REGISTERED PAYMENT ACCOUNT","Bank / DBT Details":"Bank / DBT Details","Payment Details Verified":"Payment Details Verified",
    "Payment will be sent to your registered DBT account.":"Payment will be sent to your registered DBT account.","Bank Name":"Bank Name","Account Number":"Account Number",
    "IFSC Code":"IFSC Code","Your full bank account number is never displayed here.":"Your full bank account number is never displayed here.",
    "PAYMENT TRACKING":"PAYMENT TRACKING","Payment Status":"Payment Status","Current Payment Status":"Current Payment Status",
    "Your procurement payment is being processed and will be credited to your registered DBT account.":"Your procurement payment is being processed and will be credited to your registered DBT account.",
    "Payment Processing":"Payment Processing","Payment Credited":"Payment Credited","Payment status may change after verification and processing by the procurement system.":"Payment status may change after verification and processing by the procurement system.",
    "PROCUREMENT CONFIRMATION":"PROCUREMENT CONFIRMATION","Procurement Details Finalized":"Procurement Details Finalized",
    "Your procurement details have been finalized successfully. Payment will be initiated to your registered DBT account.":"Your procurement details have been finalized successfully.",
    "Track Payment Status":"Track Payment Status","Check this section for future payment updates.":"Check this section for future payment updates.",
    "Receive Notifications":"Receive Notifications"
  },
  bn: {
    "Crop Procurement": "ফসল সংগ্রহ", "FARMER PROCUREMENT DESK": "কৃষক সংগ্রহ ডেস্ক",
    "Farmer": "কৃষক", "Registered Farmer": "নিবন্ধিত কৃষক", "Logout": "লগআউট",
    "LIVE MSP 2026–27": "লাইভ MSP ২০২৬–২৭", "GOVERNMENT BENCHMARKS": "সরকারি মানদণ্ড",
    "All": "সব", "Kharif": "খরিফ", "Rabi": "রবি", "Commercial": "বাণিজ্যিক", "Pause": "বিরতি", "Resume": "চালু করুন",
    "OFFICIAL FARMER DESK": "অফিসিয়াল কৃষক ডেস্ক", "Farmer Procurement Dashboard": "কৃষক সংগ্রহ ড্যাশবোর্ড",
    "Welcome to your integrated crop procurement portal. Book procurement slots, register your crop, track your queue position, and monitor procurement status.": "আপনার সমন্বিত ফসল সংগ্রহ পোর্টালে স্বাগতম। সংগ্রহের সময় বুক করুন, ফসল নিবন্ধন করুন, সারিতে আপনার অবস্থান দেখুন এবং সংগ্রহের অবস্থা পর্যবেক্ষণ করুন।",
    "FARMER SERVICES": "কৃষক পরিষেবা", "Procurement Services": "সংগ্রহ পরিষেবা",
    "Choose a service to manage your crop procurement journey.": "আপনার ফসল সংগ্রহের প্রক্রিয়া পরিচালনার জন্য একটি পরিষেবা বেছে নিন।",
    "CROP & MSP INFORMATION": "ফসল ও MSP তথ্য", "Check MSP, crop season, and procurement status before booking your procurement slot.": "সংগ্রহের সময় বুক করার আগে MSP, ফসলের মরসুম এবং সংগ্রহের অবস্থা দেখুন।",
    "View Information": "তথ্য দেখুন", "PROCUREMENT SLOT BOOKING": "সংগ্রহের সময় বুকিং",
    "Select a procurement center, delivery date, and available time slot.": "সংগ্রহ কেন্দ্র, সরবরাহের তারিখ এবং উপলভ্য সময় বেছে নিন।",
    "Book Slot": "সময় বুক করুন", "CROP REGISTRATION": "ফসল নিবন্ধন",
    "Register your produce details before booking procurement.": "সংগ্রহ বুক করার আগে আপনার উৎপাদনের তথ্য নিবন্ধন করুন।",
    "Register Crop": "ফসল নিবন্ধন করুন", "TOKEN & QUEUE STATUS": "টোকেন ও সারির অবস্থা",
    "Track your procurement token, queue position, congestion, and estimated waiting time.": "আপনার সংগ্রহ টোকেন, সারির অবস্থান, ভিড় এবং আনুমানিক অপেক্ষার সময় দেখুন।",
    "View Queue Status": "সারির অবস্থা দেখুন", "PROCUREMENT & PAYMENT": "সংগ্রহ ও পেমেন্ট",
    "View final procurement details, MSP amount, and payment status.": "চূড়ান্ত সংগ্রহের তথ্য, MSP-এর পরিমাণ এবং পেমেন্টের অবস্থা দেখুন।",
    "View Procurement": "সংগ্রহ দেখুন", "TRANSACTION HISTORY": "লেনদেনের ইতিহাস",
    "View your previous procurement and payment records.": "আপনার আগের সংগ্রহ ও পেমেন্টের রেকর্ড দেখুন।",
    "View History": "ইতিহাস দেখুন", "FARMER INFORMATION": "কৃষক তথ্য",
    "🌾 Crop & MSP Information": "🌾 ফসল ও MSP তথ্য", "Check crop season, MSP and current procurement status.": "ফসলের মরসুম, MSP এবং বর্তমান সংগ্রহের অবস্থা দেখুন।",
    "Source:": "উৎস:", "Commission for Agricultural Costs & Prices (CACP)": "কৃষি খরচ ও মূল্য কমিশন (CACP)",
    "← Back to Crops": "← ফসলে ফিরে যান", "Minimum Support Price": "ন্যূনতম সহায়ক মূল্য",
    "Procurement Status": "সংগ্রহের অবস্থা", "🟢 Procurement Open": "🟢 সংগ্রহ চালু",
    "Procurement Period": "সংগ্রহের সময়কাল", "Crop Year": "ফসল বছর", "Last Updated": "সর্বশেষ আপডেট",
    "Book Procurement Slot": "সংগ্রহের সময় বুক করুন", "Information based on official procurement/MSP data.": "সরকারি সংগ্রহ/MSP তথ্যের ভিত্তিতে।",
    "📅 Procurement Slot Booking": "📅 সংগ্রহের সময় বুকিং", "Select your procurement center, date, and intake slot.": "আপনার সংগ্রহ কেন্দ্র, তারিখ এবং গ্রহণের সময় বেছে নিন।",
    "Selected Crop": "নির্বাচিত ফসল", "Procurement Center": "সংগ্রহ কেন্দ্র", "Select a procurement center": "সংগ্রহ কেন্দ্র বেছে নিন",
    "Central Procurement Center": "কেন্দ্রীয় সংগ্রহ কেন্দ্র", "North Procurement Center": "উত্তর সংগ্রহ কেন্দ্র", "South Procurement Center": "দক্ষিণ সংগ্রহ কেন্দ্র",
    "Preferred Date": "পছন্দের তারিখ", "Select Intake Slot": "গ্রহণের সময় বেছে নিন", "Morning": "সকাল", "Afternoon": "দুপুর",
    "24 slots available": "২৪টি সময় উপলভ্য", "18 slots available": "১৮টি সময় উপলভ্য",
    "Booking Summary": "বুকিং সারাংশ", "Center": "কেন্দ্র", "Date": "তারিখ", "Time Slot": "সময়",
    "Confirm Reservation": "বুকিং নিশ্চিত করুন", "Your booking confirmation and queue token will be generated after reservation.": "বুকিং নিশ্চিত হওয়ার পর আপনার নিশ্চিতকরণ এবং সারির টোকেন তৈরি হবে।",
    "📝 Crop Registration": "📝 ফসল নিবন্ধন", "Register your produce details for procurement.": "সংগ্রহের জন্য আপনার উৎপাদনের তথ্য নিবন্ধন করুন।",
    "Farmer Information": "কৃষক তথ্য", "Farmer Name": "কৃষকের নাম", "Mobile Number": "মোবাইল নম্বর", "Produce Information": "উৎপাদনের তথ্য",
    "Expected Quantity": "প্রত্যাশিত পরিমাণ", "Quintals": "কুইন্টাল", "Harvest / Ready Date": "ফসল কাটার / প্রস্তুতির তারিখ",
    "Land / Plot Reference": "জমি / প্লটের তথ্য", "Your crop details will be used to prepare your procurement booking and queue information.": "আপনার ফসলের তথ্য সংগ্রহের বুকিং ও সারির তথ্য প্রস্তুত করতে ব্যবহার করা হবে।",
    "Submit Crop Registration": "ফসল নিবন্ধন জমা দিন", "Payment and bank details are handled separately during the procurement payment process.": "পেমেন্ট ও ব্যাংকের তথ্য সংগ্রহের পেমেন্ট প্রক্রিয়ায় আলাদাভাবে পরিচালিত হবে।",
    "🎟️ Live Token & Queue": "🎟️ লাইভ টোকেন ও সারি", "Track your procurement token and queue progress.": "আপনার সংগ্রহ টোকেন ও সারির অগ্রগতি দেখুন।",
    "YOUR PROCUREMENT TOKEN": "আপনার সংগ্রহ টোকেন", "Crop": "ফসল", "Slot": "সময়", "LIVE QUEUE": "লাইভ সারি",
    "Your Queue Position": "আপনার সারির অবস্থান", "● LIVE": "● লাইভ", "Your current position": "আপনার বর্তমান অবস্থান",
    "6 farmers ahead of you": "আপনার আগে ৬ জন কৃষক", "Currently serving": "বর্তমানে সেবা দেওয়া হচ্ছে",
    "Queue is moving normally": "সারি স্বাভাবিক গতিতে চলছে", "CENTER INTELLIGENCE": "কেন্দ্রের বুদ্ধিমত্তা",
    "Procurement Center Congestion": "সংগ্রহ কেন্দ্রের ভিড়", "Current Congestion": "বর্তমান ভিড়", "MODERATE": "মাঝারি",
    "Moderate waiting pressure at this center.": "এই কেন্দ্রে মাঝারি অপেক্ষার চাপ রয়েছে।", "Farmers waiting": "অপেক্ষমাণ কৃষক",
    "Counters active": "সক্রিয় কাউন্টার", "Avg. processing": "গড় প্রক্রিয়াকরণ",
    "Congestion is estimated from current queue volume, active processing counters, and average processing time.": "বর্তমান সারির সংখ্যা, সক্রিয় প্রক্রিয়াকরণ কাউন্টার এবং গড় প্রক্রিয়াকরণের সময়ের ভিত্তিতে ভিড়ের মাত্রা অনুমান করা হয়।",
    "YOUR ESTIMATED WAIT": "আপনার আনুমানিক অপেক্ষা", "minutes": "মিনিট",
    "Based on your queue position,active counters and the current center processing speed.": "আপনার সারির অবস্থান, সক্রিয় কাউন্টার এবং বর্তমান কেন্দ্রের প্রক্রিয়াকরণের গতির ভিত্তিতে।",
    "This is an estimated waiting time and may change as the queue moves.": "এটি আনুমানিক অপেক্ষার সময় এবং সারি এগোনোর সঙ্গে পরিবর্তিত হতে পারে।",
    "PROCUREMENT JOURNEY": "সংগ্রহের ধাপ", "Your Current Status": "আপনার বর্তমান অবস্থা",
    "Booked": "বুক করা হয়েছে", "Slot successfully reserved": "সময় সফলভাবে সংরক্ষিত হয়েছে", "Waiting": "অপেক্ষমাণ",
    "You are currently in the queue": "আপনি বর্তমানে সারিতে আছেন", "Processing": "প্রক্রিয়াধীন", "Your produce will be processed": "আপনার উৎপাদন প্রক্রিয়াকরণ করা হবে",
    "Completed": "সম্পন্ন", "Procurement completed": "সংগ্রহ সম্পন্ন",
    "📜 Transaction History": "📜 লেনদেনের ইতিহাস", "Total Transactions": "মোট লেনদেন", "Total Quantity": "মোট পরিমাণ",
    "Total Procurement Value": "মোট সংগ্রহ মূল্য", "PROCUREMENT RECORDS": "সংগ্রহের রেকর্ড", "Your Transactions": "আপনার লেনদেন",
    "Accepted Quantity": "গৃহীত পরিমাণ", "MSP Applied": "প্রযোজ্য MSP", "Procurement Amount": "সংগ্রহের অর্থ",
    "Token": "টোকেন", "Booking Reference": "বুকিং রেফারেন্স", "No Transactions Yet": "এখনও কোনো লেনদেন নেই",
    "Your completed procurement records will appear here.": "আপনার সম্পন্ন সংগ্রহের রেকর্ড এখানে দেখা যাবে।",
    "💰 Finalize Procurement & Payment": "💰 সংগ্রহ ও পেমেন্ট চূড়ান্ত করুন",
    "Review your final procurement details and payment status.": "আপনার চূড়ান্ত সংগ্রহের তথ্য ও পেমেন্টের অবস্থা দেখুন।"
  },
  hi: {}
};

Object.keys(dashboardTranslations.bn).forEach(function (key) {
  if (!dashboardTranslations.hi[key]) dashboardTranslations.hi[key] = dashboardTranslations.en[key];
});
Object.assign(dashboardTranslations.bn, {
  "PROCUREMENT RESULT":"সংগ্রহের ফলাফল","Final Procurement Summary":"চূড়ান্ত সংগ্রহের সারাংশ","Procurement Completed":"সংগ্রহ সম্পন্ন",
  "Your produce has been processed at the procurement center.":"আপনার উৎপাদন সংগ্রহ কেন্দ্রে প্রক্রিয়াকরণ করা হয়েছে।","Procurement Date":"সংগ্রহের তারিখ",
  "MSP CALCULATION":"MSP হিসাব","Final Quantity & Procurement Amount":"চূড়ান্ত পরিমাণ ও সংগ্রহের অর্থ","Final Accepted Quantity":"চূড়ান্ত গৃহীত পরিমাণ",
  "MSP per Quintal":"প্রতি কুইন্টালে MSP","Total Procurement Amount":"মোট সংগ্রহের অর্থ","Final quantity × MSP":"চূড়ান্ত পরিমাণ × MSP",
  "REGISTERED PAYMENT ACCOUNT":"নিবন্ধিত পেমেন্ট অ্যাকাউন্ট","Bank / DBT Details":"ব্যাংক / DBT তথ্য","Payment Details Verified":"পেমেন্টের তথ্য যাচাই করা হয়েছে",
  "Payment will be sent to your registered DBT account.":"পেমেন্ট আপনার নিবন্ধিত DBT অ্যাকাউন্টে পাঠানো হবে।","Bank Name":"ব্যাংকের নাম","Account Number":"অ্যাকাউন্ট নম্বর","IFSC Code":"IFSC কোড",
  "Your full bank account number is never displayed here.":"আপনার সম্পূর্ণ ব্যাংক অ্যাকাউন্ট নম্বর এখানে কখনও দেখানো হয় না।","PAYMENT TRACKING":"পেমেন্ট ট্র্যাকিং","Payment Status":"পেমেন্টের অবস্থা",
  "Current Payment Status":"বর্তমান পেমেন্টের অবস্থা","Your procurement payment is being processed and will be credited to your registered DBT account.":"আপনার সংগ্রহের পেমেন্ট প্রক্রিয়াধীন এবং নিবন্ধিত DBT অ্যাকাউন্টে জমা হবে।",
  "Payment Processing":"পেমেন্ট প্রক্রিয়াধীন","Payment Credited":"পেমেন্ট জমা হয়েছে","Payment status may change after verification and processing by the procurement system.":"সংগ্রহ ব্যবস্থা যাচাই ও প্রক্রিয়াকরণের পর পেমেন্টের অবস্থা পরিবর্তিত হতে পারে।",
  "PROCUREMENT CONFIRMATION":"সংগ্রহ নিশ্চিতকরণ","Procurement Details Finalized":"সংগ্রহের তথ্য চূড়ান্ত হয়েছে","Your procurement details have been finalized successfully.":"আপনার সংগ্রহের তথ্য সফলভাবে চূড়ান্ত হয়েছে।",
  "Track Payment Status":"পেমেন্টের অবস্থা দেখুন","Check this section for future payment updates.":"ভবিষ্যতের পেমেন্ট আপডেটের জন্য এই অংশটি দেখুন।","Receive Notifications":"নোটিফিকেশন পান"
});

/* Hindi translations */
Object.assign(dashboardTranslations.hi, {
  "Official source:":"आधिकारिक स्रोत:","Check official CACP MSP page ↗":"आधिकारिक CACP MSP पेज देखें ↗",
  "Crop Procurement":"फसल खरीद","FARMER PROCUREMENT DESK":"किसान खरीद डेस्क","Farmer":"किसान","Registered Farmer":"पंजीकृत किसान","Logout":"लॉगआउट",
  "LIVE MSP 2026–27":"लाइव MSP 2026–27","GOVERNMENT BENCHMARKS":"सरकारी मानक","All":"सभी","Kharif":"खरीफ","Rabi":"रबी","Commercial":"वाणिज्यिक","Pause":"रोकें","Resume":"चलाएं",
  "OFFICIAL FARMER DESK":"आधिकारिक किसान डेस्क","Farmer Procurement Dashboard":"किसान खरीद डैशबोर्ड",
  "Welcome to your integrated crop procurement portal. Book procurement slots, register your crop, track your queue position, and monitor procurement status.":"आपके एकीकृत फसल खरीद पोर्टल में आपका स्वागत है। खरीद स्लॉट बुक करें, फसल पंजीकृत करें, कतार में अपनी स्थिति देखें और खरीद की स्थिति पर नज़र रखें।",
  "FARMER SERVICES":"किसान सेवाएं","Procurement Services":"खरीद सेवाएं","Choose a service to manage your crop procurement journey.":"अपनी फसल खरीद प्रक्रिया को प्रबंधित करने के लिए सेवा चुनें।",
  "CROP & MSP INFORMATION":"फसल और MSP जानकारी","Check MSP, crop season, and procurement status before booking your procurement slot.":"खरीद स्लॉट बुक करने से पहले MSP, फसल का मौसम और खरीद की स्थिति देखें।","View Information":"जानकारी देखें",
  "PROCUREMENT SLOT BOOKING":"खरीद स्लॉट बुकिंग","Select a procurement center, delivery date, and available time slot.":"खरीद केंद्र, डिलीवरी तारीख और उपलब्ध समय चुनें।","Book Slot":"स्लॉट बुक करें",
  "CROP REGISTRATION":"फसल पंजीकरण","Register your produce details before booking procurement.":"खरीद बुक करने से पहले अपनी उपज की जानकारी पंजीकृत करें।","Register Crop":"फसल पंजीकृत करें",
  "TOKEN & QUEUE STATUS":"टोकन और कतार स्थिति","Track your procurement token, queue position, congestion, and estimated waiting time.":"अपना खरीद टोकन, कतार स्थिति, भीड़ और अनुमानित प्रतीक्षा समय देखें।","View Queue Status":"कतार स्थिति देखें",
  "PROCUREMENT & PAYMENT":"खरीद और भुगतान","View final procurement details, MSP amount, and payment status.":"अंतिम खरीद विवरण, MSP राशि और भुगतान स्थिति देखें।","View Procurement":"खरीद देखें",
  "TRANSACTION HISTORY":"लेन-देन इतिहास","View your previous procurement and payment records.":"अपने पिछले खरीद और भुगतान रिकॉर्ड देखें।","View History":"इतिहास देखें",
  "FARMER INFORMATION":"किसान जानकारी","🌾 Crop & MSP Information":"🌾 फसल और MSP जानकारी","Check crop season, MSP and current procurement status.":"फसल का मौसम, MSP और वर्तमान खरीद स्थिति देखें।",
  "Source:":"स्रोत:","Commission for Agricultural Costs & Prices (CACP)":"कृषि लागत एवं मूल्य आयोग (CACP)","← Back to Crops":"← फसलों पर वापस जाएं",
  "Minimum Support Price":"न्यूनतम समर्थन मूल्य","Procurement Status":"खरीद स्थिति","🟢 Procurement Open":"🟢 खरीद खुली है","Procurement Period":"खरीद अवधि","Crop Year":"फसल वर्ष","Last Updated":"अंतिम अपडेट",
  "Book Procurement Slot":"खरीद स्लॉट बुक करें","Information based on official procurement/MSP data.":"आधिकारिक खरीद/MSP जानकारी पर आधारित।",
  "📅 Procurement Slot Booking":"📅 खरीद स्लॉट बुकिंग","Select your procurement center, date, and intake slot.":"अपना खरीद केंद्र, तारीख और प्राप्ति स्लॉट चुनें।","Selected Crop":"चयनित फसल",
  "Procurement Center":"खरीद केंद्र","Select a procurement center":"खरीद केंद्र चुनें","Central Procurement Center":"केंद्रीय खरीद केंद्र","North Procurement Center":"उत्तर खरीद केंद्र","South Procurement Center":"दक्षिण खरीद केंद्र",
  "Preferred Date":"पसंदीदा तारीख","Select Intake Slot":"प्राप्ति स्लॉट चुनें","Morning":"सुबह","Afternoon":"दोपहर","24 slots available":"24 स्लॉट उपलब्ध","18 slots available":"18 स्लॉट उपलब्ध",
  "Booking Summary":"बुकिंग सारांश","Center":"केंद्र","Date":"तारीख","Time Slot":"समय स्लॉट","Confirm Reservation":"आरक्षण की पुष्टि करें","Your booking confirmation and queue token will be generated after reservation.":"आरक्षण के बाद आपकी बुकिंग पुष्टि और कतार टोकन तैयार होगा।",
  "📝 Crop Registration":"📝 फसल पंजीकरण","Register your produce details for procurement.":"खरीद के लिए अपनी उपज की जानकारी पंजीकृत करें।","Farmer Information":"किसान जानकारी","Farmer Name":"किसान का नाम","Mobile Number":"मोबाइल नंबर","Produce Information":"उपज की जानकारी","Expected Quantity":"अनुमानित मात्रा","Quintals":"क्विंटल","Harvest / Ready Date":"कटाई / तैयार होने की तारीख","Land / Plot Reference":"भूमि / प्लॉट संदर्भ","Your crop details will be used to prepare your procurement booking and queue information.":"आपकी फसल की जानकारी खरीद बुकिंग और कतार की जानकारी तैयार करने में उपयोग होगी।","Submit Crop Registration":"फसल पंजीकरण जमा करें",
  "Payment and bank details are handled separately during the procurement payment process.":"भुगतान और बैंक विवरण खरीद भुगतान प्रक्रिया में अलग से संभाले जाते हैं।",
  "🎟️ Live Token & Queue":"🎟️ लाइव टोकन और कतार","Track your procurement token and queue progress.":"अपने खरीद टोकन और कतार की प्रगति देखें।","YOUR PROCUREMENT TOKEN":"आपका खरीद टोकन","Crop":"फसल","Slot":"स्लॉट","LIVE QUEUE":"लाइव कतार","Your Queue Position":"आपकी कतार स्थिति","● LIVE":"● लाइव","Your current position":"आपकी वर्तमान स्थिति","6 farmers ahead of you":"आपसे आगे 6 किसान","Currently serving":"वर्तमान में सेवा में","Queue is moving normally":"कतार सामान्य रूप से चल रही है",
  "CENTER INTELLIGENCE":"केंद्र इंटेलिजेंस","Procurement Center Congestion":"खरीद केंद्र की भीड़","Current Congestion":"वर्तमान भीड़","MODERATE":"मध्यम","Moderate waiting pressure at this center.":"इस केंद्र पर मध्यम प्रतीक्षा दबाव है।","Farmers waiting":"प्रतीक्षारत किसान","Counters active":"सक्रिय काउंटर","Avg. processing":"औसत प्रसंस्करण",
  "Congestion is estimated from current queue volume, active processing counters, and average processing time.":"भीड़ का अनुमान वर्तमान कतार, सक्रिय काउंटर और औसत प्रसंस्करण समय के आधार पर लगाया जाता है।","YOUR ESTIMATED WAIT":"आपका अनुमानित इंतजार","minutes":"मिनट","Based on your queue position,active counters and the current center processing speed.":"आपकी कतार स्थिति, सक्रिय काउंटर और वर्तमान केंद्र की प्रसंस्करण गति के आधार पर।","This is an estimated waiting time and may change as the queue moves.":"यह अनुमानित प्रतीक्षा समय है और कतार के आगे बढ़ने पर बदल सकता है।",
  "PROCUREMENT JOURNEY":"खरीद प्रक्रिया","Your Current Status":"आपकी वर्तमान स्थिति","Booked":"बुक किया गया","Slot successfully reserved":"स्लॉट सफलतापूर्वक आरक्षित","Waiting":"प्रतीक्षा में","You are currently in the queue":"आप वर्तमान में कतार में हैं","Processing":"प्रसंस्करण","Your produce will be processed":"आपकी उपज का प्रसंस्करण होगा","Completed":"पूर्ण","Procurement completed":"खरीद पूरी हुई",
  "📜 Transaction History":"📜 लेन-देन इतिहास","Total Transactions":"कुल लेन-देन","Total Quantity":"कुल मात्रा","Total Procurement Value":"कुल खरीद मूल्य","PROCUREMENT RECORDS":"खरीद रिकॉर्ड","Your Transactions":"आपके लेन-देन","Accepted Quantity":"स्वीकृत मात्रा","MSP Applied":"लागू MSP","Procurement Amount":"खरीद राशि","Token":"टोकन","Booking Reference":"बुकिंग संदर्भ","No Transactions Yet":"अभी कोई लेन-देन नहीं","Your completed procurement records will appear here.":"आपके पूर्ण खरीद रिकॉर्ड यहां दिखाई देंगे।","💰 Finalize Procurement & Payment":"💰 खरीद और भुगतान पूरा करें","Review your final procurement details and payment status.":"अपने अंतिम खरीद विवरण और भुगतान स्थिति की समीक्षा करें।"


});

Object.assign(dashboardTranslations.hi, {
  "PROCUREMENT RESULT":"खरीद परिणाम","Final Procurement Summary":"अंतिम खरीद सारांश","Procurement Completed":"खरीद पूरी हुई",
  "Your produce has been processed at the procurement center.":"आपकी उपज को खरीद केंद्र पर संसाधित किया गया है।","Procurement Date":"खरीद तारीख",
  "MSP CALCULATION":"MSP गणना","Final Quantity & Procurement Amount":"अंतिम मात्रा और खरीद राशि","Final Accepted Quantity":"अंतिम स्वीकृत मात्रा",
  "MSP per Quintal":"प्रति क्विंटल MSP","Total Procurement Amount":"कुल खरीद राशि","Final quantity × MSP":"अंतिम मात्रा × MSP",
  "REGISTERED PAYMENT ACCOUNT":"पंजीकृत भुगतान खाता","Bank / DBT Details":"बैंक / DBT विवरण","Payment Details Verified":"भुगतान विवरण सत्यापित",
  "Payment will be sent to your registered DBT account.":"भुगतान आपके पंजीकृत DBT खाते में भेजा जाएगा।","Bank Name":"बैंक का नाम","Account Number":"खाता नंबर","IFSC Code":"IFSC कोड",
  "Your full bank account number is never displayed here.":"आपका पूरा बैंक खाता नंबर यहां कभी प्रदर्शित नहीं किया जाता।","PAYMENT TRACKING":"भुगतान ट्रैकिंग","Payment Status":"भुगतान स्थिति",
  "Current Payment Status":"वर्तमान भुगतान स्थिति","Your procurement payment is being processed and will be credited to your registered DBT account.":"आपका खरीद भुगतान संसाधित हो रहा है और पंजीकृत DBT खाते में जमा होगा।",
  "Payment Processing":"भुगतान प्रक्रिया में","Payment Credited":"भुगतान जमा","Payment status may change after verification and processing by the procurement system.":"खरीद प्रणाली द्वारा सत्यापन और प्रसंस्करण के बाद भुगतान स्थिति बदल सकती है।",
  "PROCUREMENT CONFIRMATION":"खरीद पुष्टि","Procurement Details Finalized":"खरीद विवरण अंतिम किए गए","Your procurement details have been finalized successfully.":"आपकी खरीद जानकारी सफलतापूर्वक अंतिम की गई है।",
  "Track Payment Status":"भुगतान स्थिति देखें","Check this section for future payment updates.":"भविष्य के भुगतान अपडेट के लिए इस भाग को देखें।","Receive Notifications":"सूचनाएं प्राप्त करें"
});
/* Crop names and status labels */
const cropNameTranslations = {
  en:{Rice:"Rice",Jute:"Jute",Maize:"Maize",Potato:"Potato",Wheat:"Wheat",Mustard:"Mustard",Groundnut:"Groundnut",Sunflower:"Sunflower",Gram:"Gram"},
  bn:{Rice:"চাল",Jute:"পাট",Maize:"ভুট্টা",Potato:"আলু",Wheat:"গম",Mustard:"সরিষা",Groundnut:"চিনাবাদাম",Sunflower:"সূর্যমুখী",Gram:"ছোলা"},
  hi:{Rice:"चावल",Jute:"जूट",Maize:"मक्का",Potato:"आलू",Wheat:"गेहूं",Mustard:"सरसों",Groundnut:"मूंगफली",Sunflower:"सूरजमुखी",Gram:"चना"}
};

const dashboardOriginalText = new WeakMap();

function translateDashboardText() {
  const map = dashboardTranslations[currentLanguage] || dashboardTranslations.en;
  const root = document.getElementById("farmerDashboard") || document.body;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(function(node) {
    if (!dashboardOriginalText.has(node)) {
      dashboardOriginalText.set(node, node.textContent.trim());
    }
    const original = dashboardOriginalText.get(node);
    if (!original) return;
    const normalized = original.replace(/\\s+/g, " ");
    const translated = map[original] || map[normalized];
    if (translated) node.textContent = translated;
  });

  root.querySelectorAll("input, textarea").forEach(function(el) {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key && map[key]) el.placeholder = map[key];
  });

  root.querySelectorAll("select option").forEach(function(option) {
    const original = option.getAttribute("data-i18n-original") || option.textContent.trim();
    option.setAttribute("data-i18n-original", original);
    if (map[original]) option.textContent = map[original];
  });

  if (dashboardFarmerName) {
    const savedName = localStorage.getItem("farmerName");
    dashboardFarmerName.textContent = savedName || map["Farmer"] || "Farmer";
  }
}

function translateCropNames() {
  const map = cropNameTranslations[currentLanguage] || cropNameTranslations.en;

  // Crop cards are rendered from the same data source as the ticker.
  // This avoids Bengali text becoming the source for a later Hindi translation.
  document.querySelectorAll("#farmerDashboard .crop-msp-card").forEach(function(card) {
    const key = card.getAttribute("data-crop-key");
    if (!key || !map[key]) return;

    const nameEl = card.querySelector(".crop-msp-card-name");
    if (nameEl) nameEl.textContent = map[key];
  });

  // Selected crop/detail areas use data-crop-key so language changes are reversible.
  document.querySelectorAll("[data-crop-key]").forEach(function(el) {
    if (el.classList.contains("crop-msp-card")) return;
    const key = el.getAttribute("data-crop-key");
    if (key && map[key]) el.textContent = map[key];
  });

  if (typeof window.renderCropTicker === "function") {
    window.renderCropTicker();
  }
}

function applyDashboardLanguage() {
  // Render first so dynamically-created crop cards receive the active language.
  if (typeof window.renderCropMspCards === "function") {
    try { window.renderCropMspCards(); } catch (e) {}
  }
  translateDashboardText();
  translateCropNames();
}

if (dashboardLanguage) {
  dashboardLanguage.addEventListener("change", function () {
    currentLanguage = this.value;
    localStorage.setItem("preferredLanguage", currentLanguage);
    applyDashboardLanguage();
  });
}

if (dashboardLogout) {
  dashboardLogout.addEventListener("click", function () {
    document.querySelectorAll(".token-status-modal, .transaction-history-modal, .procurement-slot-modal, .crop-registration-modal, .crop-msp-modal").forEach(function(m) { m.classList.add("hidden"); });
    localStorage.removeItem("loggedInFarmerMobile");
    localStorage.removeItem("farmerName");
    localStorage.removeItem("selectedCropForBooking");
    localStorage.removeItem("latestProcurementBooking");
    localStorage.removeItem("cropRegistrationData");
    localStorage.removeItem("cropRegistrationCompleted");
    cropRegistrationCompleted = false;
    if (dashboardFarmerName) dashboardFarmerName.textContent = "Farmer";
    const fd = document.getElementById("farmerDashboard");
    if (fd) fd.classList.add("hidden");
    if (loginContainer) loginContainer.classList.remove("hidden");
    if (backgroundOverlay) backgroundOverlay.classList.remove("hidden");
    if (languageSwitcher) languageSwitcher.classList.remove("hidden");
    if (farmerModal) farmerModal.classList.add("hidden");
    if (adminModal) adminModal.classList.add("hidden");
    if (farmerOtpScreen) farmerOtpScreen.classList.add("hidden");
    if (newFarmerScreen) newFarmerScreen.classList.add("hidden");
    document.body.style.overflow = "";
    window.scrollTo({top:0, behavior:"instant"});
  });
}

function setDashboardFarmerName() {
  if (dashboardFarmerName) dashboardFarmerName.textContent = localStorage.getItem("farmerName") || "Farmer";
}

/* =========================================================
      UPDATE MAIN PAGE LANGUAGE
      ========================================================= */

function updateLanguage() {
  const text = translations[currentLanguage];

  /* -------------------------------------------------------
        MAIN PAGE
        ------------------------------------------------------- */

  document.querySelector(".welcome-section h1").textContent = text.pageTitle;

  document.querySelector(".welcome-section p").textContent =
    text.pageDescription;

  document.querySelector(".farmer-card h2").textContent = text.farmerTitle;

  document.querySelector(".farmer-card .card-description").textContent =
    text.farmerDescription;

  document.querySelector(
    ".farmer-button"
  ).innerHTML = `${text.farmerButton} <span>→</span>`;

  document.querySelector(".admin-card h2").textContent = text.adminTitle;

  document.querySelector(".admin-card .card-description").textContent =
    text.adminDescription;

  document.querySelector(
    ".admin-button"
  ).innerHTML = `${text.adminButton} <span>→</span>`;

  document.querySelector(".ivr-notice strong").textContent = text.ivrTitle;

  document.querySelector(".ivr-notice p").textContent = text.ivrDescription;

  document.querySelector("footer p").textContent = text.footer;

  /* -------------------------------------------------------
        LANGUAGE BUTTON
        ------------------------------------------------------- */

  languageText.textContent = currentLanguage === "en" ? "বাংলা" : "English";

  /* -------------------------------------------------------
        POPUPS
        ------------------------------------------------------- */

  updateModalLanguage();
  applyDashboardLanguage();
}

/* =========================================================
      LANGUAGE TOGGLE
      ========================================================= */

languageToggle.addEventListener("click", function () {
  const order = ["en", "bn", "hi"];
  const currentIndex = order.indexOf(currentLanguage);
  currentLanguage = order[(currentIndex + 1) % order.length];

  updateLanguage();
});

/* =========================================================
      INITIALIZE
      ========================================================= */

updateLanguage();
/* =========================================================
   DASHBOARD CROP TICKER — DATA-DRIVEN + MULTILINGUAL
   ========================================================= */

const pauseCropTicker = document.getElementById("cropPauseButton");
const cropTrack = document.getElementById("cropTrack");

const cropFilters = document.querySelectorAll(".crop-filter");

let tickerPaused = false;

function formatMsp(value) {
  if (value === null || value === undefined || value === "") return "—";
  return "₹" + Number(value).toLocaleString("en-IN");
}

function getCropSeasonLabel(season) {
  const labels = {
    en: { kharif: "KHARIF", rabi: "RABI", commercial: "COMMERCIAL" },
    bn: { kharif: "খরিফ", rabi: "রবি", commercial: "বাণিজ্যিক" },
    hi: { kharif: "खरीफ", rabi: "रबी", commercial: "वाणिज्यिक" }
  };
  return (labels[currentLanguage] || labels.en)[season] || season.toUpperCase();
}

window.renderCropTicker = function renderCropTicker() {
  if (!cropTrack || typeof cropMspData === "undefined") return;

  const map = (typeof cropNameTranslations !== "undefined"
    ? cropNameTranslations[currentLanguage]
    : null) || {};

  const sequence = document.createElement("div");
  sequence.className = "crop-sequence";

  cropMspData.forEach(function(crop) {
    const item = document.createElement("div");
    item.className = "crop-item";
    item.dataset.season = crop.season;
    item.innerHTML = `
      <span class="crop-ticker-name">${crop.icon} ${map[crop.name] || crop.name}</span>
      <span class="crop-item-season">${getCropSeasonLabel(crop.season)}</span>
      <span class="crop-item-msp">MSP ${formatMsp(crop.msp)}</span>
    `;
    sequence.appendChild(item);
  });

  const clone = sequence.cloneNode(true);
  cropTrack.innerHTML = "";
  cropTrack.appendChild(sequence);
  cropTrack.appendChild(clone);

  cropTrack.style.animation = "none";
  void cropTrack.offsetWidth;
  cropTrack.style.animation = "cropScroll 16s linear infinite";
  cropTrack.style.animationPlayState = tickerPaused ? "paused" : "running";
};

function updateTickerFilter(selectedFilter) {
  if (!cropTrack) return;

  cropTrack.querySelectorAll(".crop-item").forEach(function(item) {
    item.style.display =
      selectedFilter === "all" || item.dataset.season === selectedFilter
        ? "inline-flex"
        : "none";
  });

  cropTrack.style.animation = "none";
  void cropTrack.offsetWidth;
  cropTrack.style.animation = "cropScroll 16s linear infinite";
  cropTrack.style.animationPlayState = tickerPaused ? "paused" : "running";
}

if (pauseCropTicker && cropTrack) {
  pauseCropTicker.addEventListener("click", function() {
    tickerPaused = !tickerPaused;
    cropTrack.style.animationPlayState = tickerPaused ? "paused" : "running";

    const pauseText = currentLanguage === "bn"
      ? (tickerPaused ? "▶ চালু করুন" : "Ⅱ বিরতি")
      : currentLanguage === "hi"
        ? (tickerPaused ? "▶ चलाएँ" : "Ⅱ रोकें")
        : (tickerPaused ? "▶ Resume" : "Ⅱ Pause");

    pauseCropTicker.textContent = pauseText;
  });
}

cropFilters.forEach(function(filterButton) {
  filterButton.addEventListener("click", function() {
    cropFilters.forEach(function(button) {
      button.classList.remove("active");
    });

    filterButton.classList.add("active");
    updateTickerFilter(filterButton.dataset.filter);
  });
});

if (cropTrack) {
  cropTrack.addEventListener("mouseenter", function() {
    cropTrack.style.animationPlayState = "paused";
  });

  cropTrack.addEventListener("mouseleave", function() {
    if (!tickerPaused) cropTrack.style.animationPlayState = "running";
  });
}

/* =========================================================
   FEATURE 01 OFFICIAL MSP DATA SYNC
   ========================================================= */

const OFFICIAL_MSP_SOURCE =
  "https://cacp.da.gov.in/Home/MSP";

const OFFICIAL_MSP_FALLBACK = [
  {name:"Rice", icon:"🌾", season:"kharif", seasonLabel:"KHARIF", msp:2441, status:"MSP Declared", period:"2026–27"},
  {name:"Jute", icon:"🌿", season:"commercial", seasonLabel:"COMMERCIAL", msp:5925, status:"MSP Declared", period:"2026–27"},
  {name:"Maize", icon:"🌽", season:"kharif", seasonLabel:"KHARIF", msp:2410, status:"MSP Declared", period:"2026–27"},
  {name:"Wheat", icon:"🌾", season:"rabi", seasonLabel:"RABI", msp:2585, status:"MSP Declared", period:"2026–27"},
  {name:"Mustard", icon:"🌱", season:"rabi", seasonLabel:"RABI", msp:6200, status:"MSP Declared", period:"2026–27"},
  {name:"Groundnut", icon:"🥜", season:"kharif", seasonLabel:"KHARIF", msp:7517, status:"MSP Declared", period:"2026–27"},
  {name:"Sunflower", icon:"🌻", season:"kharif", seasonLabel:"KHARIF", msp:8343, status:"MSP Declared", period:"2026–27"},
  {name:"Gram", icon:"🫘", season:"rabi", seasonLabel:"RABI", msp:5875, status:"MSP Declared", period:"2026–27"}
];

async function syncOfficialMspData() {
  const statusEl = document.getElementById("cropMspSyncStatus");

  try {
    const response = await fetch("/api/msp", {
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) throw new Error("MSP sync endpoint unavailable");

    const payload = await response.json();

    if (!payload || !Array.isArray(payload.crops) || !payload.crops.length) {
      throw new Error("No MSP data returned");
    }

    // Only replace data after validating the server response.
    cropMspData.splice(0, cropMspData.length, ...payload.crops);

    window.__mspLastUpdated =
      payload.sourceStatus === "live"
        ? new Date().toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })
        : "2026–27 official snapshot";

    if (statusEl) {
      statusEl.textContent = payload.sourceStatus === "live"
        ? `Official data synced • ${window.__mspLastUpdated}`
        : "Official 2026–27 snapshot • Check CACP for latest revision";
    }

    if (typeof window.renderCropMspCards === "function") {
      window.renderCropMspCards();
    }

    if (typeof window.renderCropTicker === "function") {
      window.renderCropTicker();
    }

    console.log("Official MSP data synced:", payload);
  } catch (error) {
    // Frontend remains usable with the bundled official 2026–27 snapshot.
    if (statusEl) {
      statusEl.textContent =
        "Official 2026–27 snapshot • Check CACP for latest revision";
    }

    console.warn("Official MSP auto-sync unavailable:", error);
  }
}

window.addEventListener("load", function() {
  if (typeof window.renderCropTicker === "function") {
    window.renderCropTicker();
  }
  syncOfficialMspData();
});

/* =========================================================
   FEATURE 02 — PROCUREMENT CENTER & SLOT BOOKING
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const card = document.getElementById("cardProcurementSlot");
  const modal = document.getElementById("procurementSlotModal");
  const overlay = document.getElementById("procurementSlotOverlay");
  const closeButton = document.getElementById("procurementSlotClose");

  const center = document.getElementById("procurementCenter");
  const date = document.getElementById("procurementDate");

  const slots = document.querySelectorAll(".booking-slot");

  const summary = document.getElementById("bookingSummary");
  const summaryCenter = document.getElementById("summaryCenter");
  const summaryDate = document.getElementById("summaryDate");
  const summarySlot = document.getElementById("summarySlot");

  const confirmButton = document.getElementById("confirmProcurementBooking");

  let selectedSlot = "";

  /* -----------------------------------------
       OPEN
       ----------------------------------------- */

  function openModal() {
    if (!modal) return;

    modal.classList.remove("hidden");

    // Get selected crop from Feature 01
    const selectedCrop = localStorage.getItem("selectedCropForBooking");

    const bookingCropName = document.getElementById("bookingCropName");

    const bookingCropIcon = document.getElementById("bookingCropIcon");

    const cropIcons = {
      Rice: "🌾",
      Jute: "🌿",
      Maize: "🌽",
      Potato: "🥔",
      Wheat: "🌾",
      Mustard: "🌱",
      Groundnut: "🥜",
      Sunflower: "🌻",
    };

    if (selectedCrop && bookingCropName) {
      bookingCropName.textContent = selectedCrop;
    }

    if (selectedCrop && bookingCropIcon) {
      bookingCropIcon.textContent = cropIcons[selectedCrop] || "🌾";
    }
  }
  /* -----------------------------------------
       CLOSE
       ----------------------------------------- */

  function closeModal() {
    if (!modal) return;

    modal.classList.add("hidden");
  }

  /* -----------------------------------------
       CARD
       ----------------------------------------- */

  if (card) {
    card.addEventListener("click", openModal);
  }

  /* -----------------------------------------
       CLOSE BUTTON
       ----------------------------------------- */

  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  /* -----------------------------------------
       OVERLAY
       ----------------------------------------- */

  if (overlay) {
    overlay.addEventListener("click", closeModal);
  }

  /* -----------------------------------------
       ESCAPE
       ----------------------------------------- */

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  /* -----------------------------------------
       SLOT SELECTION
       ----------------------------------------- */

  slots.forEach(function (slot) {
    slot.addEventListener("click", function () {
      slots.forEach(function (item) {
        item.classList.remove("selected");
      });

      slot.classList.add("selected");

      selectedSlot = slot.dataset.slot;

      updateSummary();
    });
  });

  /* -----------------------------------------
       SUMMARY
       ----------------------------------------- */

  function updateSummary() {
    if (!center || !date || !summary) return;

    const centerText = center.options[center.selectedIndex].text;

    summaryCenter.textContent = center.value ? centerText : "—";

    summaryDate.textContent = date.value || "—";

    if (selectedSlot === "morning") {
      summarySlot.textContent = "Morning — 8:00 AM to 12:00 PM";
    } else if (selectedSlot === "afternoon") {
      summarySlot.textContent = "Afternoon — 1:00 PM to 5:00 PM";
    } else {
      summarySlot.textContent = "—";
    }

    if (center.value && date.value && selectedSlot) {
      summary.classList.remove("hidden");
    } else {
      summary.classList.add("hidden");
    }
  }

  /* -----------------------------------------
       CENTER
       ----------------------------------------- */

  if (center) {
    center.addEventListener("change", updateSummary);
  }

  /* -----------------------------------------
       DATE
       ----------------------------------------- */

  if (date) {
    date.addEventListener("change", updateSummary);
  }

  /* -----------------------------------------
     CONFIRM
     ----------------------------------------- */

  if (confirmButton) {
    confirmButton.addEventListener("click", async function () {
      const centerSelected = center && center.value !== "";
      const dateSelected = date && date.value !== "";
      const slotSelected = selectedSlot !== "";

      if (!centerSelected || !dateSelected || !slotSelected) {
        alert("Please select a procurement center, date, and intake slot.");
        return;
      }

      // Check whether Crop Registration is completed
      if (!cropRegistrationCompleted) {
        const cropRegistrationModal = document.getElementById(
          "cropRegistrationModal"
        );

        if (typeof window.openCropRegistrationModal === "function") {
          window.openCropRegistrationModal();

          console.log("Opening Feature 03 — Crop Registration.");
        } else {
          console.error("Feature 03 opening function was not found.");
        }

        return;
      }

      /* -----------------------------------------
     GATHER REAL BOOKING INPUTS
     ----------------------------------------- */

      const mobile = localStorage.getItem("loggedInFarmerMobile") || "";
      const farmerName = localStorage.getItem("farmerName") || "";
      const cropName = localStorage.getItem("selectedCropForBooking") || "";
      const centerName = center.options[center.selectedIndex].text;

      let expectedQuantity = 1;
      try {
        const regData = JSON.parse(localStorage.getItem("cropRegistrationData") || "{}");
        if (regData.expectedQuantity) expectedQuantity = Number(regData.expectedQuantity);
      } catch (err) {
        console.error("Could not read crop registration data:", err);
      }

      if (!window.AnnasetuSync) {
        alert("Booking service is unavailable right now. Please refresh and try again.");
        return;
      }

      confirmButton.disabled = true;

      /* -----------------------------------------
     WRITE THE REAL BOOKING + TOKEN TO SUPABASE
     SO IT SHOWS UP IN THE ADMIN PORTAL
     ----------------------------------------- */

      let result;
      try {
        result = await window.AnnasetuSync.bookProcurementSlot({
          mobile,
          farmerName,
          cropName,
          centerName,
          dateStr: date.value,
          slotKey: selectedSlot,
          quantity: expectedQuantity,
        });
      } catch (err) {
        console.error("Booking failed:", err);
        alert("Could not confirm your reservation right now. Please check your connection and try again.");
        confirmButton.disabled = false;
        return;
      }
      confirmButton.disabled = false;

      const bookingId = result.booking.booking_code;
      const tokenId = String(result.token.token_number);

      /* -----------------------------------------
   PREPARE COMPLETE BOOKING DATA (kept in localStorage
   so the Token/Payment/Transaction screens, which read
   the last booking locally, still work as before)
   ----------------------------------------- */

      const bookingData = {
        bookingId: bookingId,
        bookingUuid: result.booking.id,
        farmerUuid: result.farmer.id,
        centerId: result.booking.center_id,
        tokenId: tokenId,
        crop: cropName,
        center: centerName,
        centerValue: center.value,
        date: date.value,
        slot: selectedSlot,
        status: "Waiting",
        createdAt: new Date().toISOString(),
      };

      /* -----------------------------------------
   SAVE BOOKING INFORMATION
   ----------------------------------------- */

      localStorage.setItem("bookingId", bookingId);

      localStorage.setItem("procurementToken", tokenId);

      localStorage.setItem(
        "latestProcurementBooking",
        JSON.stringify(bookingData)
      );

      console.log("Booking saved to Supabase:", result);

      /* -----------------------------------------
   SHOW CONFIRMATION
   ----------------------------------------- */

      alert(
        "Reservation confirmed!\n\n" +
          "Booking ID: " +
          bookingId +
          "\n\n" +
          "Your token has been generated: #" +
          tokenId
      );

      /* -----------------------------------------
   OPEN FEATURE 04
   ----------------------------------------- */

      const tokenStatusModal = document.getElementById("tokenStatusModal");

      if (tokenStatusModal) {
        tokenStatusModal.classList.remove("hidden");

        document.body.style.overflow = "hidden";

        console.log("Feature 04 opened.");
      }
    });
  }
});
// =========================================================
// FARMER REGISTRATION STATUS
// =========================================================

let cropRegistrationCompleted =
  localStorage.getItem("cropRegistrationCompleted") === "true";
/* =========================================================
   FEATURE 03 — CROP / PRODUCE REGISTRATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const card = document.getElementById("cardCropRegistration");

  const modal = document.getElementById("cropRegistrationModal");

  const overlay = document.getElementById("cropRegistrationOverlay");

  const closeButton = document.getElementById("cropRegistrationClose");

  const submitButton = document.getElementById("submitCropRegistration");

  const farmerName = document.getElementById("registrationFarmerName");

  const mobile = document.getElementById("registrationMobile");

  const cropName = document.getElementById("registrationCropName");

  const cropIcon = document.getElementById("registrationCropIcon");

  const expectedQuantity = document.getElementById("expectedQuantity");

  const harvestDate = document.getElementById("harvestDate");

  const landReference = document.getElementById("landReference");

  /* ---------------------------------------------------------
       CROP ICONS
       --------------------------------------------------------- */

  const cropIcons = {
    Rice: "🌾",
    Jute: "🌿",
    Maize: "🌽",
    Potato: "🥔",
    Wheat: "🌾",
    Mustard: "🌱",
    Groundnut: "🥜",
    Sunflower: "🌻",
  };

  /* ---------------------------------------------------------
       OPEN MODAL
       --------------------------------------------------------- */

  function openRegistrationModal() {
    if (!modal) return;

    modal.classList.remove("hidden");

    document.body.style.overflow = "hidden";

    // Get crop selected earlier
    const selectedCrop = localStorage.getItem("selectedCropForBooking");

    if (selectedCrop && cropName) {
      cropName.textContent = selectedCrop;
    }

    if (selectedCrop && cropIcon) {
      cropIcon.textContent = cropIcons[selectedCrop] || "🌾";
    }
    // Load farmer identity from login/profile
    const loggedInMobile = localStorage.getItem("loggedInFarmerMobile");
    const savedFarmerName = localStorage.getItem("farmerName");

    // Mobile was verified during OTP login
    if (mobile) {
      if (loggedInMobile) {
        mobile.value = loggedInMobile;
      }

      mobile.readOnly = true;
    }

    // Farmer name comes from saved profile
    if (farmerName && savedFarmerName) {
      farmerName.value = savedFarmerName;
    }
  }
  window.openCropRegistrationModal = openRegistrationModal;
  /* ---------------------------------------------------------
       CLOSE MODAL
       --------------------------------------------------------- */

  function closeRegistrationModal() {
    if (!modal) return;

    modal.classList.add("hidden");

    document.body.style.overflow = "";
  }

  /* ---------------------------------------------------------
       DASHBOARD CARD
       --------------------------------------------------------- */

  if (card) {
    card.addEventListener("click", openRegistrationModal);
  }

  /* ---------------------------------------------------------
       CLOSE BUTTON
       --------------------------------------------------------- */

  if (closeButton) {
    closeButton.addEventListener("click", closeRegistrationModal);
  }

  /* ---------------------------------------------------------
       OVERLAY
       --------------------------------------------------------- */

  if (overlay) {
    overlay.addEventListener("click", closeRegistrationModal);
  }

  /* ---------------------------------------------------------
       ESCAPE
       --------------------------------------------------------- */

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeRegistrationModal();
    }
  });

  /* ---------------------------------------------------------
       SUBMIT REGISTRATION
       --------------------------------------------------------- */

  if (submitButton) {
    submitButton.addEventListener("click", function () {
      const quantity = expectedQuantity ? expectedQuantity.value.trim() : "";

      const selectedCrop = localStorage.getItem("selectedCropForBooking");

      /* -----------------------------------------------
             VALIDATION
             ----------------------------------------------- */

      if (!quantity) {
        alert("Please enter your expected crop quantity.");

        if (expectedQuantity) {
          expectedQuantity.focus();
        }

        return;
      }

      if (Number(quantity) <= 0) {
        alert("Please enter a valid crop quantity.");

        if (expectedQuantity) {
          expectedQuantity.focus();
        }

        return;
      }

      if (!selectedCrop) {
        alert("Please select a crop before registering.");

        closeRegistrationModal();

        return;
      }

      /* -----------------------------------------------
             SAVE REGISTRATION
             ----------------------------------------------- */

      const registrationData = {
        farmerName: farmerName ? farmerName.value.trim() : "",

        mobile: mobile ? mobile.value.trim() : "",

        crop: selectedCrop,

        expectedQuantity: quantity,

        harvestDate: harvestDate ? harvestDate.value : "",

        landReference: landReference ? landReference.value.trim() : "",

        registeredAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "cropRegistrationData",
        JSON.stringify(registrationData)
      );

      localStorage.setItem("cropRegistrationCompleted", "true");

      // BUG FIX: this in-memory flag (declared further down as
      // `let cropRegistrationCompleted`) is what the "Confirm
      // Reservation" click handler actually checks. Only writing
      // to localStorage above left this variable stuck at its
      // page-load value of false, so after finishing registration
      // the very next "Confirm Reservation" click still saw it as
      // incomplete and reopened this modal instead of booking —
      // an infinite loop that meant the booking (and its token)
      // could never be created. Updating it here is what lets the
      // farmer actually proceed to Step 4.
      cropRegistrationCompleted = true;

      console.log("Crop registration completed:", registrationData);

      /* -----------------------------------------------
             CLOSE FEATURE 03
             ----------------------------------------------- */

      closeRegistrationModal();

      /* -----------------------------------------------
             RETURN TO FEATURE 02
             ----------------------------------------------- */

      const procurementSlotModal = document.getElementById(
        "procurementSlotModal"
      );

      if (procurementSlotModal) {
        procurementSlotModal.classList.remove("hidden");

        document.body.style.overflow = "hidden";

        console.log("Returned to Feature 02.");
      }

      /* -----------------------------------------------
             USER CONFIRMATION
             ----------------------------------------------- */

      alert("Crop registration completed successfully.");
    });
  }
});
/* =========================================================
   FEATURE 04 — LOAD BOOKING DATA INTO TOKEN CARD
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const tokenModal = document.getElementById("tokenStatusModal");

  if (!tokenModal) {
    console.log("Feature 04 token modal not found.");
    return;
  }

  function setTokenModalEmptyState(isEmpty) {
    const emptyState = tokenModal.querySelector("#tokenEmptyState");
    const liveSections = tokenModal.querySelector("#tokenLiveSections");
    if (emptyState) emptyState.classList.toggle("hidden", !isEmpty);
    if (liveSections) liveSections.classList.toggle("hidden", isEmpty);
  }

  function loadBookingIntoTokenCard() {
    const savedBooking = localStorage.getItem("latestProcurementBooking");

    if (!savedBooking) {
      console.log("No procurement booking found.");
      setTokenModalEmptyState(true);
      return;
    }

    let booking;

    try {
      booking = JSON.parse(savedBooking);
    } catch (error) {
      console.error("Could not read procurement booking:", error);
      setTokenModalEmptyState(true);
      return;
    }

    setTokenModalEmptyState(false);

    /* -----------------------------------------
           TOKEN CARD ELEMENTS
           ----------------------------------------- */

    const tokenNumber = tokenModal.querySelector(".token-card-number");

    const tokenDetails = tokenModal.querySelectorAll(".token-detail strong");

    /* -----------------------------------------
           CROP ICONS
           ----------------------------------------- */

    const cropIcons = {
      Rice: "🌾",
      Jute: "🌿",
      Maize: "🌽",
      Potato: "🥔",
      Wheat: "🌾",
      Mustard: "🌱",
      Groundnut: "🥜",
      Sunflower: "🌻",
    };

    /* -----------------------------------------
           TOKEN
           ----------------------------------------- */

    if (tokenNumber && booking.tokenId) {
      tokenNumber.textContent = "#" + booking.tokenId;
    }

    /* -----------------------------------------
           CROP
           ----------------------------------------- */

    if (tokenDetails[0]) {
      const icon = cropIcons[booking.crop] || "🌾";

      tokenDetails[0].textContent = icon + " " + (booking.crop || "—");
    }

    /* -----------------------------------------
           CENTER
           ----------------------------------------- */

    if (tokenDetails[1]) {
      tokenDetails[1].textContent = booking.center || "—";
    }

    /* -----------------------------------------
           DATE
           ----------------------------------------- */

    if (tokenDetails[2]) {
      if (booking.date) {
        const dateObject = new Date(booking.date + "T00:00:00");

        tokenDetails[2].textContent = dateObject.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      } else {
        tokenDetails[2].textContent = "—";
      }
    }

    /* -----------------------------------------
           SLOT
           ----------------------------------------- */

    if (tokenDetails[3]) {
      if (booking.slot === "morning") {
        tokenDetails[3].textContent = "Morning · 8 AM – 12 PM";
      } else if (booking.slot === "afternoon") {
        tokenDetails[3].textContent = "Afternoon · 1 PM – 5 PM";
      } else {
        tokenDetails[3].textContent = "—";
      }
    }

    console.log("Feature 04 updated with booking:", booking);
  }
  /* -----------------------------------------
       WATCH TOKEN MODAL
       ----------------------------------------- */

  const observer = new MutationObserver(function () {
    const modalIsVisible = !tokenModal.classList.contains("hidden");

    if (modalIsVisible) {
      loadBookingIntoTokenCard();
    }
  });

  observer.observe(tokenModal, {
    attributes: true,
    attributeFilter: ["class"],
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const tokenCard = document.getElementById("cardTokenStatus");
  const tokenModal = document.getElementById("tokenStatusModal");
  const tokenOverlay = document.getElementById("tokenStatusOverlay");
  const tokenClose = document.getElementById("tokenStatusClose");

  function openTokenStatus() {
    if (!tokenModal) return;

    tokenModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeTokenStatus() {
    if (!tokenModal) return;

    tokenModal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  if (tokenCard) {
    tokenCard.addEventListener("click", openTokenStatus);
  }

  if (tokenClose) {
    tokenClose.addEventListener("click", closeTokenStatus);
  }

  if (tokenOverlay) {
    tokenOverlay.addEventListener("click", closeTokenStatus);
  }

  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      tokenModal &&
      !tokenModal.classList.contains("hidden")
    ) {
      closeTokenStatus();
    }
  });
});
/* =========================================================
   FEATURE 04 — LIVE QUEUE + WAIT + CONGESTION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const tokenModal = document.getElementById("tokenStatusModal");

  if (!tokenModal) return;

  async function updateLiveQueue() {
    /* -----------------------------------------
         GET BOOKING
         ----------------------------------------- */

    const savedBooking = localStorage.getItem("latestProcurementBooking");

    const emptyState = tokenModal.querySelector("#tokenEmptyState");
    const liveSections = tokenModal.querySelector("#tokenLiveSections");

    if (!savedBooking) {
      console.log("No booking available.");
      if (emptyState) emptyState.classList.remove("hidden");
      if (liveSections) liveSections.classList.add("hidden");
      return;
    }

    let booking;

    try {
      booking = JSON.parse(savedBooking);
    } catch (error) {
      console.error("Could not read booking data:", error);
      if (emptyState) emptyState.classList.remove("hidden");
      if (liveSections) liveSections.classList.add("hidden");
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");
    if (liveSections) liveSections.classList.remove("hidden");

    /* -----------------------------------------
         LIVE QUEUE DATA FROM SUPABASE
         (no fixed demo numbers — this reflects the
         real bookings/check-ins at this center)
         ----------------------------------------- */

    let snapshot = null;
    if (window.AnnasetuSync && booking.bookingUuid && booking.centerId) {
      try {
        snapshot = await window.AnnasetuSync.getQueueSnapshot({
          centerId: booking.centerId,
          bookingUuid: booking.bookingUuid,
          createdAt: booking.createdAt,
        });
      } catch (error) {
        console.error("Feature 04: Could not load live queue data.", error);
      }
    }

    const farmersAhead = snapshot ? snapshot.farmersAhead : 0;

    const queuePosition = farmersAhead + 1;

    const currentlyServing = snapshot && snapshot.currentlyServingToken
      ? String(snapshot.currentlyServingToken)
      : null;

    const queueStatus = booking.status || "Waiting";

    /* -----------------------------------------
         PROCESSING DATA
         One check-in counter per center (one admin
         account staffs each center — see admin portal).
         Average processing time is the real average of
         past check-in -> confirm times at this center;
         falls back to a labeled "not enough data yet"
         state rather than a made-up number.
         ----------------------------------------- */

    const activeCounters = 1;

    const averageProcessingTime =
      snapshot && snapshot.avgProcessingMinutes ? snapshot.avgProcessingMinutes : null;

    /* -----------------------------------------
         ESTIMATED WAIT
         ----------------------------------------- */

    const estimatedWait = averageProcessingTime
      ? Math.ceil((farmersAhead * averageProcessingTime) / activeCounters)
      : null;

    /* -----------------------------------------
         CONGESTION
         ----------------------------------------- */

    const waitingFarmers = snapshot ? snapshot.waitingFarmers : 0;

    let congestionLevel = "";

    const waitForCongestion = estimatedWait == null ? 0 : estimatedWait;

    if (waitingFarmers <= 10 && waitForCongestion <= 30) {
      congestionLevel = "LOW";
    } else if (waitingFarmers <= 25 && waitForCongestion <= 60) {
      congestionLevel = "MODERATE";
    } else {
      congestionLevel = "HIGH";
    }
    /* -----------------------------------------
   CONGESTION METRICS
   ----------------------------------------- */

    const waitingFarmersElement = tokenModal.querySelector(
      ".congestion-metric:nth-child(1) strong"
    );

    const activeCountersElement = tokenModal.querySelector(
      ".congestion-metric:nth-child(2) strong"
    );

    const averageProcessingElement = tokenModal.querySelector(
      ".congestion-metric:nth-child(3) strong"
    );

    if (waitingFarmersElement) {
      waitingFarmersElement.textContent = waitingFarmers;
    }

    if (activeCountersElement) {
      activeCountersElement.textContent = activeCounters;
    }

    if (averageProcessingElement) {
      averageProcessingElement.textContent =
        averageProcessingTime != null ? averageProcessingTime + " min" : "—";
    }
    /* -----------------------------------------
         QUEUE POSITION
         ----------------------------------------- */

    const positionNumber = tokenModal.querySelector(".queue-position-number");

    if (positionNumber) {
      positionNumber.textContent = queuePosition;
    }

    /* -----------------------------------------
         FARMERS AHEAD
         ----------------------------------------- */

    const positionInfo = tokenModal.querySelector(
      ".queue-position-info strong"
    );

    if (positionInfo) {
      positionInfo.textContent = farmersAhead + " farmers ahead of you";
    }

    /* -----------------------------------------
         CURRENTLY SERVING
         ----------------------------------------- */

    const currentlyServingElement = tokenModal.querySelector(
      ".queue-status-info strong"
    );

    if (currentlyServingElement) {
      currentlyServingElement.textContent = currentlyServing
        ? "#" + currentlyServing
        : "No one checked in yet";
    }

    /* -----------------------------------------
         QUEUE MOVEMENT STATUS
         ----------------------------------------- */

    const queueStatusText = tokenModal.querySelector("#queueMovingStatusText");

    if (queueStatusText) {
      if (queueStatus === "normal") {
        queueStatusText.textContent = "Queue is moving normally";
      } else if (queueStatus === "slow") {
        queueStatusText.textContent = "Queue is moving slowly";
      } else if (queueStatus === "busy") {
        queueStatusText.textContent = "Queue is experiencing high demand";
      }
    }

    /* -----------------------------------------
         ESTIMATED WAIT
         ----------------------------------------- */

    const estimatedWaitElement = tokenModal.querySelector("#estimatedWaitTime");

    if (estimatedWaitElement) {
      estimatedWaitElement.textContent =
        estimatedWait != null ? "~" + estimatedWait : "—";
    }

    /* -----------------------------------------
         CONGESTION LEVEL
         ----------------------------------------- */

    const congestionLevelElement = tokenModal.querySelector("#congestionLevel");

    if (congestionLevelElement) {
      congestionLevelElement.textContent = congestionLevel;
    }
    /* -----------------------------------------
   CONGESTION ICON
   ----------------------------------------- */

    const congestionLevelIcon = tokenModal.querySelector(
      "#congestionLevelIcon"
    );

    if (congestionLevelIcon) {
      if (congestionLevel === "LOW") {
        congestionLevelIcon.textContent = "🟢";
      } else if (congestionLevel === "MODERATE") {
        congestionLevelIcon.textContent = "🟠";
      } else {
        congestionLevelIcon.textContent = "🔴";
      }
    }
    /* -----------------------------------------
         CONGESTION DESCRIPTION
         ----------------------------------------- */

    const congestionDescription = tokenModal.querySelector(
      "#congestionDescription"
    );

    if (congestionDescription) {
      if (congestionLevel === "LOW") {
        congestionDescription.textContent =
          "Low waiting pressure at this center.";
      } else if (congestionLevel === "MODERATE") {
        congestionDescription.textContent =
          "Moderate waiting pressure at this center.";
      } else {
        congestionDescription.textContent =
          "High waiting pressure at this center.";
      }
    }
    /* -----------------------------------------
   QUEUE PROGRESS STATUS
   ----------------------------------------- */

    const progressSteps = tokenModal.querySelectorAll(".queue-progress-step");

    const progressLines = tokenModal.querySelectorAll(".queue-progress-line");

    const statusOrder = ["Booked", "Waiting", "Processing", "Completed"];

    const currentStatusIndex = statusOrder.indexOf(queueStatus);

    if (currentStatusIndex >= 0) {
      progressSteps.forEach(function (step, index) {
        step.classList.remove("completed");
        step.classList.remove("active");

        const dot = step.querySelector(".queue-progress-dot");

        if (index < currentStatusIndex) {
          step.classList.add("completed");
          if (dot) dot.textContent = "✓";
        } else if (dot) {
          dot.textContent = String(index + 1);
        }

        if (index === currentStatusIndex) {
          step.classList.add("active");
        }
      });

      progressLines.forEach(function (line, index) {
        line.classList.remove("completed-line");

        if (index < currentStatusIndex) {
          line.classList.add("completed-line");
        }
      });
    }
    /* -----------------------------------------
         DEBUG INFORMATION
         ----------------------------------------- */

    console.log("Feature 04 queue intelligence:", {
      token: booking.tokenId,

      queuePosition: queuePosition,

      farmersAhead: farmersAhead,

      activeCounters: activeCounters,

      averageProcessingTime: averageProcessingTime,

      estimatedWait: estimatedWait,

      waitingFarmers: waitingFarmers,

      congestionLevel: congestionLevel,
    });
  }

  /* -----------------------------------------
       UPDATE WHEN TOKEN MODAL OPENS
       ----------------------------------------- */

  const observer = new MutationObserver(function () {
    if (!tokenModal.classList.contains("hidden")) {
      updateLiveQueue();
    }
  });

  observer.observe(tokenModal, {
    attributes: true,

    attributeFilter: ["class"],
  });
});
/* =========================================================
   FEATURE 05 — PROCUREMENT & PAYMENT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const paymentCard = document.getElementById("cardProcurementPayment");

  const paymentModal = document.getElementById("procurementPaymentModal");

  const paymentOverlay = document.getElementById("procurementPaymentOverlay");

  const paymentClose = document.getElementById("procurementPaymentClose");

  /* =======================================================
       CHECK ELEMENTS
       ======================================================= */

  console.log("Feature 05 elements:", {
    card: paymentCard,
    modal: paymentModal,
    overlay: paymentOverlay,
    close: paymentClose,
  });

  /* =======================================================
       LOAD BOOKING DATA
       ======================================================= */

  async function loadPaymentProcurementData() {
    const savedBooking = localStorage.getItem("latestProcurementBooking");

    if (!savedBooking) {
      console.log("Feature 05: No procurement booking found.");

      return;
    }

    let booking;

    try {
      booking = JSON.parse(savedBooking);
    } catch (error) {
      console.error("Feature 05: Could not read booking data.", error);

      return;
    }

    const cropElement = document.getElementById("paymentCropName");
    const centerElement = document.getElementById("paymentCenterName");
    const dateElement = document.getElementById("paymentProcurementDate");
    const tokenElement = document.getElementById("paymentTokenId");
    const finalQuantityElement = document.getElementById("paymentFinalQuantity");
    const mspRateElement = document.getElementById("paymentMspRate");
    const totalAmountElement = document.getElementById("paymentTotalAmount");
    const statusIcon = document.getElementById("procurementStatusIcon");
    const statusTitle = document.getElementById("procurementStatusTitle");
    const statusDesc = document.getElementById("procurementStatusDesc");
    const paymentStatusElement = document.getElementById("paymentStatus");
    const paymentStatusDescElement = document.getElementById("paymentStatusDescription");
    const paymentStatusIconElement = document.getElementById("paymentStatusIcon");
    const step1 = document.getElementById("paymentProgressStep1");
    const step2 = document.getElementById("paymentProgressStep2");
    const step3 = document.getElementById("paymentProgressStep3");
    const line1 = document.getElementById("paymentProgressLine1");
    const line2 = document.getElementById("paymentProgressLine2");

    if (cropElement) cropElement.textContent = booking.crop || "—";
    if (centerElement) centerElement.textContent = booking.center || "—";
    if (dateElement) {
      if (booking.date) {
        const date = new Date(booking.date + "T00:00:00");
        dateElement.textContent = date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      } else {
        dateElement.textContent = "—";
      }
    }
    if (tokenElement) {
      tokenElement.textContent = booking.tokenId ? "#" + booking.tokenId : "—";
    }

    /* -----------------------------------------
       LIVE PROCUREMENT + PAYMENT DATA
       (real figures the center admin entered, and
       the real payment row — no fixed demo amounts)
       ----------------------------------------- */

    let snapshot = null;
    if (window.AnnasetuSync && booking.bookingUuid) {
      try {
        snapshot = await window.AnnasetuSync.getBookingSnapshot(booking.bookingUuid);
      } catch (error) {
        console.error("Feature 05: Could not load live procurement data.", error);
      }
    }

    const bookingStatus = snapshot ? snapshot.booking_status : "booked";
    const isConfirmed = bookingStatus === "confirmed";
    const isCheckedIn = bookingStatus === "checked_in" || isConfirmed;

    if (statusIcon) statusIcon.textContent = isConfirmed ? "✓" : "⏳";
    if (statusTitle) {
      statusTitle.textContent = isConfirmed
        ? "Procurement Completed"
        : isCheckedIn
        ? "Checked In — Awaiting Weigh-in"
        : "Booking Confirmed — Awaiting Check-in";
    }
    if (statusDesc) {
      statusDesc.textContent = isConfirmed
        ? "Your produce has been weighed and confirmed at the procurement center."
        : isCheckedIn
        ? "You've checked in. The center will weigh your produce shortly."
        : "Your booking is on record. Details below update once the center checks you in.";
    }

    if (finalQuantityElement) {
      finalQuantityElement.textContent =
        snapshot && snapshot.actual_quantity_quintal != null
          ? snapshot.actual_quantity_quintal + " Quintals"
          : "Pending weigh-in";
    }

    const mspRate = snapshot ? snapshot.msp_price : null;
    if (mspRateElement) {
      mspRateElement.textContent =
        mspRate != null ? "₹" + Number(mspRate).toLocaleString("en-IN") + " / Quintal" : "—";
    }

    if (totalAmountElement) {
      if (snapshot && snapshot.amount != null) {
        totalAmountElement.textContent = "₹" + Number(snapshot.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 });
      } else {
        totalAmountElement.textContent = "—";
      }
    }

    const paymentStatus = snapshot ? snapshot.payment_status : null;
    if (paymentStatusElement) {
      if (paymentStatus === "paid") paymentStatusElement.textContent = "Paid";
      else if (paymentStatus === "processing") paymentStatusElement.textContent = "Processing";
      else if (paymentStatus === "failed") paymentStatusElement.textContent = "Failed";
      else if (paymentStatus === "pending") paymentStatusElement.textContent = "On Hold (Pending)";
      else paymentStatusElement.textContent = "Awaiting Procurement";
    }
    if (paymentStatusIconElement) {
      paymentStatusIconElement.textContent = paymentStatus === "paid" ? "✅" : "⏳";
    }
    if (paymentStatusDescElement) {
      if (paymentStatus === "paid") {
        paymentStatusDescElement.textContent = "Your payment has been credited.";
      } else if (paymentStatus === "pending" || paymentStatus === "processing") {
        paymentStatusDescElement.textContent =
          "Your payment is held pending and will be released once processed via UPI/bank transfer.";
      } else {
        paymentStatusDescElement.textContent =
          "Your payment will be held and processed once the center confirms your procurement.";
      }
    }

    [step1, step2, step3].forEach((s) => s && s.classList.remove("completed", "active"));
    [line1, line2].forEach((l) => l && l.classList.remove("completed-line"));

    if (isConfirmed) {
      if (step1) step1.classList.add("completed");
      if (line1) line1.classList.add("completed-line");
      if (paymentStatus === "paid") {
        if (step2) step2.classList.add("completed");
        if (line2) line2.classList.add("completed-line");
        if (step3) step3.classList.add("active");
      } else {
        if (step2) step2.classList.add("active");
      }
    } else {
      if (step1) step1.classList.add("active");
    }

    console.log("Feature 05 booking loaded:", booking, snapshot);
  }

  /* =======================================================
       OPEN FEATURE 05
       ======================================================= */

  function openProcurementPayment() {
    if (!paymentModal) {
      console.error("Feature 05: Modal not found.");

      return;
    }

    paymentModal.classList.remove("hidden");

    document.body.style.overflow = "hidden";

    loadPaymentProcurementData();

    console.log("Feature 05 opened successfully.");
  }

  /* =======================================================
       CLOSE FEATURE 05
       ======================================================= */

  function closeProcurementPayment() {
    if (!paymentModal) return;

    paymentModal.classList.add("hidden");

    document.body.style.overflow = "";
  }

  /* =======================================================
       CARD CLICK
       ======================================================= */

  if (paymentCard) {
    paymentCard.addEventListener("click", openProcurementPayment);
  } else {
    console.error("Feature 05: Dashboard card not found.");
  }

  /* =======================================================
       CLOSE BUTTON
       ======================================================= */

  if (paymentClose) {
    paymentClose.addEventListener("click", closeProcurementPayment);
  }

  /* =======================================================
       OVERLAY CLICK
       ======================================================= */

  if (paymentOverlay) {
    paymentOverlay.addEventListener("click", closeProcurementPayment);
  }

  /* =======================================================
       ESCAPE KEY
       ======================================================= */

  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      paymentModal &&
      !paymentModal.classList.contains("hidden")
    ) {
      closeProcurementPayment();
    }
  });
});
// =========================================================
// FEATURE 06 — TRANSACTION HISTORY
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  const transactionCard = document.getElementById("cardTransactionHistory");

  const transactionModal = document.getElementById("transactionHistoryModal");

  const transactionOverlay = document.getElementById(
    "transactionHistoryOverlay"
  );

  const transactionClose = document.getElementById("transactionHistoryClose");

  /* =======================================================
     LOAD TRANSACTION DATA
     ======================================================= */

  async function loadTransactionHistory() {
    const savedBooking = localStorage.getItem("latestProcurementBooking");

    const emptyState = document.getElementById("transactionEmptyState");
    const transactionCardEl = document.querySelector(".transaction-card");

    if (!savedBooking) {
      console.log("Feature 06: No procurement transaction found.");
      if (emptyState) emptyState.classList.remove("hidden");
      if (transactionCardEl) transactionCardEl.classList.add("hidden");
      setTransactionTotals(0, null, null);
      return;
    }

    let booking;
    try {
      booking = JSON.parse(savedBooking);
    } catch (error) {
      console.error("Feature 06: Could not read booking data.", error);
      return;
    }

    /* -------------------------------------------------------
       LIVE DATA — same booking snapshot the payment screen
       uses, so figures always match what the center admin
       actually recorded (nothing hardcoded here).
       ------------------------------------------------------- */

    let snapshot = null;
    if (window.AnnasetuSync && booking.bookingUuid) {
      try {
        snapshot = await window.AnnasetuSync.getBookingSnapshot(booking.bookingUuid);
      } catch (error) {
        console.error("Feature 06: Could not load live transaction data.", error);
      }
    }

    if (!snapshot || snapshot.booking_status !== "confirmed") {
      // No completed procurement to show a transaction for yet.
      if (emptyState) emptyState.classList.remove("hidden");
      if (transactionCardEl) transactionCardEl.classList.add("hidden");
      setTransactionTotals(0, null, null);
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");
    if (transactionCardEl) transactionCardEl.classList.remove("hidden");

    const cropElement = document.getElementById("transactionCropName");
    const dateElement = document.getElementById("transactionDate");
    const centerElement = document.getElementById("transactionCenter");
    const tokenElement = document.getElementById("transactionToken");
    const bookingElement = document.getElementById("transactionBookingId");
    const paymentStatusElement = document.getElementById("transactionPaymentStatus");
    const quantityElement = document.getElementById("transactionQuantity");
    const mspElement = document.getElementById("transactionMsp");
    const amountElement = document.getElementById("transactionAmount");

    if (cropElement) cropElement.textContent = snapshot.crop_name || booking.crop || "—";
    if (centerElement) centerElement.textContent = snapshot.center_name || booking.center || "—";

    if (dateElement) {
      const dateSource = snapshot.confirmed_at || booking.date;
      if (dateSource) {
        const dateObject = new Date(dateSource);
        dateElement.textContent = dateObject.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      } else {
        dateElement.textContent = "—";
      }
    }

    if (tokenElement) {
      tokenElement.textContent = snapshot.token_number ? "#TK-" + snapshot.token_number : "—";
    }

    if (bookingElement) {
      bookingElement.textContent = snapshot.booking_code || booking.bookingId || "—";
    }

    const paymentStatus = snapshot.payment_status;
    if (paymentStatusElement) {
      if (paymentStatus === "paid") paymentStatusElement.textContent = "Paid";
      else if (paymentStatus === "processing") paymentStatusElement.textContent = "Processing";
      else if (paymentStatus === "failed") paymentStatusElement.textContent = "Failed";
      else paymentStatusElement.textContent = "On Hold (Pending)";
    }

    const finalQty = snapshot.actual_quantity_quintal;
    if (quantityElement) {
      quantityElement.textContent = finalQty != null ? finalQty + " Quintals" : "—";
    }

    const mspRate = snapshot.msp_price;
    if (mspElement) {
      mspElement.textContent = mspRate != null ? "₹" + Number(mspRate).toLocaleString("en-IN") + " / Quintal" : "—";
    }

    if (amountElement) {
      amountElement.textContent =
        snapshot.amount != null
          ? "₹" + Number(snapshot.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })
          : "—";
    }

    setTransactionTotals(1, finalQty, snapshot.amount);

    console.log("Feature 06 booking loaded:", booking, snapshot);
  }

  function setTransactionTotals(count, quantity, amount) {
    const totalTransactionsEl = document.getElementById("totalTransactions");
    const totalQuantityEl = document.getElementById("totalTransactionQuantity");
    const totalValueEl = document.getElementById("totalProcurementValue");

    if (totalTransactionsEl) totalTransactionsEl.textContent = String(count);
    if (totalQuantityEl) {
      totalQuantityEl.textContent = quantity != null ? quantity + " Quintals" : "—";
    }
    if (totalValueEl) {
      totalValueEl.textContent =
        amount != null ? "₹" + Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "—";
    }
  }

  /* =======================================================
       OPEN FEATURE 06
       ======================================================= */

  function openTransactionHistory() {
    if (!transactionModal) {
      console.error("Feature 06: Modal not found.");

      return;
    }

    transactionModal.classList.remove("hidden");

    document.body.style.overflow = "hidden";

    loadTransactionHistory();

    console.log("Feature 06 opened successfully.");
  }

  /* =======================================================
       CLOSE FEATURE 06
       ======================================================= */

  function closeTransactionHistory() {
    if (!transactionModal) return;

    transactionModal.classList.add("hidden");

    document.body.style.overflow = "";
  }

  /* =======================================================
       CARD CLICK
       ======================================================= */

  if (transactionCard) {
    transactionCard.addEventListener("click", openTransactionHistory);
  } else {
    console.error("Feature 06: Dashboard card not found.");
  }

  /* =======================================================
       CLOSE BUTTON
       ======================================================= */

  if (transactionClose) {
    transactionClose.addEventListener("click", closeTransactionHistory);
  }

  /* =======================================================
       OVERLAY CLICK
       ======================================================= */

  if (transactionOverlay) {
    transactionOverlay.addEventListener("click", closeTransactionHistory);
  }
});
