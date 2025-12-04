/* ============================================================
   EyeLike – Pupila Tracking (2025)
   Reimplementado por ChatGPT para rodar off-line e sem CORS
   API compatível com EyeLike original:

   EyeLike.start(videoElement, callback).then(stopFn)

   callback({ x: 0..1, y: 0..1 })
   ============================================================ */

const EyeLike = (function () {

    function start(video, callback) {
        return new Promise(async (resolve, reject) => {

            // 1. Solicitar câmera
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user" }
                });
                video.srcObject = stream;
                await video.play();
            } catch (e) {
                console.error("Erro ao acessar câmera:", e);
                alert("Erro ao acessar câmera");
                reject(e);
                return;
            }

            // 2. Criar canvas
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            function process() {
                const w = video.videoWidth;
                const h = video.videoHeight;

                if (!w || !h) {
                    requestAnimationFrame(process);
                    return;
                }

                canvas.width = w;
                canvas.height = h;

                ctx.drawImage(video, 0, 0, w, h);

                // pegar pixels
                const frame = ctx.getImageData(0, 0, w, h);
                const data = frame.data;

                // 3. Converter para grayscale
                const gray = new Uint8Array(w * h);
                for (let i = 0; i < w * h; i++) {
                    const r = data[i * 4];
                    const g = data[i * 4 + 1];
                    const b = data[i * 4 + 2];
                    gray[i] = (r + g + b) / 3;
                }

                // 4. Detectar ponto mais escuro (pupila)
                let minVal = 255;
                let minX = 0, minY = 0;

                for (let y = 0; y < h; y++) {
                    for (let x = 0; x < w; x++) {
                        const px = gray[y * w + x];
                        if (px < minVal) {
                            minVal = px;
                            minX = x;
                            minY = y;
                        }
                    }
                }

                // 5. Normalizar coordenadas
                const nx = minX / w;
                const ny = minY / h;

                callback({ x: nx, y: ny });

                requestAnimationFrame(process);
            }

            requestAnimationFrame(process);

            // função stop()
            function stop() {
                const tracks = video.srcObject.getTracks();
                tracks.forEach(t => t.stop());
            }

            resolve(stop);
        });
    }

    return { start };
})();
