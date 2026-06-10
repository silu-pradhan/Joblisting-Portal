import { createJobCard } from "./components/jobCard.js";
import { createModalController } from "./components/modal.js";
import { filterJobs, getUniqueValues, populateFilter } from "./components/filters.js";
import { jobs } from "./data/jobs.js";
import { loadSavedJobs, saveJobs } from "./utils/storage.js";

const state = {
  keyword: "",
  location: "",
  category: "",
  experience: "",
  page: 1,
  perPage: 6,
  saved: loadSavedJobs()
};

const elements = {
  keywordSearch: document.querySelector("#keywordSearch"),
  locationFilter: document.querySelector("#locationFilter"),
  categoryFilter: document.querySelector("#categoryFilter"),
  experienceFilter: document.querySelector("#experienceFilter"),
  resetFilters: document.querySelector("#resetFilters"),
  jobGrid: document.querySelector("#jobGrid"),
  emptyState: document.querySelector("#emptyState"),
  pagination: document.querySelector("#pagination"),
  resultCount: document.querySelector("#resultCount"),
  matchCount: document.querySelector("#matchCount"),
  pageCount: document.querySelector("#pageCount"),
  heroTotalJobs: document.querySelector("#heroTotalJobs"),
  remoteJobCount: document.querySelector("#remoteJobCount"),
  topCategory: document.querySelector("#topCategory"),
  savedCount: document.querySelector("#savedCount"),
  savedCountHero: document.querySelector("#savedCountHero"),
  categoryBreakdown: document.querySelector("#categoryBreakdown"),
  modal: document.querySelector("#jobModal"),
  closeModal: document.querySelector("#closeModal"),
  modalCompany: document.querySelector("#modalCompany"),
  modalTitle: document.querySelector("#modalTitle"),
  modalTags: document.querySelector("#modalTags"),
  modalDescription: document.querySelector("#modalDescription"),
  modalResponsibilities: document.querySelector("#modalResponsibilities")
};

const modal = createModalController(elements, jobs);

function getCategoryCounts() {
  return jobs.reduce((counts, job) => {
    counts[job.category] = (counts[job.category] || 0) + 1;
    return counts;
  }, {});
}

function renderCategoryBreakdown() {
  const counts = getCategoryCounts();
  const chips = Object.entries(counts)
    .sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0]))
    .map(([category, count]) => {
      return `<div class="category-chip"><span>${category}</span><strong>${count}</strong></div>`;
    })
    .join("");

  elements.categoryBreakdown.innerHTML = `<h4>Categories</h4>${chips}`;
  elements.topCategory.textContent = Object.entries(counts).sort((first, second) => second[1] - first[1])[0][0];
}

function updateSummary(filteredJobs, totalPages, visibleJobs) {
  elements.resultCount.textContent = `Showing ${visibleJobs.length} of ${filteredJobs.length} jobs`;
  elements.matchCount.textContent = filteredJobs.length;
  elements.pageCount.textContent = `${state.page} / ${totalPages}`;
  elements.heroTotalJobs.textContent = jobs.length;
  elements.remoteJobCount.textContent = jobs.filter((job) => job.workMode === "Remote").length;
  elements.savedCount.textContent = state.saved.size;
  elements.savedCountHero.textContent = state.saved.size;
}

function renderPagination(totalPages) {
  elements.pagination.innerHTML = "";

  if (totalPages <= 1) {
    return;
  }

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `page-button ${pageNumber === state.page ? "is-active" : ""}`;
    button.textContent = pageNumber;
    button.setAttribute("aria-label", `Go to page ${pageNumber}`);
    button.addEventListener("click", () => {
      state.page = pageNumber;
      renderJobs();
      document.querySelector("#jobs").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    elements.pagination.appendChild(button);
  }
}

function renderJobs() {
  const filtered = filterJobs(jobs, state);
  const totalPages = Math.max(1, Math.ceil(filtered.length / state.perPage));

  if (state.page > totalPages) {
    state.page = totalPages;
  }

  const start = (state.page - 1) * state.perPage;
  const visibleJobs = filtered.slice(start, start + state.perPage);

  elements.jobGrid.innerHTML = visibleJobs
    .map((job) => createJobCard(job, state.saved.has(job.id)))
    .join("");
  elements.emptyState.hidden = filtered.length !== 0;
  elements.jobGrid.hidden = filtered.length === 0;

  updateSummary(filtered, totalPages, visibleJobs);
  renderPagination(totalPages);
}

function toggleSaved(jobId) {
  if (state.saved.has(jobId)) {
    state.saved.delete(jobId);
  } else {
    state.saved.add(jobId);
  }

  saveJobs(state.saved);
  renderJobs();
}

function resetFilters() {
  state.keyword = "";
  state.location = "";
  state.category = "";
  state.experience = "";
  state.page = 1;

  elements.keywordSearch.value = "";
  elements.locationFilter.value = "";
  elements.categoryFilter.value = "";
  elements.experienceFilter.value = "";

  renderJobs();
}

function bindFilterEvents() {
  elements.keywordSearch.addEventListener("input", (event) => {
    state.keyword = event.target.value;
    state.page = 1;
    renderJobs();
  });

  elements.locationFilter.addEventListener("change", (event) => {
    state.location = event.target.value;
    state.page = 1;
    renderJobs();
  });

  elements.categoryFilter.addEventListener("change", (event) => {
    state.category = event.target.value;
    state.page = 1;
    renderJobs();
  });

  elements.experienceFilter.addEventListener("change", (event) => {
    state.experience = event.target.value;
    state.page = 1;
    renderJobs();
  });

  elements.resetFilters.addEventListener("click", resetFilters);
}

function bindJobCardEvents() {
  elements.jobGrid.addEventListener("click", (event) => {
    const viewButton = event.target.closest("[data-job-id]");
    const saveButton = event.target.closest("[data-save-id]");

    if (viewButton) {
      modal.open(Number(viewButton.dataset.jobId));
    }

    if (saveButton) {
      toggleSaved(Number(saveButton.dataset.saveId));
    }
  });
}

function init() {
  populateFilter(elements.locationFilter, getUniqueValues(jobs, "location"));
  populateFilter(elements.categoryFilter, getUniqueValues(jobs, "category"));
  populateFilter(elements.experienceFilter, getUniqueValues(jobs, "experience"));
  renderCategoryBreakdown();
  bindFilterEvents();
  bindJobCardEvents();
  renderJobs();
}

init();
