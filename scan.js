const startBtn = document.getElementById("startScanBtn");
const video = document.getElementById("video");
const codeSpan = document.getElementById("code");

const hints = new Map();
hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [
  ZXing.BarcodeFormat.DATA_MATRIX
]);

const codeReader = new ZXing.BrowserMultiFormatReader(hints);

let stream = null;

startBtn.addEventListener("click", async () => {
  codeSpan.textContent = "En attente du scan...";

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });

    video.srcObject = stream;
    await video.play();

    codeReader.decodeFromVideoElement(video, (result, err) => {
      if (result) {
        console.log("DataMatrix détecté :", result.text);
        codeSpan.textContent = result.text;

        stopScan();
      }

      if (err && !(err instanceof ZXing.NotFoundException)) {
        console.error(err);
      }
    });

  } catch (e) {
    console.error(e);
    alert("Impossible d’accéder à la caméra");
  }
});

function stopScan() {
  codeReader.reset();
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
}
