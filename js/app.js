import { createJobCard } from "./components/jobCard.js";
import { createModalController } from "./components/modal.js";
import { filterJobs, getUniqueValues, populateFilter } from "./components/filters.js";
import { jobs } from "./data/jobs.js";
import { loadSavedJobs, saveJobs, loadAppliedJobs, saveAppliedJobs } from "./utils/storage.js";

const state = {
  keyword: "",
  location: "",
  category: "",
  experience: "",
  page: 1,
  perPage: 6,
  saved: loadSavedJobs(),
  applied: loadAppliedJobs(),
  currentJobId: null
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
  modalResponsibilities: document.querySelector("#modalResponsibilities"),
  
  // New elements for job application flow
  modalApply: document.querySelector(".modal-apply"),
  applyModal: document.querySelector("#applyModal"),
  closeApplyModal: document.querySelector("#closeApplyModal"),
  applyForm: document.querySelector("#applyForm"),
  applyName: document.querySelector("#applyName"),
  applyEmail: document.querySelector("#applyEmail"),
  applyPhone: document.querySelector("#applyPhone"),
  applyLink: document.querySelector("#applyLink"),
  applyResume: document.querySelector("#applyResume"),
  resumeUploadText: document.querySelector("#resumeUploadText"),
  resumeUploadHint: document.querySelector("#resumeUploadHint"),
  applyCover: document.querySelector("#applyCover"),
  applyModalTitle: document.querySelector("#applyModalTitle"),
  
  statusModal: document.querySelector("#statusModal"),
  statusPosting: document.querySelector("#statusPosting"),
  statusSuccess: document.querySelector("#statusSuccess"),
  closeStatusModal: document.querySelector("#closeStatusModal"),
  
  // Applied Job History
  btnAppliedHistory: document.querySelector("#btnAppliedHistory"),
  historyModal: document.querySelector("#historyModal"),
  closeHistoryModal: document.querySelector("#closeHistoryModal"),
  historyContainer: document.querySelector("#historyContainer")
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
    .map((job) => createJobCard(job, state.saved.has(job.id), state.applied.some((app) => app.jobId === job.id)))
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
      const jobId = Number(viewButton.dataset.jobId);
      state.currentJobId = jobId;
      modal.open(jobId);
    }

    if (saveButton) {
      toggleSaved(Number(saveButton.dataset.saveId));
    }
  });
}

function validateForm() {
  let isValid = true;

  const setError = (inputEl, show) => {
    const group = inputEl.closest(".form-group");
    if (show) {
      group.classList.add("has-error");
      isValid = false;
    } else {
      group.classList.remove("has-error");
    }
  };

  const nameVal = elements.applyName.value.trim();
  setError(elements.applyName, nameVal.length === 0);

  const emailVal = elements.applyEmail.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  setError(elements.applyEmail, !emailRegex.test(emailVal));

  const phoneVal = elements.applyPhone.value.trim();
  const phoneRegex = /^[\d\s()+-]{7,}$/;
  setError(elements.applyPhone, !phoneRegex.test(phoneVal));

  const linkVal = elements.applyLink.value.trim();
  if (linkVal.length > 0) {
    try {
      new URL(linkVal);
      setError(elements.applyLink, false);
    } catch (_) {
      setError(elements.applyLink, true);
    }
  } else {
    setError(elements.applyLink, false);
  }

  const resumeFiles = elements.applyResume.files;
  setError(elements.applyResume, resumeFiles.length === 0);

  return isValid;
}

function closeApplyModal() {
  elements.applyModal.hidden = true;
  document.body.style.overflow = "";
  document.querySelectorAll(".apply-modal .form-group").forEach((group) => {
    group.classList.remove("has-error");
  });
  elements.applyForm.reset();
  elements.resumeUploadText.textContent = "Click to upload or drag & drop";
  elements.resumeUploadHint.textContent = "PDF, DOC, DOCX up to 5MB";
}

function closeStatusModal() {
  elements.statusModal.hidden = true;
  document.body.style.overflow = "";
}

