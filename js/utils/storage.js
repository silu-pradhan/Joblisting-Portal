const SAVED_JOBS_KEY = "careerGridSavedJobs";
const APPLIED_JOBS_KEY = "careerGridAppliedJobs";

export function loadSavedJobs() {
  try {
    return new Set(JSON.parse(localStorage.getItem(SAVED_JOBS_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

export function saveJobs(savedJobs) {
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify([...savedJobs]));
}

export function loadAppliedJobs() {
  try {
    return JSON.parse(localStorage.getItem(APPLIED_JOBS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveAppliedJobs(appliedJobs) {
  localStorage.setItem(APPLIED_JOBS_KEY, JSON.stringify(appliedJobs));
}
