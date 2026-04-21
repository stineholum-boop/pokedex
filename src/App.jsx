import { useState, useRef, useCallback } from "react";

const POKEDEX_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #1a0a0a; }

  .pokedex-root {
    min-height: 100vh;
    background: radial-gradient(ellipse at center, #2d0a0a 0%, #0d0505 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Press Start 2P', monospace;
    padding: 16px;
  }

  .pokedex-body {
    width: 420px;
    max-width: 100%;
    background: linear-gradient(160deg, #cc2222 0%, #991111 40%, #cc2222 100%);
    border-radius: 16px 16px 12px 12px;
    box-shadow:
      0 0 0 3px #ff4444,
      0 0 0 6px #880000,
      0 0 40px rgba(255,60,60,0.4),
      0 20px 60px rgba(0,0,0,0.8),
      inset 0 2px 0 rgba(255,180,180,0.3);
    position: relative;
    user-select: none;
  }

  .pokedex-body::before {
    content: '';
    position: absolute;
    top: -4px; left: 50%;
    transform: translateX(-50%);
    width: 60px; height: 8px;
    background: #660000;
    border-radius: 4px 4px 0 0;
    box-shadow: 0 -2px 0 #441111;
  }

  .pokedex-top {
    padding: 18px 18px 0;
    background: linear-gradient(160deg, #dd2828 0%, #aa1515 100%);
    border-radius: 16px 16px 0 0;
    position: relative;
  }

  .top-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
  }

  .big-eye {
    width: 52px; height: 52px;
    background: radial-gradient(circle at 35% 35%, #aaddff, #2288ff 50%, #0044cc);
    border-radius: 50%;
    border: 4px solid white;
    box-shadow: 0 0 0 3px #0055bb, 0 0 20px rgba(100,180,255,0.8), inset 0 0 10px rgba(255,255,255,0.4);
    position: relative;
    flex-shrink: 0;
    animation: eyePulse 3s ease-in-out infinite;
  }

  @keyframes eyePulse {
    0%, 100% { box-shadow: 0 0 0 3px #0055bb, 0 0 20px rgba(100,180,255,0.8), inset 0 0 10px rgba(255,255,255,0.4); }
    50% { box-shadow: 0 0 0 3px #0055bb, 0 0 35px rgba(100,180,255,1), inset 0 0 15px rgba(255,255,255,0.6); }
  }

  .big-eye::after {
    content: '';
    position: absolute;
    top: 10px; left: 10px;
    width: 12px; height: 10px;
    background: rgba(255,255,255,0.7);
    border-radius: 50%;
    transform: rotate(-30deg);
  }

  .top-lights { display: flex; gap: 8px; }

  .light {
    width: 14px; height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(0,0,0,0.3);
  }

  .light-red { background: #ff4444; box-shadow: 0 0 6px #ff0000; }
  .light-yellow { background: #ffcc00; box-shadow: 0 0 6px #ffaa00; }
  .light-green { background: #44ff44; box-shadow: 0 0 6px #00ff00; }

  .pokedex-title {
    font-size: 9px;
    color: rgba(255,220,220,0.9);
    letter-spacing: 3px;
    margin-left: auto;
    text-shadow: 0 0 10px rgba(255,100,100,0.8);
  }

  .screen-housing {
    background: #220808;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 14px;
    box-shadow: inset 0 3px 10px rgba(0,0,0,0.8), 0 2px 0 rgba(255,100,100,0.3);
    border: 2px solid #440000;
  }

  .screen {
    background: #0a1a0a;
    border-radius: 4px;
    min-height: 280px;
    position: relative;
    overflow: hidden;
    border: 2px solid #1a3a1a;
    box-shadow: inset 0 0 30px rgba(0,0,0,0.6);
    display: flex;
    flex-direction: column;
  }

  .screen::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 2px,
      rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px
    );
    pointer-events: none;
    z-index: 10;
  }

  .screen-idle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 280px;
    gap: 16px;
    padding: 20px;
  }

  .idle-pokeball { width: 70px; height: 70px; animation: idleBob 2s ease-in-out infinite; }

  @keyframes idleBob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  .idle-text {
    font-size: 7px;
    color: #44cc44;
    text-align: center;
    line-height: 2;
    text-shadow: 0 0 8px #00ff00;
  }

  .camera-view { position: relative; width: 100%; height: 280px; }
  .camera-view video { width: 100%; height: 100%; object-fit: cover; display: block; }

  .camera-overlay { position: absolute; inset: 0; pointer-events: none; }

  .scan-line {
    position: absolute;
    left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #00ff00, transparent);
    animation: scan 2s linear infinite;
    box-shadow: 0 0 8px #00ff00;
  }

  @keyframes scan {
    0% { top: 0; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }

  .corner {
    position: absolute;
    width: 20px; height: 20px;
    border-color: #00ff00;
    border-style: solid;
    box-shadow: 0 0 6px #00ff00;
  }
  .corner-tl { top: 15px; left: 15px; border-width: 2px 0 0 2px; }
  .corner-tr { top: 15px; right: 15px; border-width: 2px 2px 0 0; }
  .corner-bl { bottom: 15px; left: 15px; border-width: 0 0 2px 2px; }
  .corner-br { bottom: 15px; right: 15px; border-width: 0 2px 2px 0; }

  .camera-label {
    position: absolute;
    bottom: 8px; right: 8px;
    font-size: 6px;
    color: #00ff00;
    text-shadow: 0 0 4px #00ff00;
  }

  .result-screen {
    padding: 12px;
    height: 280px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #440000 #0a1a0a;
  }
  .result-screen::-webkit-scrollbar { width: 4px; }
  .result-screen::-webkit-scrollbar-track { background: #0a1a0a; }
  .result-screen::-webkit-scrollbar-thumb { background: #440000; }

  .pokemon-header {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #1a3a1a;
    padding-bottom: 10px;
  }

  .pokemon-sprite-container {
    background: rgba(0,255,0,0.05);
    border: 1px solid #1a3a1a;
    border-radius: 4px;
    padding: 4px;
    flex-shrink: 0;
  }

  .pokemon-sprite {
    width: 64px; height: 64px;
    image-rendering: pixelated;
    filter: drop-shadow(0 0 6px rgba(100,255,100,0.4));
  }

  .pokemon-name-section { flex: 1; }
  .pokemon-number { font-size: 7px; color: #448844; margin-bottom: 4px; }
  .pokemon-name {
    font-size: 11px;
    color: #88ff88;
    text-shadow: 0 0 10px #00ff00;
    margin-bottom: 6px;
    text-transform: uppercase;
  }

  .type-badges { display: flex; gap: 4px; flex-wrap: wrap; }
  .type-badge {
    font-size: 6px;
    padding: 2px 6px;
    border-radius: 2px;
    text-transform: uppercase;
    font-weight: bold;
  }

  .info-section { margin-bottom: 8px; }
  .info-label {
    font-size: 6px;
    color: #448844;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .info-value {
    color: #aaffaa;
    line-height: 1.8;
    font-family: 'VT323', monospace;
    font-size: 14px;
  }

  .moves-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; }
  .move-item {
    background: rgba(0,100,0,0.2);
    border: 1px solid #1a4a1a;
    padding: 3px 5px;
    color: #88ff88;
    border-radius: 2px;
    font-family: 'VT323', monospace;
    font-size: 11px;
  }
  .move-level { color: #448844; display: block; font-size: 9px; }

  .loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 280px;
    gap: 16px;
  }

  .loading-dots { display: flex; gap: 8px; }
  .loading-dot {
    width: 8px; height: 8px;
    background: #00ff00;
    border-radius: 50%;
    animation: dotBounce 0.8s ease-in-out infinite;
    box-shadow: 0 0 6px #00ff00;
  }
  .loading-dot:nth-child(2) { animation-delay: 0.2s; }
  .loading-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes dotBounce {
    0%, 100% { transform: translateY(0); opacity: 0.5; }
    50% { transform: translateY(-10px); opacity: 1; }
  }

  .loading-text {
    font-size: 7px;
    color: #44cc44;
    text-shadow: 0 0 8px #00ff00;
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .error-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 280px;
    gap: 12px;
    padding: 20px;
    text-align: center;
  }

  .error-icon { font-size: 32px; }
  .error-text {
    font-size: 7px;
    color: #ff4444;
    line-height: 2;
    text-shadow: 0 0 8px #ff0000;
    white-space: pre-line;
  }

  .pokedex-divider {
    height: 16px;
    background: linear-gradient(180deg, #880000 0%, #660000 100%);
    margin: 0 -18px;
    position: relative;
    box-shadow: inset 0 3px 6px rgba(0,0,0,0.4);
  }

  .hinge-screws {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }

  .screw {
    width: 8px; height: 8px;
    background: #440000;
    border-radius: 50%;
    border: 1px solid #222;
    box-shadow: inset 1px 1px 0 rgba(255,100,100,0.2);
  }

  .pokedex-bottom {
    padding: 14px 18px 18px;
    background: linear-gradient(160deg, #bb2020 0%, #881010 100%);
    border-radius: 0 0 12px 12px;
  }

  .bottom-screen-housing {
    background: #220808;
    border-radius: 6px;
    padding: 8px;
    margin-bottom: 14px;
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.8);
    border: 2px solid #440000;
  }

  .bottom-screen {
    background: #1a0a2a;
    border-radius: 3px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border: 1px solid #2a0a3a;
    overflow: hidden;
  }

  .status-text {
    color: #cc88ff;
    text-align: center;
    font-family: 'VT323', monospace;
    font-size: 13px;
    text-shadow: 0 0 8px rgba(180,100,255,0.8);
  }

  .controls-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .dpad { position: relative; width: 70px; height: 70px; flex-shrink: 0; }

  .dpad-h, .dpad-v {
    position: absolute;
    background: #550000;
    border-radius: 2px;
    box-shadow: inset 0 1px 0 rgba(255,100,100,0.2), 0 2px 4px rgba(0,0,0,0.5);
  }

  .dpad-h { width: 100%; height: 33%; top: 33%; left: 0; }
  .dpad-v { width: 33%; height: 100%; top: 0; left: 33%; }
  .dpad-center { position: absolute; top: 33%; left: 33%; width: 33%; height: 33%; background: #660000; z-index: 1; }

  .action-buttons { display: flex; flex-direction: column; gap: 6px; flex: 1; }

  .btn-capture {
    width: 100%;
    padding: 10px 6px;
    background: linear-gradient(180deg, #ff4444 0%, #cc1111 100%);
    border: none;
    border-radius: 4px;
    color: white;
    font-family: 'Press Start 2P', monospace;
    font-size: 6px;
    cursor: pointer;
    box-shadow: 0 4px 0 #880000, 0 0 10px rgba(255,60,60,0.4);
    transition: all 0.1s;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    letter-spacing: 0.5px;
  }

  .btn-capture:hover {
    background: linear-gradient(180deg, #ff6666 0%, #ee2222 100%);
    box-shadow: 0 4px 0 #880000, 0 0 20px rgba(255,60,60,0.7);
  }

  .btn-capture:active { transform: translateY(3px); box-shadow: 0 1px 0 #880000; }
  .btn-capture:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .btn-secondary {
    width: 100%;
    padding: 7px 6px;
    background: linear-gradient(180deg, #334 0%, #223 100%);
    border: 1px solid #445;
    border-radius: 4px;
    color: #aab;
    font-family: 'Press Start 2P', monospace;
    font-size: 5px;
    cursor: pointer;
    box-shadow: 0 3px 0 #111;
    transition: all 0.1s;
  }

  .btn-secondary:hover { background: linear-gradient(180deg, #445 0%, #334 100%); }
  .btn-secondary:active { transform: translateY(2px); box-shadow: 0 1px 0 #111; }

  .speaker-grid {
    display: grid;
    grid-template-columns: repeat(4, 6px);
    grid-template-rows: repeat(6, 6px);
    gap: 3px;
    flex-shrink: 0;
  }

  .speaker-hole {
    width: 6px; height: 6px;
    background: #660000;
    border-radius: 50%;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.8);
  }

  .type-normal { background: #A8A878; color: #222; }
  .type-fire { background: #F08030; color: #fff; }
  .type-water { background: #6890F0; color: #fff; }
  .type-electric { background: #F8D030; color: #222; }
  .type-grass { background: #78C850; color: #222; }
  .type-ice { background: #98D8D8; color: #222; }
  .type-fighting { background: #C03028; color: #fff; }
  .type-poison { background: #A040A0; color: #fff; }
  .type-ground { background: #E0C068; color: #222; }
  .type-flying { background: #A890F0; color: #222; }
  .type-psychic { background: #F85888; color: #fff; }
  .type-bug { background: #A8B820; color: #222; }
  .type-rock { background: #B8A038; color: #fff; }
  .type-ghost { background: #705898; color: #fff; }
  .type-dragon { background: #7038F8; color: #fff; }
  .type-dark { background: #705848; color: #fff; }
  .type-steel { background: #B8B8D0; color: #222; }
  .type-fairy { background: #EE99AC; color: #222; }
`;

const REGIONS = {
  kanto: "Kanto (Gen I)", johto: "Johto (Gen II)", hoenn: "Hoenn (Gen III)",
  sinnoh: "Sinnoh (Gen IV)", unova: "Unova (Gen V)", kalos: "Kalos (Gen VI)",
  alola: "Alola (Gen VII)", galar: "Galar (Gen VIII)", paldea: "Paldea (Gen IX)"
};

const PokeballSVG = ({ size = 70 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill="#CC2222" stroke="#222" strokeWidth="3"/>
    <clipPath id="topHalf"><rect x="0" y="0" width="100" height="50"/></clipPath>
    <circle cx="50" cy="50" r="48" fill="#CC2222" clipPath="url(#topHalf)"/>
    <clipPath id="botHalf"><rect x="0" y="50" width="100" height="50"/></clipPath>
    <circle cx="50" cy="50" r="48" fill="#f0f0f0" clipPath="url(#botHalf)"/>
    <rect x="0" y="46" width="100" height="8" fill="#222"/>
    <circle cx="50" cy="50" r="12" fill="#f0f0f0" stroke="#222" strokeWidth="3"/>
    <circle cx="50" cy="50" r="6" fill="#aaa" stroke="#222" strokeWidth="2"/>
  </svg>
);

export default function PokedexApp() {
  const [mode, setMode] = useState("idle");
  const [pokemonData, setPokemonData] = useState(null);
  const [statusMsg, setStatusMsg] = useState("READY TO SCAN...");
  const [errorMsg, setErrorMsg] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const videoCallbackRef = useCallback((node) => {
  videoRef.current = node;
  if (node && streamRef.current) {
    node.srcObject = streamRef.current;
    node.play().catch(() => {});
  }
}, []);
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      setMode("camera");
      setStatusMsg("CAMERA ACTIVE - POINT AT POKEMON");
      setTimeout(() => {
  if (videoRef.current) {
    videoRef.current.srcObject = stream;
    videoRef.current.setAttribute("playsinline", "true");
    videoRef.current.setAttribute("muted", "true");
    videoRef.current.play().catch(() => {});
  }
      }, 100);
    } catch {
      setErrorMsg("CAMERA ACCESS DENIED.\nPLEASE ALLOW CAMERA PERMISSION.");
      setMode("error");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    ctx.drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];

    stopCamera();
    setMode("loading");
    setStatusMsg("SCANNING POKEMON...");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: "image/jpeg", data: imageData }
              },
              {
                type: "text",
                text: `You are a Pokédex. Identify the Pokémon in this image and respond ONLY with valid JSON, no markdown, no explanation. If no Pokémon is found, return {"error": "No Pokémon detected"}.

JSON format:
{
  "number": "<national pokedex number as string like 001>",
  "name": "<English name>",
  "types": ["<type1>", "<type2 or null>"],
  "region": "<kanto|johto|hoenn|sinnoh|unova|kalos|alola|galar|paldea>",
  "category": "<species category e.g. Seed Pokémon>",
  "height": "<height in meters>",
  "weight": "<weight in kg>",
  "description": "<one sentence pokedex entry>",
  "letsgomoves": [
    {"level": "<level number or TM>", "move": "<move name>"},
    ...list the first 16 moves learned in Pokemon Lets Go Pikachu/Eevee...
  ]
}`
              }
            ]
          }]
        })
      });

const data = await response.json();
if (data.error) throw new Error(data.error.message || "API error");
const raw = data.content?.map(c => c.text || "").join("") || "";
const clean = raw.replace(/```json|```/g, "").trim();
if (!clean) throw new Error("Empty response from AI");
const parsed = JSON.parse(clean);

      if (parsed.error) {
        setErrorMsg(parsed.error.toUpperCase() + ".\nTRY AGAIN WITH A\nPOKEMON IMAGE.");
        setMode("error");
        setStatusMsg("SCAN FAILED");
      } else {
        setPokemonData(parsed);
        setMode("result");
        setStatusMsg(`${parsed.name?.toUpperCase()} DATA LOADED!`);
      }
    } catch {
      setErrorMsg("ANALYSIS ERROR.\n" + err.message);
      setMode("error");
      setStatusMsg("ERROR");
    }
  }, [stopCamera]);

  const reset = useCallback(() => {
    stopCamera();
    setPokemonData(null);
    setErrorMsg("");
    setMode("idle");
    setStatusMsg("READY TO SCAN...");
  }, [stopCamera]);

  const spriteUrl = pokemonData?.number
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${parseInt(pokemonData.number)}.png`
    : null;

  return (
    <>
      <style>{POKEDEX_STYLE}</style>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="pokedex-root">
        <div className="pokedex-body">
          <div className="pokedex-top">
            <div className="top-row">
              <div className="big-eye" />
              <div className="top-lights">
                <div className="light light-red" />
                <div className="light light-yellow" />
                <div className="light light-green" style={{ boxShadow: (mode === "camera" || mode === "result") ? "0 0 10px #00ff00" : undefined }} />
              </div>
              <span className="pokedex-title">POKÉDEX</span>
            </div>

            <div className="screen-housing">
              <div className="screen">
                {mode === "idle" && (
                  <div className="screen-idle">
                    <div className="idle-pokeball"><PokeballSVG size={70} /></div>
                    <div className="idle-text">PRESS SCAN TO<br/>IDENTIFY POKEMON<br/><br/>► POINT CAMERA AT<br/>A POKEMON IMAGE</div>
                  </div>
                )}

                {mode === "camera" && (
                  <div className="camera-view">
                    <video ref={videoCallbackRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div className="camera-overlay">
                      <div className="scan-line" />
                      <div className="corner corner-tl" />
                      <div className="corner corner-tr" />
                      <div className="corner corner-bl" />
                      <div className="corner corner-br" />
                      <div className="camera-label">SCANNING...</div>
                    </div>
                  </div>
                )}

                {mode === "loading" && (
                  <div className="loading-screen">
                    <PokeballSVG size={50} />
                    <div className="loading-dots">
                      <div className="loading-dot" />
                      <div className="loading-dot" />
                      <div className="loading-dot" />
                    </div>
                    <div className="loading-text">ANALYZING...</div>
                  </div>
                )}

                {mode === "result" && pokemonData && (
                  <div className="result-screen">
                    <div className="pokemon-header">
                      <div className="pokemon-sprite-container">
                        {spriteUrl && <img src={spriteUrl} alt={pokemonData.name} className="pokemon-sprite" />}
                      </div>
                      <div className="pokemon-name-section">
                        <div className="pokemon-number">№ {pokemonData.number}</div>
                        <div className="pokemon-name">{pokemonData.name}</div>
                        <div className="type-badges">
                          {pokemonData.types?.filter(Boolean).map(t => (
                            <span key={t} className={`type-badge type-${t?.toLowerCase()}`}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <div className="info-label">◆ REGION</div>
                      <div className="info-value">{REGIONS[pokemonData.region] || pokemonData.region}</div>
                    </div>

                    <div className="info-section">
                      <div className="info-label">◆ CATEGORY</div>
                      <div className="info-value">{pokemonData.category}</div>
                    </div>

                    <div className="info-section">
                      <div className="info-label">◆ HT / WT</div>
                      <div className="info-value">{pokemonData.height}m · {pokemonData.weight}kg</div>
                    </div>

                    <div className="info-section">
                      <div className="info-label">◆ POKEDEX ENTRY</div>
                      <div className="info-value">{pokemonData.description}</div>
                    </div>

                    <div className="info-section">
                      <div className="info-label">◆ MOVES - LETS GO</div>
                      <div className="moves-grid">
                        {pokemonData.letsgomoves?.map((m, i) => (
                          <div key={i} className="move-item">
                            <span className="move-level">Lv.{m.level}</span>
                            {m.move}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {mode === "error" && (
                  <div className="error-screen">
                    <div className="error-icon">⚠</div>
                    <div className="error-text">{errorMsg}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pokedex-divider">
            <div className="hinge-screws">
              <div className="screw" /><div className="screw" />
            </div>
          </div>

          <div className="pokedex-bottom">
            <div className="bottom-screen-housing">
              <div className="bottom-screen">
                <div className="status-text">{statusMsg}</div>
              </div>
            </div>

            <div className="controls-row">
              <div className="dpad">
                <div className="dpad-h" />
                <div className="dpad-v" />
                <div className="dpad-center" />
              </div>

              <div className="action-buttons">
                {(mode === "idle" || mode === "error") && (
                  <button className="btn-capture" onClick={startCamera}>📷 SCAN POKEMON</button>
                )}
                {mode === "camera" && (
                  <button className="btn-capture" onClick={captureAndAnalyze}>⚡ CAPTURE!</button>
                )}
                {mode === "loading" && (
                  <button className="btn-capture" disabled>⏳ SCANNING...</button>
                )}
                {mode === "result" && (
                  <button className="btn-capture" onClick={startCamera}>📷 SCAN AGAIN</button>
                )}
                <button className="btn-secondary" onClick={reset}>↩ RESET</button>
              </div>

              <div className="speaker-grid">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="speaker-hole" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
