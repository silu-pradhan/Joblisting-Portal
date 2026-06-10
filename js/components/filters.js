export function getUniqueValues(jobs, key) {
  return [...new Set(jobs.map((job) => job[key]))].sort();
}

export function populateFilter(select, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

export function filterJobs(jobs, state) {
  const keyword = state.keyword.trim().toLowerCase();

  return jobs.filter((job) => {
    const searchableText = [
      job.title,
      job.company,
      job.category,
      job.location,
      job.description,
      job.workMode
    ]
      .join(" ")
      .toLowerCase();

    const matchesKeyword = !keyword || searchableText.includes(keyword);
    const matchesLocation = !state.location || job.location === state.location;
    const matchesCategory = !state.category || job.category === state.category;
    const matchesExperience = !state.experience || job.experience === state.experience;

    return matchesKeyword && matchesLocation && matchesCategory && matchesExperience;
  });
}
