const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "PixelForge Labs",
    location: "Bengaluru, India",
    category: "IT",
    experience: "Fresher",
    salary: "₹4.5 - 6 LPA",
    description: "Build responsive interfaces and reusable UI components for fast-growing SaaS products.",
    responsibilities: [
      "Create accessible pages using HTML, CSS, and JavaScript.",
      "Work with designers to polish layouts across device sizes.",
      "Fix UI bugs and improve page performance."
    ]
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Northstar Studio",
    location: "Remote",
    category: "Design",
    experience: "Mid-level",
    salary: "₹7 - 10 LPA",
    description: "Design clean product flows, prototypes, and visual systems for web and mobile teams.",
    responsibilities: [
      "Prepare wireframes, mockups, and interactive prototypes.",
      "Run usability reviews with product managers.",
      "Maintain consistent typography, spacing, and components."
    ]
  },
  {
    id: 3,
    title: "Digital Marketing Executive",
    company: "GrowthHive",
    location: "Mumbai, India",
    category: "Marketing",
    experience: "Fresher",
    salary: "₹3 - 4.8 LPA",
    description: "Plan campaigns, track metrics, and support content strategies for customer acquisition.",
    responsibilities: [
      "Manage social media calendars and campaign reports.",
      "Research keywords and competitor content.",
      "Coordinate with design and sales teams."
    ]
  },
  {
    id: 4,
    title: "Backend Engineer",
    company: "CloudNest",
    location: "Hyderabad, India",
    category: "IT",
    experience: "Senior",
    salary: "₹16 - 24 LPA",
    description: "Develop secure APIs, database models, and scalable services for enterprise workflows.",
    responsibilities: [
      "Build REST APIs and background jobs.",
      "Review architecture decisions and mentor junior developers.",
      "Improve reliability, logging, and database performance."
    ]
  },
  {
    id: 5,
    title: "Product Manager",
    company: "LaunchStack",
    location: "Pune, India",
    category: "Management",
    experience: "Mid-level",
    salary: "₹12 - 18 LPA",
    description: "Own roadmap planning, user research, and feature delivery for a B2B platform.",
    responsibilities: [
      "Write product briefs and prioritize sprint goals.",
      "Study user behavior and translate insights into features.",
      "Coordinate releases with design, engineering, and marketing."
    ]
  },
  {
    id: 6,
    title: "Data Analyst",
    company: "MetricLoop",
    location: "Delhi, India",
    category: "Analytics",
    experience: "Fresher",
    salary: "₹5 - 7 LPA",
    description: "Turn raw business data into dashboards, reports, and practical recommendations.",
    responsibilities: [
      "Clean datasets and create SQL-based reports.",
      "Build charts for sales, operations, and finance teams.",
      "Present insights in simple business language."
    ]
  },
  {
    id: 7,
    title: "React Developer",
    company: "Appsmithy",
    location: "Remote",
    category: "IT",
    experience: "Mid-level",
    salary: "₹9 - 14 LPA",
    description: "Create interactive dashboards and modern React features with reusable state patterns.",
    responsibilities: [
      "Build reusable React components and custom hooks.",
      "Integrate APIs and manage loading/error states.",
      "Collaborate on code reviews and frontend testing."
    ]
  },
  {
    id: 8,
    title: "Brand Strategist",
    company: "BrightPath Media",
    location: "Kolkata, India",
    category: "Marketing",
    experience: "Senior",
    salary: "₹11 - 15 LPA",
    description: "Shape campaign messaging, brand positioning, and content direction for clients.",
    responsibilities: [
      "Develop brand strategy documents and campaign concepts.",
      "Analyze audience segments and market trends.",
      "Lead creative reviews with writers and designers."
    ]
  },
  {
    id: 9,
    title: "Graphic Designer",
    company: "CanvasWorks",
    location: "Chennai, India",
    category: "Design",
    experience: "Fresher",
    salary: "₹3.5 - 5 LPA",
    description: "Design social posts, web graphics, and presentation assets for marketing teams.",
    responsibilities: [
      "Create brand-aligned graphics for digital channels.",
      "Prepare layout options and export production-ready files.",
      "Organize reusable design assets."
    ]
  },
  {
    id: 10,
    title: "HR Recruiter",
    company: "PeopleCore",
    location: "Noida, India",
    category: "Human Resources",
    experience: "Mid-level",
    salary: "₹5 - 8 LPA",
    description: "Manage hiring pipelines, screen candidates, and coordinate interview schedules.",
    responsibilities: [
      "Source candidates from job portals and networks.",
      "Maintain recruitment trackers and feedback loops.",
      "Support offer communication and onboarding handoffs."
    ]
  },
  {
    id: 11,
    title: "DevOps Engineer",
    company: "InfraCraft",
    location: "Remote",
    category: "IT",
    experience: "Senior",
    salary: "₹18 - 28 LPA",
    description: "Automate deployments, monitor cloud systems, and strengthen CI/CD pipelines.",
    responsibilities: [
      "Manage cloud infrastructure and release workflows.",
      "Improve monitoring, incident response, and security practices.",
      "Document deployment processes for engineering teams."
    ]
  },
  {
    id: 12,
    title: "Business Analyst",
    company: "BridgePoint Consulting",
    location: "Gurugram, India",
    category: "Analytics",
    experience: "Mid-level",
    salary: "₹8 - 12 LPA",
    description: "Convert stakeholder needs into clear requirements, process maps, and reports.",
    responsibilities: [
      "Gather requirements through stakeholder interviews.",
      "Prepare user stories, acceptance criteria, and process flows.",
      "Support QA and release validation."
    ]
  }
];

