globalThis.FormaDblp = (() => {
    const firstYear = 2020;
    const profilePrefix = "https://dblp.org/pid/";
    const recordPrefix = "https://dblp.org/rec/";

    function profileUrl(bib) {
        const pattern = /^https:\/\/dblp\.org\/pid\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+(?:\.(?:html|bib|xml))?$/;
        return pattern.test(bib) ? bib.replace(/\.(?:html|bib|xml)$/, "") : null;
    }

    async function fetchBibliographies(profiles, { timeout = 12000 } = {}) {
        if (profiles.some((profile) => profileUrl(profile) !== profile)) {
            throw new Error("Invalid DBLP profile URL");
        }

        const values = profiles.map((profile) => `<${profile}>`).join(" ");
        const query = `
    PREFIX dblp: <https://dblp.org/rdf/schema#>
    SELECT DISTINCT ?person ?record ?title ?year ?venue ?creator ?position WHERE {
      VALUES ?person { ${values} }
      ?record dblp:createdBy ?person ;
              dblp:title ?title ;
              dblp:yearOfPublication ?year .
      FILTER (STR(?year) >= "${firstYear}")
      OPTIONAL { ?record dblp:publishedInStream/dblp:primaryStreamTitle ?venue . }
      OPTIONAL {
        ?record dblp:hasSignature ?signature .
        ?signature dblp:signatureDblpName ?creator ;
                   dblp:signatureOrdinal ?position .
      }
    }
    ORDER BY ?person DESC(?year) ?record ?position ?venue ?creator`;

        const url = new URL("https://sparql.dblp.org/sparql");
        url.searchParams.set("query", query);
        const response = await fetch(url, {
            headers: { Accept: "application/sparql-results+json" },
            signal: AbortSignal.timeout(timeout)
        });
        if (!response.ok) throw new Error(`DBLP HTTP ${response.status}`);

        const result = await response.json();
        if (!Array.isArray(result.results?.bindings) || result.resultsize > result.results.bindings.length) {
            throw new Error("DBLP returned incomplete publication data");
        }

        const byPerson = new Map(profiles.map((profile) => [profile, new Map()]));
        for (const row of result.results.bindings) {
            const records = byPerson.get(row.person?.value);
            const link = row.record?.value;
            const title = row.title?.value;
            const year = Number(row.year?.value);
            if (!records || !link?.startsWith(recordPrefix) || !title || !Number.isInteger(year) || year < firstYear) continue;

            const key = link.slice(recordPrefix.length);
            if (!records.has(key)) {
                records.set(key, { key, title, year, venue: row.venue?.value || "", creators: new Map() });
            }
            if (row.creator && row.position) {
                records.get(key).creators.set(Number(row.position.value), row.creator.value.replace(/ \d{4}$/, ""));
            }
        }

        return Object.fromEntries([...byPerson].map(([profile, records]) => [
            profile.slice(profilePrefix.length),
            [...records.values()].map(({ creators, ...record }) => ({
                ...record,
                creators: [...creators].sort(([a], [b]) => a - b).map(([, name]) => name)
            })).sort((a, b) => b.year - a.year || a.title.localeCompare(b.title, "en"))
        ]));
    }
    return { fetchBibliographies, profilePrefix, profileUrl, recordPrefix };
})();
