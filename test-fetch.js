const r = fetch("https://afrocuisto-admin.vercel.app").then(r => r.text()).then(html => {
    const match = html.match(/assets\/index-[^\"]+\.js/);
    console.log("match", match);
    if (match) {
        fetch("https://afrocuisto-admin.vercel.app/" + match[0]).then(r => r.text()).then(js => {
            console.log("Contains #4318FF?", js.includes("#4318FF"));
            if (js.includes("#4318FF")) {
                console.log("Has specific class 'flex h-screen w-full bg-[#f4f7fe]'?", js.includes("flex h-screen w-full bg-[#f4f7fe]"));
            }
        })
    }
});
