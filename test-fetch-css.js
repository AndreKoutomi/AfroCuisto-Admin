const r = fetch("https://afrocuisto-admin.vercel.app").then(r => r.text()).then(html => {
    const match = html.match(/assets\/index-[^\"]+\.css/);
    console.log("css match", match);
    if (match) {
        fetch("https://afrocuisto-admin.vercel.app/" + match[0]).then(r => r.text()).then(css => {
            console.log("CSS length:", css.length);
            console.log("Has Tailwind resets?", css.includes("margin:0"));
            console.log("Has w-[280px]?", css.includes("280px"));
            console.log("Has #f4f7fe?", css.includes("f4f7fe"));
        })
    }
});
