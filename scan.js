const codeElement = document.getElementById("code");
const videoElement = document.getElementById("video");
const startBtn = document.getElementById("startScanBtn");

// Création du lecteur ZXing
const codeReader = new ZXing.BrowserBarcodeReader();

// Fonction pour démarrer le scan
startBtn.addEventListener("click", async () => {
  codeElement.textContent = "En attente du scan...";

  try {
    const selectedDeviceId = await codeReader.listVideoInputDevices()
      .then(videoInputDevices => videoInputDevices[0]?.deviceId || null);

    if (!selectedDeviceId) {
      alert("Pas de caméra détectée !");
      return;
    }

    codeReader.decodeFromVideoDevice(
      selectedDeviceId,
      videoElement,
      (result, err) => {
        if (result) {
          console.log("Code scanné :", result.text);
          codeElement.textContent = result.text;

          // Exemple : envoyer au backend
          /*
          fetch("https://mon-backend.up.railway.app/api/scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: result.text })
          })
          .then(res => res.json())
          .then(data => console.log("Backend response:", data));
          */

          // Stop le scan après un code trouvé
          codeReader.reset();
        }
        if (err && !(err instanceof ZXing.NotFoundException)) {
          console.error(err);
        }
      }
    );
  } catch (e) {
    console.error("Erreur lors du scan :", e);
  }
});
