export function createModalController(elements, jobs) {
  function open(jobId) {
    const job = jobs.find((item) => item.id === jobId);

    if (!job) {
      return;
    }

    elements.modalCompany.textContent = job.company;
    elements.modalTitle.textContent = job.title;
    elements.modalTags.innerHTML = [
      job.location,
      job.category,
      job.experience,
      job.workMode,
      job.salary
    ]
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

  function close() {
    elements.modal.hidden = true;
    document.body.style.overflow = "";
  }

  elements.closeModal.addEventListener("click", close);
  elements.modal.addEventListener("click", (event) => {
    if (event.target === elements.modal) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.modal.hidden) {
      close();
    }
  });

  return { open, close };
}
