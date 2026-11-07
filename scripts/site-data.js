globalThis.FormaData = (() => {
    const isLocal = location.protocol === "file:";
    const directory = new URL("../data/", document.currentScript.src);
    const collections = new Map();
    const requests = new Map();

    function register(name, data) {
        collections.set(name, data);
    }

    function get(name) {
        if (collections.has(name)) return Promise.resolve(collections.get(name));
        if (!requests.has(name)) {
            const request = new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = new URL(name + ".js", directory).href;
                script.onload = () => {
                    if (collections.has(name)) {
                        resolve(collections.get(name));
                    } else {
                        reject(new Error(`Missing data in ${name}.js`));
                    }
                };
                script.onerror = () => reject(new Error(`Could not load ${name}.js`));
                document.head.append(script);
            });
            requests.set(name, request);
        }
        return requests.get(name);
    }

    return { get, isLocal, register };
})();
