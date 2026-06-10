const SAVED_JOBS_KEY = "careerGridSavedJobs";

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
