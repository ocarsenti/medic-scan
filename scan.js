const startBtn = document.getElementById("startScanBtn");
const video = document.getElementById("video");
const codeSpan = document.getElementById("code");

const codeReader = new ZXing.BrowserBarcodeReader();

let stream = null;

startBtn.addEventListener("click", async () => {
  codeSpan.textContent = "En attente du scan...";

  try {
    // 🔥 On prend le contrôle total de la caméra
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" }
      }
    });

    video.srcObject = stream;
    await video.play();

    // 🔍 ZXing lit directement la vidéo
    codeReader.decodeFromVideoElement(video, (result, err) => {
      if (result) {
        console.log("Code scanné :", result.text);
        codeSpan.textContent = result.text;

        stopScan();
      }

      if (err && !(err instanceof ZXing.NotFoundException)) {
        console.error(err);
      }
    });

  } catch (e) {
    console.error(e);
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



