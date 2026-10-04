const resumeDataUrl = new URL("resume-info.json", document.currentScript.src);

function requiredString(value, description) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Resume data is missing ${description}.`);
  }
  return value;
}

function requiredArray(value, description) {
  if (!Array.isArray(value)) {
    throw new Error(`Resume data must provide ${description} as an array.`);
  }
  return value;
}

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function makeSafeLink(label, href, className, external = false) {
  const safeHref = requiredString(href, `a URL for "${label}"`);
  const parsedUrl = new URL(safeHref, window.location.href);
  const isSameOriginWebUrl =
    ["http:", "https:"].includes(parsedUrl.protocol) &&
    parsedUrl.origin === window.location.origin;
  const allowedProtocols = external ? ["https:"] : ["mailto:", "tel:"];

  if (external ? !allowedProtocols.includes(parsedUrl.protocol) : !isSameOriginWebUrl && !allowedProtocols.includes(parsedUrl.protocol)) {
    throw new Error(`Resume data contains an unsupported URL for "${label}".`);
  }

  const link = makeElement("a", className, label);
  link.href = safeHref;
  if (external) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    const arrow = makeElement("span", "external-link-arrow", "↗");
    arrow.setAttribute("aria-hidden", "true");
    link.append(" ", arrow);
  }
  return link;
}

function renderTagGroup(title, items) {
  const group = makeElement("div", "about-tag-group");
  group.append(makeElement("h3", "", title));
  const tags = makeElement("div", "focus-tags");

  for (const item of requiredArray(items, title)) {
    tags.append(makeElement("span", "", requiredString(item, `a ${title} item`)));
  }

  group.append(tags);
  return group;
}

function renderAbout(about) {
  const container = document.querySelector('[data-resume-container="about"]');
  const paragraphs = requiredArray(about.paragraphs, "about paragraphs");

  for (const text of paragraphs) {
    container.append(makeElement("p", "", requiredString(text, "an about paragraph")));
  }

  container.append(makeElement("p", "", "Core areas:"));
  const coreAreas = makeElement("ul", "core-areas");
  for (const item of requiredArray(about.coreAreas, "core areas")) {
    coreAreas.append(makeElement("li", "", requiredString(item, "a core area")));
  }
  container.append(coreAreas);

  const tagGroups = makeElement("div", "about-tag-groups");
  tagGroups.append(renderTagGroup("Areas of focus", about.focusAreas));
  tagGroups.append(renderTagGroup("Tech Stack", about.techStack));
  container.append(tagGroups);
}

function renderProfileLinks(profile) {
  const container = document.querySelector('[data-resume-list="profileLinks"]');
  const resumeLink = makeSafeLink("Download Resume", profile.resumeFile);
  resumeLink.download = "";
  container.replaceChildren(
    makeSafeLink(profile.email, `mailto:${requiredString(profile.email, "an email address")}`),
    makeSafeLink(profile.phoneDisplay, `tel:${requiredString(profile.phone, "a phone number")}`),
    makeSafeLink("LinkedIn", profile.linkedin, "", true),
    makeSafeLink("GitHub", profile.github, "", true),
    resumeLink
  );
}

function renderWhatIDo(items) {
  const container = document.querySelector('[data-resume-list="whatIDo.items"]');
  requiredArray(items, "What I do items").forEach((item, index) => {
    const card = makeElement("article", "what-i-do-card");
    const number = makeElement("span", "what-i-do-number", String(index + 1).padStart(2, "0"));
    number.setAttribute("aria-hidden", "true");
    card.append(
      number,
      makeElement("h3", "", requiredString(item.title, "a service title")),
      makeElement("p", "", requiredString(item.description, "a service description"))
    );
    container.append(card);
  });
}

function renderDate(date) {
  const label = requiredString(date.label, "a date label");
  if (!date.datetime) {
    return document.createTextNode(label);
  }
  const time = makeElement("time", "", label);
  time.dateTime = requiredString(date.datetime, "a date value");
  return time;
}

function renderExperience(experience) {
  const timeline = document.querySelector('[data-resume-list="experience"]');

  for (const job of requiredArray(experience, "experience")) {
    const article = makeElement("article", "job-card");
    const meta = makeElement("div", "job-meta");
    const date = makeElement("p", "job-date");
    date.append(renderDate(job.start), " — ", renderDate(job.end));
    meta.append(date);

    const location = makeElement("p", "job-location");
    if (job.locationPrefix) {
      location.append(document.createTextNode(job.locationPrefix));
    }
    if (job.client) {
      location.append(makeSafeLink(job.client, job.clientUrl, "", true));
      if (job.location) {
        location.append(` · ${job.location}`);
      }
    } else {
      location.append(requiredString(job.location, "a job location"));
    }
    meta.append(location);

    const details = makeElement("div", "job-details");
    const title = makeElement("h3");
    const company = makeElement("span", "job-company");
    company.append(document.createTextNode("@ "), makeSafeLink(job.company, job.companyUrl, "", true));
    title.append(
      document.createTextNode(`${requiredString(job.role, "a job title")} `),
      company
    );
    details.append(title);

    const highlights = makeElement("ul");
    for (const highlight of requiredArray(job.highlights, `highlights for ${job.company}`)) {
      const item = makeElement("li");
      item.append(makeElement("strong", "", `${requiredString(highlight.label, "a highlight title")}: `));
      item.append(document.createTextNode(requiredString(highlight.text, "highlight details")));
      highlights.append(item);
    }
    details.append(highlights);
    details.append(makeElement("p", "tech-list", requiredArray(job.technologies, "technologies").join(" · ")));
    article.append(meta, details);
    timeline.append(article);
  }
}

function renderSkills(skills) {
  const container = document.querySelector('[data-resume-list="skills"]');
  for (const skill of requiredArray(skills, "skill groups")) {
    const group = makeElement("article", "skill-group");
    group.append(
      makeElement("h3", "", requiredString(skill.category, "a skill category")),
      makeElement("p", "", requiredArray(skill.items, skill.category).join(" · "))
    );
    container.append(group);
  }
}

function renderEducation(education, languages) {
  const container = document.querySelector('[data-resume-container="education"]');
  container.append(
    makeElement("p", "card-label", "Education"),
    makeElement("h3", "", requiredString(education.degree, "a degree")),
    makeElement("p", "", requiredString(education.institution, "an educational institution")),
    makeElement("p", "education-note", requiredString(education.note, "an education note")),
    makeElement("div", "card-rule")
  );
  container.append(makeElement("p", "card-label", "Languages"));

  for (const language of requiredArray(languages, "languages")) {
    const row = makeElement("p", "language-row");
    row.append(
      makeElement("span", "", requiredString(language.name, "a language")),
      makeElement("span", "", requiredString(language.proficiency, "a language proficiency"))
    );
    container.append(row);
  }
}

function applyResumeInfo(info) {
  const profile = info.profile;
  requiredString(profile.name, "a name");
  document.title = `${profile.name} | Senior Backend Engineer`;
  document.querySelector('meta[name="description"]').content = profile.summary;

  for (const element of document.querySelectorAll("[data-resume]")) {
    const value = element.dataset.resume.split(".").reduce((current, key) => current?.[key], info);
    element.textContent = requiredString(value, element.dataset.resume);
  }

  renderProfileLinks(profile);
  renderAbout(info.about);
  renderWhatIDo(info.whatIDo.items);
  renderExperience(info.experience);
  renderSkills(info.skills);
  renderEducation(info.education, info.languages);

  document.querySelector(".brand").setAttribute("aria-label", `${profile.name} · home`);
  document.querySelector(".contact-links").setAttribute("aria-label", "Contact links");
  document.querySelector(".resume-load-status").hidden = true;
  document.querySelector("#main").setAttribute("aria-busy", "false");
}

async function loadResumeInfo() {
  try {
    const response = await fetch(resumeDataUrl);
    if (!response.ok) {
      throw new Error(`Resume data request failed (${response.status} ${response.statusText}).`);
    }
    applyResumeInfo(await response.json());
  } catch (error) {
    console.error("Unable to load resume-info.json.", error);
    const errorMessage = document.querySelector(".resume-load-error");
    errorMessage.textContent = "Resume content could not be loaded. Please refresh the page or try again later.";
    errorMessage.hidden = false;
    document.querySelector(".resume-load-status").hidden = true;
    document.querySelector("#main").setAttribute("aria-busy", "false");
  }
}

loadResumeInfo();
