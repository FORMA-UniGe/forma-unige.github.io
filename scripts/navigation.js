const menu = document.getElementById("site-menu");
const menuToggle = document.querySelector(".menu-toggle");
const compactNavigation = window.matchMedia("(max-width: 55rem)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setMenu(open) {
    menu.hidden = compactNavigation.matches && !open;
    menuToggle.setAttribute("aria-expanded", String(open));
}

function syncNavigation() {
    menuToggle.hidden = !compactNavigation.matches;
    setMenu(false);
}

menuToggle.addEventListener("click", () => setMenu(menu.hidden));
menu.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!compactNavigation.matches || !link) return;

    if (link.pathname === location.pathname && link.hash) {
        const section = document.getElementById(link.hash.slice(1));
        if (section) {
            section.tabIndex = -1;
            section.focus({ preventScroll: true });
        }
    }
    setMenu(false);
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuToggle.focus();
    }
});
compactNavigation.addEventListener("change", syncNavigation);
syncNavigation();

function enableCollectionFilter(collection) {
    const filter = document.querySelector(`[data-filter-for="${collection.id}"]`);
    const items = Array.from(collection.children).filter((item) => item.matches("article, details"));
    if (!filter || !items.length) return;

    const search = filter.querySelector("input");
    const status = filter.querySelector("[role=status]");
    const normalize = (text) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
    const searchable = items.map((item) => normalize(item.querySelector("summary")?.textContent ?? item.textContent));

    function update() {
        const terms = normalize(search.value).trim().split(/\s+/);
        let count = 0;
        items.forEach((item, index) => {
            item.hidden = !terms.every((term) => searchable[index].includes(term));
            if (!item.hidden) count++;
        });
        status.textContent = count === 0 ? "No results" : `${count} ${count === 1 ? filter.dataset.singular : filter.dataset.plural}`;
    }

    search.addEventListener("input", update);
    filter.hidden = false;
    update();
}

if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const reveal = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("in-view");
            reveal.unobserve(entry.target);
        }
    }, { threshold: 0.18 });
    document.querySelectorAll("[data-reveal]").forEach((element) => reveal.observe(element));
}
