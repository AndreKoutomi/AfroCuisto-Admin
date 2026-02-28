fetch("https://afrocuisto-admin.vercel.app", { method: 'HEAD' })
    .then(r => {
        console.log("Date:", r.headers.get("date"));
        console.log("Last-Modified:", r.headers.get("last-modified"));
        console.log("Etag:", r.headers.get("etag"));
        console.log("X-Vercel-Id:", r.headers.get("x-vercel-id"));
    });
