"use client";
import jsQR from "jsqr";
import { useEffect, useRef, useState } from "react";

// カメラでQRコードを読み取る。読み取れたら onResult を呼ぶ（親が外せばカメラは停止）。
export default function Scanner({ onResult }: { onResult: (text: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cb = useRef(onResult);
  cb.current = onResult;
  const [active, setActive] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!active) return;
    let stopped = false;
    let raf = 0;
    let stream: MediaStream | null = null;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
        if (stopped) return stream.getTracks().forEach((t) => t.stop());
        const v = videoRef.current!;
        v.srcObject = stream;
        await v.play();
        const tick = () => {
          if (stopped) return;
          if (ctx && v.readyState >= 2 && v.videoWidth) {
            const scale = Math.min(1, 960 / v.videoWidth);
            canvas.width = Math.round(v.videoWidth * scale);
            canvas.height = Math.round(v.videoHeight * scale);
            ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
            const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
            if (code?.data) return cb.current(code.data);
          }
          raf = requestAnimationFrame(tick);
        };
        tick();
      } catch (e) {
        const name = (e as Error).name;
        setErr(
          name === "NotAllowedError"
            ? "カメラの使用が許可されていません。ブラウザの設定で許可するか、下の「リンクを貼り付け」をお使いください。"
            : "カメラを起動できませんでした。下の「リンクを貼り付け」をお使いください。",
        );
        setActive(false);
      }
    })();

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [active]);

  return (
    <div className="scanner">
      {active ? (
        <div className="viewfinder">
          <video ref={videoRef} playsInline muted />
          <i aria-hidden />
          <p>相手のQRコードを枠に合わせてください</p>
        </div>
      ) : (
        <button className="btn big-btn" onClick={() => { setErr(""); setActive(true); }}>
          📷 カメラで読み取る
        </button>
      )}
      {active && (
        <button className="link-quiet" onClick={() => setActive(false)}>
          カメラを止める
        </button>
      )}
      {err && <p className="err" role="alert">{err}</p>}
    </div>
  );
}
