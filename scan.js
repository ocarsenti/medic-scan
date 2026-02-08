const startBtn = document.getElementById("startScanBtn");
const video = document.getElementById("video");
const codeSpan = document.getElementById("code");

// Création d'une zone de logs sur la page
let logDiv = document.getElementById("log");
if (!logDiv) {
  logDiv = document.createElement("div");
  logDiv.id = "log";
  logDiv.style.whiteSpace = "pre-wrap";
  logDiv.style.marginTop = "20px";
  logDiv.style.fontSize = "0.9em";
  logDiv.style.color = "darkred";
  document.body.appendChild(logDiv);
}

function logToScreen(msg) {
  logDiv.textContent += msg + "\n";
}

// Rediriger console.log et console.error vers la page
console.log = (msg) => logToScreen("LOG: " + msg);
console.error = (msg) => logToScreen("ERROR: " + msg);

const hints = new Map();
hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [
  ZXing.BarcodeFormat.EAN_13,
  ZXing.BarcodeFormat.EAN_8,
  ZXing.BarcodeFormat.DATA_MATRIX  // si tu veux essayer fallback DataMatrix
]);

const codeReader = new ZXing.BrowserMultiFormatReader(hints);
let stream = null;

startBtn.addEventListener("click", async () => {
  codeSpan.textContent = "En attente du scan...";
  logToScreen("Scan démarré...");

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    });

    video.srcObject = stream;
    await video.play();
    logToScreen("Flux vidéo ouvert");

    codeReader.decodeFromVideoElement(video, (result, err) => {
      if (result) {
        logToScreen("Code détecté : " + result.text);
        codeSpan.textContent = result.text;
        stopScan();
      }

      if (err && !(err instanceof ZXing.NotFoundException)) {
        logToScreen("ZXing erreur : " + err);
      }
    });

  } catch (e) {
    logToScreen("Erreur caméra : " + e);
    alert("Impossible d’accéder à la caméra arrière");
  }
});

function stopScan() {
  codeReader.reset();
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  logToScreen("Scan arrêté, flux vidéo fermé");
}
