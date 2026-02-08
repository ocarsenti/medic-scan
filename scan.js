const codeElement = document.getElementById("code");
const videoElement = document.getElementById("video");
const startBtn = document.getElementById("startScanBtn");

const codeReader = new ZXing.BrowserBarcodeReader();

startBtn.addEventListener("click", async () => {
  codeElement.textContent = "En attente du scan...";

  try {
    // 🔥 FORCER caméra arrière
    const constraints = {
      video: {
        facingMode: { exact: "environment" }
      }
    };

    await codeReader.decodeFromConstraints(
      constraints,
      videoElement,
      (result, err) => {
        if (result) {
          console.log("Code scanné :", result.text);
          codeElement.textContent = result.text;

          // Stop le scan
          codeReader.reset();
        }

        if (err && !(err instanceof ZXing.NotFoundException)) {
          console.error(err);
        }
      }
    );
  } catch (e) {
    console.error("Erreur caméra arrière :", e);

    // 🔁 Fallback si facingMode exact échoue
    try {
      await codeReader.decodeFromConstraints(
        { video: { facingMode: "environment" } },
        videoElement,
        (result, err) => {
          if (result) {
            console.log("Code scanné :", result.text);
            codeElement.textContent = result.text;
            codeReader.reset();
          }
        }
      );
    } catch (fallbackErr) {
      alert("Impossible d’accéder à la caméra arrière");
      console.error(fallbackErr);
    }
  }
});


