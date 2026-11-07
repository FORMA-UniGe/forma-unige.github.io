(() => {
    const { fetchBibliographies, profilePrefix, profileUrl, recordPrefix } = FormaDblp;

    const directory = document.getElementById("publications");
    const snapshotRequest = FormaData.get("publications").catch(() => null);

    function element(tag, text, className) {
        const node = document.createElement(tag);
        if (text) node.textContent = text;
        if (className) node.className = className;
        return node;
    }

    function publicationList(records) {
        const fragment = document.createDocumentFragment();
        let currentYear;
        let list;
        for (const record of records) {
            if (currentYear !== record.year) {
                currentYear = record.year;
                const section = element("section", "", "publication-year");
                list = element("ul");
                section.append(element("h2", String(currentYear)), list);
                fragment.append(section);
            }

            const item = element("li");
            const link = element("a", record.title, "publication-title");
            link.href = recordPrefix + record.key;
            item.append(link);
            const creators = record.creators.join(", ");
            if (creators) item.append(element("p", creators, "publication-metadata"));
            if (record.venue) item.append(element("p", record.venue, "publication-metadata"));
            list.append(item);
        }
        if (!records.length) fragment.append(element("p", "No publications from 2020 onwards are listed in DBLP.", "load-note"));
        return fragment;
    }

    function authorEntry(person, profile) {
        const id = profile.slice(profilePrefix.length);
        const author = element("details", "", "author");
        author.setAttribute("name", "dblp-author");
        const summary = element("summary", `${person.name} ${person.surname}`);
        const icon = element("span", "", "summary-icon");
        icon.setAttribute("aria-hidden", "true");
        summary.append(icon);
        const body = element("div", "", "author-body");
        const actions = element("p", "", "author-actions");
        const link = element("a", "Full bibliography on DBLP ↗");
        link.href = profile + ".html";
        actions.append(link);
        const status = element("p", "", "load-note");
        status.setAttribute("role", "status");
        const bibliography = element("div");
        body.append(actions, status, bibliography);
        author.append(summary, body);

        let pending = false;
        let loaded = false;
        author.addEventListener("toggle", async () => {
            if (!author.open || pending || loaded) return;
            pending = true;
            status.textContent = FormaData.isLocal ? "Loading saved DBLP results…" : "Loading publications from DBLP…";

            const live = FormaData.isLocal ? null : fetchBibliographies([profile]).catch(() => null);
            const snapshot = await snapshotRequest;
            const saved = snapshot?.entries?.[id];
            if (Array.isArray(saved)) {
                bibliography.replaceChildren(publicationList(saved));
            }

            if (FormaData.isLocal) {
                status.textContent = Array.isArray(saved)
                    ? `Saved DBLP results · ${snapshot.updated}`
                    : "No saved DBLP results for this author. Use the full bibliography link when online.";
                loaded = true;
                pending = false;
                return;
            }

            const fresh = await live;
            if (fresh) {
                bibliography.replaceChildren(publicationList(fresh[id]));
                status.textContent = "";
                loaded = true;
            } else {
                status.textContent = Array.isArray(saved)
                    ? `Live DBLP data is temporarily unavailable. Showing the saved DBLP results from ${snapshot.updated}.`
                    : "DBLP is temporarily unavailable. Open the full bibliography on DBLP or reopen this section to try again.";
            }
            pending = false;
        });
        return author;
    }

    async function showAuthors() {
        try {
            const people = await FormaData.get("people");
            const authors = people.flatMap((person) => {
                const profile = profileUrl(person.bib);
                return profile ? [authorEntry(person, profile)] : [];
            });
            directory.replaceChildren(...authors);
            if (!authors.length) directory.append(element("p", "No DBLP profiles are listed.", "load-note"));
        } catch (error) {
            directory.textContent = "The author list could not be loaded. Please reload the page to try again.";
            console.error(error);
        } finally {
            directory.removeAttribute("aria-busy");
            enableCollectionFilter(directory);
        }
    }
    showAuthors();
})();