function bindApplyFormEvents() {
  // Open Apply Form click from details modal
  elements.modalApply.addEventListener("click", () => {
    modal.close();
    const job = jobs.find((item) => item.id === state.currentJobId);
    if (!job) return;

    elements.applyModalTitle.textContent = `Apply for ${job.title} at ${job.company}`;
    elements.applyModal.hidden = false;
    document.body.style.overflow = "hidden";
    elements.closeApplyModal.focus();
  });

  // Clear errors on typing
  const inputs = [elements.applyName, elements.applyEmail, elements.applyPhone, elements.applyLink];
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.closest(".form-group").classList.remove("has-error");
    });
  });

  // Resume select handler
  elements.applyResume.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const group = elements.applyResume.closest(".form-group");
    group.classList.remove("has-error");
    
    if (file) {
      elements.resumeUploadText.textContent = `File selected: ${file.name}`;
      elements.resumeUploadHint.textContent = `Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB - Ready to upload`;
    } else {
      elements.resumeUploadText.textContent = "Click to upload or drag & drop";
      elements.resumeUploadHint.textContent = "PDF, DOC, DOCX up to 5MB";
    }
  });

  // Drag & drop visuals
  const uploadWrapper = elements.applyResume.closest(".file-upload-wrapper");
  elements.applyResume.addEventListener("dragenter", () => {
    uploadWrapper.classList.add("is-dragover");
  });
  elements.applyResume.addEventListener("dragleave", () => {
    uploadWrapper.classList.remove("is-dragover");
  });
  elements.applyResume.addEventListener("drop", () => {
    uploadWrapper.classList.remove("is-dragover");
  });

  // Close actions
  elements.closeApplyModal.addEventListener("click", closeApplyModal);
  elements.applyModal.addEventListener("click", (event) => {
    if (event.target === elements.applyModal) {
      closeApplyModal();
    }
  });

  elements.closeStatusModal.addEventListener("click", closeStatusModal);
  elements.statusModal.addEventListener("click", (event) => {
    if (event.target === elements.statusModal && !elements.statusSuccess.hidden) {
      closeStatusModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!elements.applyModal.hidden) {
        closeApplyModal();
      }
      if (!elements.statusModal.hidden && !elements.statusSuccess.hidden) {
        closeStatusModal();
      }
      if (!elements.historyModal.hidden) {
        closeHistoryModal();
      }
    }
  });

  // Form submit handler
  elements.applyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const job = jobs.find((item) => item.id === state.currentJobId);
    if (!job) return;

    // Capture application metadata
    const application = {
      id: Date.now(),
      jobId: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      appliedAt: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }),
      name: elements.applyName.value.trim(),
      email: elements.applyEmail.value.trim(),
      phone: elements.applyPhone.value.trim(),
      link: elements.applyLink.value.trim(),
      resumeName: elements.applyResume.files[0]?.name || "resume.pdf",
      coverLetter: elements.applyCover.value.trim()
    };

    // Close application form modal
    elements.applyModal.hidden = true;

    // Show status posting modal
    elements.statusPosting.hidden = false;
    elements.statusSuccess.hidden = true;
    elements.statusModal.hidden = false;

    // Simulate posting job latency
    setTimeout(() => {
      // Save application history
      state.applied.unshift(application);
      saveAppliedJobs(state.applied);
      renderJobs(); // Redraw job cards with their "Applied" badges

      elements.statusPosting.hidden = true;
      elements.statusSuccess.hidden = false;
      elements.applyForm.reset();
      elements.resumeUploadText.textContent = "Click to upload or drag & drop";
      elements.resumeUploadHint.textContent = "PDF, DOC, DOCX up to 5MB";
    }, 2000);
  });
}

function closeHistoryModal() {
  elements.historyModal.hidden = true;
  document.body.style.overflow = "";
}

function renderAppliedHistory() {
  elements.historyContainer.innerHTML = "";

  if (state.applied.length === 0) {
    elements.historyContainer.innerHTML = `
      <div class="history-empty">
        <span class="history-empty-icon">📁</span>
        <h3>No applications yet</h3>
        <p>Start applying for roles to see your history here.</p>
      </div>
    `;
    return;
  }

  const cards = state.applied.map((app) => {
    return `
      <article class="history-card">
        <div class="history-card-header">
          <div class="history-job-info">
            <h3>${app.title}</h3>
            <p>${app.company} &bull; ${app.location}</p>
          </div>
          <span class="history-date">Applied ${app.appliedAt}</span>
        </div>
        
        <div class="history-details-grid">
          <div class="history-detail-item">
            <span class="label">Candidate Name</span>
            <span class="value">${app.name}</span>
          </div>
          <div class="history-detail-item">
            <span class="label">Contact Info</span>
            <span class="value">${app.email}<br>${app.phone}</span>
          </div>
          <div class="history-detail-item">
            <span class="label">Resume / CV</span>
            <span class="value">📄 ${app.resumeName}</span>
          </div>
          ${app.link ? `
          <div class="history-detail-item">
            <span class="label">Portfolio / LinkedIn</span>
            <a class="value" href="${app.link}" target="_blank" rel="noopener noreferrer">${app.link}</a>
          </div>
          ` : ""}
        </div>
        
        ${app.coverLetter ? `
        <div class="history-cover-letter">
          <span class="label">Cover Letter Summary</span>
          <p>${app.coverLetter}</p>
        </div>
        ` : ""}
      </article>
    `;
  }).join("");

  elements.historyContainer.innerHTML = cards;
}

function bindHistoryEvents() {
  elements.btnAppliedHistory.addEventListener("click", () => {
    renderAppliedHistory();
    elements.historyModal.hidden = false;
    document.body.style.overflow = "hidden";
    elements.closeHistoryModal.focus();
  });

  elements.closeHistoryModal.addEventListener("click", closeHistoryModal);
  
  elements.historyModal.addEventListener("click", (event) => {
    if (event.target === elements.historyModal) {
      closeHistoryModal();
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
  bindApplyFormEvents();
  bindHistoryEvents();
  renderJobs();
}

init();
