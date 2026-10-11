const URL = "https://dashbord-iot.onrender.com/api"; // à remplacer par l'URL Render après déploiement

setInterval(async () => {
  const temperature = Number((20 + Math.random() * 10).toFixed(1));
  await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ temperature }),
  });
  console.log("Envoyé :", temperature);
}, 3001);