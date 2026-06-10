export function createJobCard(job, isSaved) {
  return `
    <article class="job-card">
      <div class="job-card-header">
        <div class="company-logo" aria-hidden="true">${job.company.slice(0, 2).toUpperCase()}</div>
        <button class="save-button ${isSaved ? "is-saved" : ""}" type="button" data-save-id="${job.id}" aria-label="${isSaved ? "Remove saved job" : "Save job"}">
          ${isSaved ? "Saved" : "Save"}
        </button>
      </div>
      <div>
        <h3>${job.title}</h3>
        <p class="company-name">${job.company}</p>
      </div>
      <div class="job-type-row">
        <span class="pill is-featured">${job.workMode}</span>
        <span class="pill">${job.category}</span>
        <span class="pill">${job.experience}</span>
      </div>
      <div class="job-meta">
        <span class="pill">${job.location}</span>
      </div>
      <p class="job-description">${job.description}</p>
      <div class="card-actions">
        <span class="salary">${job.salary}</span>
        <button class="view-more-button" type="button" data-job-id="${job.id}">View More</button>
      </div>
    </article>
  `;
}
