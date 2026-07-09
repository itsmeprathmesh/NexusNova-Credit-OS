import { addNotification, login, registerBusiness } from "./app-data";
import type { BusinessRegistration } from "@/domain/types";

let seeded = false;

export function isSeeded() {
  return seeded;
}

export function seedDemoData() {
  if (seeded) return;
  seeded = true;

  const registration: BusinessRegistration = {
    businessName: "Aurora Precision Tools",
    ownerName: "Rohit Kulkarni",
    mobile: "+91 98765 43210",
    email: "rohit@auroratools.in",
    city: "Pune",
    pan: "AAKPA1842K",
    gstin: "27AAKPA1842K1Z8",
    udyam: "UDYAM-MH-26-0048123",
    businessType: "Private Limited",
    industry: "Manufacturing",
    businessAgeYears: 8,
    annualTurnover: 42000000,
    loanPurpose: "CNC inventory and receivables bridge"
  };

  registerBusiness(registration);
  login("msme-aurora");

  const now = new Date();
  const fmt = (hoursAgo: number) => new Date(now.getTime() - hoursAgo * 3600000).toISOString();

  addNotification({ type: "status-change", title: "Application Submitted", message: "Your Working Capital Term Loan request for ₹42L has been submitted for bank review.", timestamp: fmt(48) });
  addNotification({ type: "document-verified", title: "GST Returns Verified", message: "Your GST returns have been verified by the bank.", timestamp: fmt(36) });
  addNotification({ type: "document-verified", title: "PAN Verified", message: "Your PAN details are confirmed.", timestamp: fmt(32) });
  addNotification({ type: "document-verified", title: "ITR Verified", message: "Your Income Tax Returns have been verified.", timestamp: fmt(24) });
  addNotification({ type: "document-requested", title: "Udyam Certificate Required", message: "The bank needs your Udyam registration certificate before proceeding.", timestamp: fmt(20) });
  addNotification({ type: "status-change", title: "Documents Under Review", message: "Your bank statement and financial statement are under review.", timestamp: fmt(12) });
  addNotification({ type: "ai-review-complete", title: "AI Review Complete", message: "The AI has completed its analysis of your application.", timestamp: fmt(6) });
  addNotification({ type: "committee-complete", title: "Credit Committee Complete", message: "The AI Credit Committee has reached a conditional approval consensus.", timestamp: fmt(3) });
  addNotification({ type: "application-approved", title: "Application Approved", message: "Congratulations! Your loan has been approved by the loan officer.", timestamp: fmt(1) });

  const appArray = (globalThis as any).__applications;
  if (Array.isArray(appArray) && appArray.length > 0) {
    appArray[0].status = "approved";
    appArray[0].priority = "urgent";
    appArray[0].slaHoursRemaining = 2;
  }
}

export function resetDemoData() {
  seeded = false;
  const store = (globalThis as any).__store;
  if (store) {
    store.notifications = [];
    store.currentUser = null;
    store.businesses = [];
  }
  const appArray = (globalThis as any).__applications;
  if (Array.isArray(appArray)) {
    appArray.length = 0;
  }
}
