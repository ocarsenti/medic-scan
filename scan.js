const startBtn = document.getElementById("startScanBtn");
const video = document.getElementById("video");
const codeSpan = document.getElementById("code");

// Hint pour ZXing : tu peux ajouter DATA_MATRIX si tu veux fallback plus tard
const hints = new Map();
hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [
  ZXing.BarcodeFormat.EAN_13,
  ZXing.BarcodeFormat.EAN_8
]);

const codeReader = new ZXing.BrowserMultiFormatReader(hints);
let stream = null;

startBtn.addEventListener("click", async () => {
  codeSpan.textContent = "En attente du scan...";

  try {
    // 🔥 Résolution maximale + caméra arrière
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1920 },   // résolution plus haute
        height: { ideal: 1080 },  // résolution plus haute
        // advanced: [{ zoom: 1 }]  // optionnel, certaines caméras le supportent
      }
    });

    video.srcObject = stream;
    await video.play();

    codeReader.decodeFromVideoElement(video, (result, err) => {
      if (result) {
        console.log("Code détecté :", result.text);
        codeSpan.textContent = result.text;
        stopScan();
      }

      if (err && !(err instanceof ZXing.NotFoundException)) {
        console.error(err);
      }
    });

  } catch (e) {
    console.error("Erreur caméra :", e);
    alert("Impossible d’accéder à la caméra arrière");
  }
});

function stopScan() {
  codeReader.reset();
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
}

