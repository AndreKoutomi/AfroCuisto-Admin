fetch("https://afrocuisto-admin.vercel.app")
    .then(r => r.text())
    .then(html => {
        const match = html.match(/assets\/index-[^\"]+\.css/);
        if (match) {
            fetch("https://afrocuisto-admin.vercel.app/" + match[0])
                .then(r => r.text())
                .then(css => {
                    console.log("has bg-[f4f7fe]: ", css.includes("f4f7fe") || css.includes("F4F7FE"));
                    console.log("has shadow-14px:", css.includes("14px_17px_40px_4px") || css.includes("14px 17px"));
                    console.log("has text-2B3674:", css.includes("2B3674") || css.includes("2b3674"));
                    console.log("has w-[280px]:", css.includes("280px"));
                });
        }
    });
