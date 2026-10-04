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
  /*

  const tagGroups = makeElement("div", "about-tag-groups");
  tagGroups.append(renderTagGroup("Areas of focus", about.focusAreas));
  tagGroups.append(renderTagGroup("Tech Stack", about.techStack));
  container.append(tagGroups);*/
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

function renderSkills(skills, skillLinks) {
  const container = document.querySelector('[data-resume-list="skills"]');
  for (const skill of requiredArray(skills, "skill groups")) {
    const group = makeElement("article", "skill-group");
    group.append(makeElement("h3", "", requiredString(skill.category, "a skill category")));
    const tags = makeElement("div", "focus-tags");
    for (const item of requiredArray(skill.items, skill.category)) {
      const label = requiredString(item, `a ${skill.category} item`);
      const url = skillLinks?.[label];
      tags.append(url
        ? makeSafeLink(label, url, "skill-tag-link", true)
        : makeElement("span", "", label));
    }
    group.append(tags);
    container.append(group);
  }
}

function renderEducation(education, languages) {
  const container = document.querySelector('[data-resume-container="education"]');
  const degree = makeElement("article", "education-group");
  degree.append(makeElement("h3", "", requiredString(education.degree, "a degree")));
  const degreeDetails = makeElement("p", "education-inline-details");
  degreeDetails.append(
    requiredString(education.institution, "an educational institution"),
    " · ",
    requiredString(education.note, "an education note")
  );
  degree.append(degreeDetails);
  container.append(degree);

  const languageGroup = makeElement("article", "education-group");
  languageGroup.append(makeElement("h3", "", "Languages"));

  for (const language of requiredArray(languages, "languages")) {
    const row = makeElement("p", "education-inline-details");
    row.append(
      requiredString(language.name, "a language"),
      " · ",
      requiredString(language.proficiency, "a language proficiency")
    );
    languageGroup.append(row);
  }
  container.append(languageGroup);

  const travelGroup = makeElement("article", "education-group");
  travelGroup.append(makeElement("h3", "", "Travel documents"));
  const travelDocuments = requiredArray(education.travelDocuments, "travel documents")
    .map(documentName => requiredString(documentName, "a travel document"));
  travelGroup.append(makeElement("p", "education-inline-details", travelDocuments.join(" · ")));
  container.append(travelGroup);
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
  renderExperience(info.experience);
  renderSkills(info.skills, info.skillLinks);
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