const state = {
  keyword: "",
  location: "",
  category: "",
  experience: "",
  page: 1,
  perPage: 6,
  saved: new Set(JSON.parse(localStorage.getItem("savedJobs") || "[]"))
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
  savedCount: document.querySelector("#savedCount"),
  savedCountHero: document.querySelector("#savedCountHero"),
  modal: document.querySelector("#jobModal"),
  closeModal: document.querySelector("#closeModal"),
  modalCompany: document.querySelector("#modalCompany"),
  modalTitle: document.querySelector("#modalTitle"),
  modalTags: document.querySelector("#modalTags"),
  modalDescription: document.querySelector("#modalDescription"),
  modalResponsibilities: document.querySelector("#modalResponsibilities")
};

function uniqueValues(key) {
  return [...new Set(jobs.map((job) => job[key]))].sort();
}

function populateFilter(select, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function filterJobs() {
  const keyword = state.keyword.trim().toLowerCase();

  return jobs.filter((job) => {
    const searchableText = `${job.title} ${job.company} ${job.description}`.toLowerCase();
    const matchesKeyword = !keyword || searchableText.includes(keyword);
    const matchesLocation = !state.location || job.location === state.location;
    const matchesCategory = !state.category || job.category === state.category;
    const matchesExperience = !state.experience || job.experience === state.experience;

    return matchesKeyword && matchesLocation && matchesCategory && matchesExperience;
  });
}

function jobCardTemplate(job) {
  const isSaved = state.saved.has(job.id);

  return `
    <article class="job-card">
      <div class="job-card-header">
        <div class="company-logo" aria-hidden="true">${job.company.slice(0, 2).toUpperCase()}</div>
        <button class="save-button ${isSaved ? "is-saved" : ""}" type="button" data-save-id="${job.id}" aria-label="${isSaved ? "Remove saved job" : "Save job"}">
          ${isSaved ? "♥" : "♡"}
        </button>
      </div>
      <div>
        <h3>${job.title}</h3>
        <p class="company-name">${job.company}</p>
      </div>
      <div class="job-meta">
        <span class="pill">${job.location}</span>
        <span class="pill">${job.category}</span>
        <span class="pill">${job.experience}</span>
      </div>
      <p class="job-description">${job.description}</p>
      <div class="card-actions">
        <span class="salary">${job.salary}</span>
        <button class="view-more-button" type="button" data-job-id="${job.id}">View More</button>
      </div>
    </article>
  `;
}

function renderJobs() {
  const filtered = filterJobs();
  const totalPages = Math.max(1, Math.ceil(filtered.length / state.perPage));

  if (state.page > totalPages) {
    state.page = totalPages;
  }

  const start = (state.page - 1) * state.perPage;
  const visibleJobs = filtered.slice(start, start + state.perPage);

  elements.jobGrid.innerHTML = visibleJobs.map(jobCardTemplate).join("");
  elements.emptyState.hidden = filtered.length !== 0;
  elements.jobGrid.hidden = filtered.length === 0;

  elements.resultCount.textContent = `Showing ${visibleJobs.length} of ${filtered.length} jobs`;
  elements.matchCount.textContent = filtered.length;
  elements.pageCount.textContent = `${state.page} / ${totalPages}`;
  elements.heroTotalJobs.textContent = jobs.length;
  updateSavedCount();
  renderPagination(totalPages);
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

function openModal(jobId) {
  const job = jobs.find((item) => item.id === jobId);

  if (!job) {
    return;
  }

  elements.modalCompany.textContent = job.company;
  elements.modalTitle.textContent = job.title;
  elements.modalTags.innerHTML = [job.location, job.category, job.experience, job.salary]
    .map((tag) => `<span class="pill">${tag}</span>`)
    .join("");
  elements.modalDescription.textContent = job.description;
  elements.modalResponsibilities.innerHTML = job.responsibilities
    .map((item) => `<li>${item}</li>`)
    .join("");

  elements.modal.hidden = false;
  document.body.style.overflow = "hidden";
  elements.closeModal.focus();
}

function closeModal() {
  elements.modal.hidden = true;
  document.body.style.overflow = "";
}

function updateSavedCount() {
  const count = state.saved.size;
  elements.savedCount.textContent = count;
  elements.savedCountHero.textContent = count;
}

function toggleSaved(jobId) {
  if (state.saved.has(jobId)) {
    state.saved.delete(jobId);
  } else {
    state.saved.add(jobId);
  }

  localStorage.setItem("savedJobs", JSON.stringify([...state.saved]));
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

function bindEvents() {
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

  elements.jobGrid.addEventListener("click", (event) => {
    const viewButton = event.target.closest("[data-job-id]");
    const saveButton = event.target.closest("[data-save-id]");

    if (viewButton) {
      openModal(Number(viewButton.dataset.jobId));
    }

    if (saveButton) {
      toggleSaved(Number(saveButton.dataset.saveId));
    }
  });

  elements.closeModal.addEventListener("click", closeModal);
  elements.modal.addEventListener("click", (event) => {
    if (event.target === elements.modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.modal.hidden) {
      closeModal();
    }
  });
}

function init() {
  populateFilter(elements.locationFilter, uniqueValues("location"));
  populateFilter(elements.categoryFilter, uniqueValues("category"));
  populateFilter(elements.experienceFilter, uniqueValues("experience"));
  bindEvents();
  renderJobs();
}

init();
