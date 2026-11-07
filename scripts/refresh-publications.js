(() => {
    const { fetchBibliographies, profileUrl } = FormaDblp;
    const button = document.getElementById("refresh");
    const download = document.getElementById("download");
    const status = document.getElementById("status");

    button.addEventListener("click", async () => {
        button.disabled = true;
        if (download.href) URL.revokeObjectURL(download.href);
        download.removeAttribute("href");
        download.hidden = true;
        status.textContent = "Fetching publications from DBLP…";

        try {
            const people = await FormaData.get("people");
            const profiles = [...new Set(people.map((person) => profileUrl(person.bib)).filter(Boolean))];
            if (!profiles.length || people.some((person) => person.bib && !profileUrl(person.bib))) {
                throw new Error("Check the DBLP profile URLs in data/people.js.");
            }

            const entries = await fetchBibliographies(profiles, { timeout: 40000 });
            const count = Object.values(entries).reduce((total, records) => total + records.length, 0);
            if (!count) throw new Error("DBLP returned no records for the configured profiles.");

            const snapshot = { updated: new Date().toISOString().slice(0, 10), entries };
            const source = "// Saved DBLP records. See the README to refresh this file.\n"
                + `FormaData.register("publications", ${JSON.stringify(snapshot)});\n`;
            download.href = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
            download.hidden = false;
            status.textContent = `${count} entries for ${profiles.length} profiles. The snapshot is ready to download.`;
        } catch (error) {
            status.textContent = `Could not refresh the snapshot. ${error.message}`;
        } finally {
            button.disabled = false;
        }
    });
    button.disabled = false;
})();
