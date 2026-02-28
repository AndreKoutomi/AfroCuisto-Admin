const r = fetch("https://afrocuisto-admin.vercel.app").then(r => r.text()).then(html => {
    const match = html.match(/assets\/index-[^\"]+\.css/);
    console.log("css match", match);
    if (match) {
        fetch("https://afrocuisto-admin.vercel.app/" + match[0]).then(r => r.text()).then(css => {
            console.log("CSS length:", css.length);
            console.log("Has Tailwind resets?", css.includes("margin:0"));
            console.log("Has .w-\\[280px\\]?", css.includes('w-[280px]'));
            console.log("Has .bg-\\[#f4f7fe\\]?", css.includes('bg-[#f4f7fe]') || css.includes('bg-\\[\\#f4f7fe\\]'));
            console.log("Has .text-\\[#A3AED0\\]?", css.includes('text-[#A3AED0]') || css.includes('text-\\[\\#A3AED0\\]'));
            console.log("Has .shadow-\\[14px_17px_40px_4px_rgba\\(112\\,144\\,176\\,0\\.08\\)\\]?", css.includes('shadow-\\[14px_17px_40px_4px_rgba\\(112\\,144\\,176\\,0\\.08\\)\\]') || css.includes('14px 17px 40px 4px rgba(112, 144, 176, 0.08)'));
        })
    }
});
