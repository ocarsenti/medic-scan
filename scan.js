const codeElement = document.getElementById("code");
const videoElement = document.getElementById("video");
const startBtn = document.getElementById("startScanBtn");

// Création du lecteur ZXing
const codeReader = new ZXing.BrowserBarcodeReader();

// Fonction pour démarrer le scan
startBtn.addEventListener("click", async () => {
  codeElement.textContent = "En attente du scan...";

  try {
    const videoInputDevices = await codeReader.listVideoInputDevices();

    if (!videoInputDevices.length) {
      alert("Pas de caméra détectée !");
      return;
    }

    // 🔥 PRIORITÉ caméra arrière
    let selectedDevice = videoInputDevices.find(device =>
      device.label.toLowerCase().includes("back") ||
      device.label.toLowerCase().includes("rear")
    );

    // fallback si on ne trouve pas "back"
    if (!selectedDevice) {
      selectedDevice = videoInputDevices[0];
    }

    console.log("Caméra utilisée :", selectedDevice.label);

    codeReader.decodeFromVideoDevice(
      selectedDevice.deviceId,
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
    alert("Impossible d'accéder à la caméra");
  }
});

