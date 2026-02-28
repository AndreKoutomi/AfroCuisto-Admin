fetch("https://afrocuisto-admin.vercel.app")
    .then(r => r.text())
    .then(html => {
        const match = html.match(/assets\/index-[^\"]+\.css/);
        if (match) {
            fetch("https://afrocuisto-admin.vercel.app/" + match[0])
                .then(r => r.text())
                .then(css => {
                    console.log("has .h-2: ", css.includes(".h-2{"));
                    console.log("has .w-14: ", css.includes(".w-14{"));
                    console.log("has .w-full: ", css.includes(".w-full"));
                    console.log("has .flex: ", css.includes(".flex"));
                    console.log("has .rounded-\\[20px\\]: ", css.includes(".rounded-\\[20px\\]"));
                    console.log("has .p-\\[24px\\]: ", css.includes(".p-\\[24px\\]"));
                });
        }
    });
