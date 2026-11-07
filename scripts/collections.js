const collections = {
    news: { heading: "News", className: "news-entry", details: [["", "content"]] },
    seminars: { heading: "Seminars", className: "seminar-entry", details: [["Abstract", "abstract"], ["Bio", "bio"]] },
    courses: { heading: "Courses", className: "course-entry", details: [
        ["Abstract", "abstract"], ["Prerequisites", "requirements"],
        ["Target students", "target"], ["Contact email", "email"]
    ] },
    people: { heading: "People" }
};

function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
}

function entryPicture(item) {
    return `<img class="entry-picture" src="${escapeHtml(item.image)}" alt="" loading="lazy" decoding="async">`;
}

function profile(person) {
    const name = escapeHtml(`${person.name} ${person.surname}`);
    const formaLogo = "./images/forma_logo.png";
    const image = person.image && person.image !== "./images/people/default.jpg" ? person.image : formaLogo;
    const logoClass = image === formaLogo ? ' class="person-logo"' : "";
    return `<article class="person">
        <img${logoClass} src="${escapeHtml(image)}" alt="" loading="lazy" decoding="async">
        <div>
            <h3><a href="${escapeHtml(person.url)}" target="_blank" rel="noopener">${name}</a></h3>
            <p>${escapeHtml(person.role)}</p>
            <p>${escapeHtml(person.affiliation)}</p>
        </div>
    </article>`;
}

const seminarDate = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeZone: "UTC"
});

function entryBody(kind, item, title) {
    if (kind === "news") {
        const arrow = '<span class="entry-arrow" aria-hidden="true">↗</span>';
        return `${entryPicture(item)}
            <div class="entry-copy">${title}<p class="entry-meta">${escapeHtml(item.abstract)}</p></div>${arrow}`;
    }
    if (kind === "seminars") {
        const slides = item.slides ? `<a class="entry-slides" href="${escapeHtml(item.slides)}">Slides</a>` : "";
        const date = new Date(item.date);
        const dateLabel = Number.isNaN(date.getTime()) ? item.date : seminarDate.format(date);
        const time = item.time ? `<time datetime="${escapeHtml(item.time)}">${escapeHtml(item.time)}</time>` : "";
        return `${entryPicture(item)}
            <div class="entry-copy">
                ${title}
                <p>${escapeHtml(item.speaker)}</p>
                <p class="entry-meta">${escapeHtml(item.affiliation)}</p>
                ${slides}
            </div>
            <div class="seminar-schedule">
                <time class="seminar-date" datetime="${escapeHtml(item.date)}">${escapeHtml(dateLabel)}</time>
                ${time}
                <p class="entry-meta">${escapeHtml(item.where)}</p>
            </div>`;
    }
    return `${entryPicture(item)}
        <div class="course-copy">
            <p class="course-type">${escapeHtml(item.type)}</p>
            ${title}
            <p>${escapeHtml(item.teacher)}</p>
            <p class="entry-meta">${escapeHtml(item.department)}</p>
        </div>`;
}

function modal(id, item, fields) {
    // Descriptions are site-authored HTML and may contain formatting and links.
    const details = fields.map(([heading, key]) =>
        `<div class="detail">${heading ? `<h3>${heading}</h3>` : ""}${item[key] ?? ""}</div>`
    ).join("");
    return `<dialog id="${id}" aria-labelledby="${id}-title">
        <div class="dialog-header">
            <h2 id="${id}-title">${escapeHtml(item.title)}</h2>
            <form method="dialog">
                <button type="submit" class="dialog-close" aria-label="Close" autofocus>×</button>
            </form>
        </div>
        <div class="dialog-body">${details}</div>
    </dialog>`;
}

function chooseEntries(entries, kind, limit) {
    if (kind === "courses") {
        entries = entries.slice();
        for (let i = 0; i < (limit || entries.length) && i < entries.length; i++) {
            const picked = i + Math.floor(Math.random() * (entries.length - i));
            [entries[i], entries[picked]] = [entries[picked], entries[i]];
        }
    }
    return limit ? entries.slice(0, limit) : entries;
}

async function loadCollection(container) {
    const kind = container.dataset.collection;
    const definition = collections[kind];
    container.setAttribute("aria-busy", "true");
    try {
        const entries = chooseEntries(await FormaData.get(kind), kind, Number(container.dataset.limit));

        if (!entries.length) {
            container.textContent = kind === "news" ? "Nothing new to report." : `No ${kind} listed.`;
        } else if (kind === "people") {
            container.innerHTML = entries.map(profile).join("");
        } else {
            const dialogs = [];
            container.innerHTML = entries.map((item, index) => {
                const id = `${kind}-details-${index}`;
                const title = `<h3><button type="button" class="entry-title" data-dialog="${id}" aria-haspopup="dialog">${escapeHtml(item.title)}</button></h3>`;
                dialogs.push(modal(id, item, definition.details));
                return `<article class="entry ${definition.className}">${entryBody(kind, item, title)}</article>`;
            }).join("");
            document.getElementById("modals").insertAdjacentHTML("beforeend", dialogs.join(""));
        }
    } catch (error) {
        container.textContent = `${definition.heading} could not be loaded. Please reload the page to try again.`;
        console.error(error);
    } finally {
        container.removeAttribute("aria-busy");
        enableCollectionFilter(container);
    }
}

document.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-dialog]");
    if (button) document.getElementById(button.dataset.dialog).showModal();
});

document.querySelectorAll("[data-collection]").forEach(loadCollection);
