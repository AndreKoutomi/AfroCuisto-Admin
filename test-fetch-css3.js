const r = fetch("https://afrocuisto-admin.vercel.app").then(r => r.text()).then(html => {
    const match = html.match(/assets\/index-[^\"]+\.css/);
    if (match) {
        fetch("https://afrocuisto-admin.vercel.app/" + match[0]).then(r => r.text()).then(css => {
            console.log(css.substring(0, 1000));
            console.log("length: ", css.length);
        })
    }
});
