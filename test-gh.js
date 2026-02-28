fetch("https://api.github.com/repos/AndreKoutomi/AfroCuisto-Admin/commits/main/status", { headers: { "User-Agent": "NodeJS" } })
    .then(r => r.json())
    .then(console.log);
