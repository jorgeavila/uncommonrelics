"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VoidfulMaterials() {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const artifactVideoRef = useRef<HTMLVideoElement>(null);
  const productVideoRef = useRef<HTMLVideoElement>(null);

  const [dimensions, setDimensions] = useState({ width: 1080, height: 720 });
  const [activeVideo, setActiveVideo] = useState(1);
  const [globalGlitch, setGlobalGlitch] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  const products = [
    {
      id: 0,
      title: "EGROJJJ",
      heading: "Voidful Materials - Relics I",
      description:
        "This relic simulate substances that seduce and corrupt—iridescent hydrogels that crystallize flesh, alloys emitting euphoric yet neurotoxic frequencies.",
      subtext: "◐◉◑",
      videoSrc: "/Relic1b.mp4",
      artifactVideoSrc: "/artifact1.mp4",
      status: "AVAILABLE",
    },
    {
      id: 1,
      title: "Relic II",
      heading: "Voidful Materials - Relics II",
      description: "Geometric anomalies emerge from electromagnetic field disturbances.",
      subtext: "⊆⊂⊚⊃⊇",
      videoSrc: "/Relic3.mp4",
      artifactVideoSrc: "/artifact2.mp4",
      status: "AVAILABLE",
    },
    {
      id: 2,
      title: "Relic III",
      heading: "Voidful Materials - Relics III",
      description: "The final piece in our dystopian material science trilogy.",
      subtext: "Quantum entanglement visualized through reactive crystalline structures.",
      videoSrc: "/Relic3.mp4",
      artifactVideoSrc: "/artifact3.mp4",
      status: "AVAILABLE",
    },
  ];

  const AnimatedText = ({ text }: { text: string }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isResetting, setIsResetting] = useState(false);

    useEffect(() => {
      const interval = setInterval(() => {
        if (isResetting) {
          setIsResetting(false);
          setActiveIndex(0);
        } else if (activeIndex >= text.length) {
          setIsResetting(true);
        } else {
          setActiveIndex((prev) => prev + 1);
        }
      }, 300);
      return () => clearInterval(interval);
    }, [text.length, activeIndex, isResetting]);

    return (
      <span>
        {text.split("").map((char, index) =>
          char === " " ? (
            <span key={index}> </span>
          ) : (
            <span
              key={index}
              className="letter"
              style={{
                color: isResetting ? "white" : index < activeIndex ? "red" : "white",
                display: "inline-block",
              }}
            >
              {char}
            </span>
          )
        )}
      </span>
    );
  };

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlobalGlitch(true);
      setTimeout(() => setGlobalGlitch(false), 100);
    }, 40000);
    return () => clearInterval(glitchInterval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const containerWidth = window.innerWidth;
      const baseWidth = 1080;
      const baseHeight = 720;
      const aspectRatio = baseWidth / baseHeight;
      const newWidth = Math.min(containerWidth, baseWidth);
      const newHeight = newWidth / aspectRatio;
      setDimensions({ width: newWidth, height: newHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const VHSOverlay = () => (
    <div className="vhs-overlay">
      <div className="scanlines"></div>
      <div className="noise"></div>
      <div className="flicker"></div>
    </div>
  );

  useEffect(() => {
    if (videoRef1.current && videoRef2.current) {
      const video1 = videoRef1.current;
      const video2 = videoRef2.current;

      const handleVideo1End = () => {
        video1.style.display = "none";
        video2.style.display = "block";
        video2.play().catch((err) => console.error("Video playback error:", err));
        setActiveVideo(2);
      };
      const handleVideo2End = () => {
        video2.style.display = "none";
        video1.style.display = "block";
        video1.play().catch((err) => console.error("Video playback error:", err));
        setActiveVideo(1);
      };
      video1.addEventListener("ended", handleVideo1End);
      video2.addEventListener("ended", handleVideo2End);
      if (activeVideo === 1) {
        video1.style.display = "block";
        video2.style.display = "none";
      } else {
        video1.style.display = "none";
        video2.style.display = "block";
      }
      return () => {
        video1.removeEventListener("ended", handleVideo1End);
        video2.removeEventListener("ended", handleVideo2End);
      };
    }
  }, [activeVideo]);

  const nextProduct = () => {
    setIsGlitching(true);
    setTimeout(() => {
      setCurrentProduct((prev) => (prev + 1) % products.length);
      setIsGlitching(false);
    }, 1000);
  };

  const prevProduct = () => {
    setIsGlitching(true);
    setTimeout(() => {
      setCurrentProduct((prev) => (prev === 0 ? products.length - 1 : prev - 1));
      setIsGlitching(false);
    }, 1000);
  };

  return (
    <main className={`relative w-full min-h-screen overflow-hidden bg-black text-white font-sans ${globalGlitch ? "global-glitch" : ""}`}>
      <VHSOverlay />

      <nav className="sticky top-0 w-full flex justify-center items-center py-4 z-20 bg-black bg-opacity-80 backdrop-blur-sm">
        <div className="flex items-center space-x-6 md:space-x-10">
          <span className="cursor-pointer hover:opacity-80 text-sm md:text-base">
            <AnimatedText text="UNCOMMON" />
          </span>
          <div className="w-10 h-10 md:w-12 md:h-12 border border-white rounded-full flex items-center justify-center text-xs md:text-sm text-red-600">
            UA
          </div>
          <span className="cursor-pointer hover:opacity-80 text-sm md:text-base">
            <AnimatedText text="ARTIFACTS" />
          </span>
        </div>
      </nav>

      <div className="fixed inset-0 z-0 opacity-10">
        <video ref={videoRef1} width="100%" height="100%" autoPlay muted playsInline className="object-cover w-full h-full">
          <source src="/background1.mp4" type="video/mp4" />
        </video>
        <video ref={videoRef2} width="100%" height="100%" autoPlay muted playsInline className="object-cover w-full h-full" style={{ display: "none" }}>
          <source src="/background2.mp4" type="video/mp4" />
        </video>
      </div>

      <section className="relative flex flex-col items-center justify-center min-h-[40vh] px-4 md:px-8 z-10 pt-10 md:pt-20">
        <div className="text-center max-w-xl mx-auto">
          <h1 className="text-base md:text-lg opacity-80 mb-1">Relic I</h1>
          <h2 className={`text-3xl md:text-5xl lg:text-6xl font-bold mb-3 ${globalGlitch ? "glitch" : ""}`}>
            Voidful Materials - Relics I
          </h2>
          <p className="text-xs md:text-sm lg:text-base opacity-90 mb-2">
            This first pieces in a series exploring dystopian material science.
          </p>
          <p className="text-xs md:text-sm lg:text-base mb-4">
            A dimly lit lab-like space pulses with generative projections and reactive soundscapes.
          </p>
          <button className="border border-white px-4 md:px-6 py-1 md:py-2 text-xs md:text-sm uppercase transition-all hover:bg-white hover:text-black mx-auto">
            █░█░█░
          </button>
        </div>
      </section>

      <section className="relative min-h-screen px-4 md:px-8 z-10 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-16 items-start">
          <div className="text-left">
            <h1 className="text-base md:text-lg opacity-80 mb-1">{products[currentProduct].title}</h1>
            <motion.h2
              key={`heading-${currentProduct}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className={`text-3xl md:text-5xl lg:text-6xl font-bold mb-4 ${globalGlitch || isGlitching ? "glitch" : ""}`}
            >
              {products[currentProduct].heading}
            </motion.h2>
            <motion.p
              key={`desc-${currentProduct}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xs md:text-sm lg:text-base mb-2 opacity-90"
            >
              {products[currentProduct].description}
            </motion.p>
            <motion.p
              key={`subtext-${currentProduct}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xs md:text-sm lg:text-base mb-6 opacity-80"
            >
              {products[currentProduct].subtext}
            </motion.p>
            <div className="flex space-x-4 mt-6">
              <button onClick={prevProduct} className="border border-white px-4 py-1 text-xs md:text-sm uppercase transition-all hover:bg-white hover:text-black">
                PREV
              </button>
              <button onClick={nextProduct} className="border border-white px-4 py-1 text-xs md:text-sm uppercase transition-all hover:bg-white hover:text-black">
                NEXT
              </button>
            </div>
          </div>

          <div>
            <div className="relative w-full lg:w-[640px] pb-[56.25%] bg-gray-800 overflow-hidden mb-8">
              <div className={`absolute inset-0 z-10 ${isGlitching || globalGlitch ? "glitch-overlay" : "opacity-0"}`}></div>
              <video
                key={`artifactVideo-${currentProduct}`}
                ref={artifactVideoRef}
                autoPlay
                muted
                loop
                playsInline
                width={dimensions.width}
                height={dimensions.height}
                className="absolute top-0 left-0 w-full h-full object-cover"
              >
                <source src={products[currentProduct].artifactVideoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2 text-xs">
                3D Artifact Visualization
              </div>
            </div>
          </div>

          <div>
            <div className="relative w-[300px] h-[300px] bg-gray-800 overflow-hidden mb-8">
              <div className={`absolute inset-0 z-10 ${isGlitching || globalGlitch ? "glitch-overlay" : "opacity-0"}`}></div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProduct}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full"
                >
                  <video
                    ref={productVideoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    width={dimensions.width}
                    height={dimensions.height}
                    className={`object-cover w-full h-full absolute top-0 left-0 ${isGlitching || globalGlitch ? "glitch-video" : ""}`}
                  >
                    <source src={products[currentProduct].videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="text-xs md:text-sm lg:text-base mb-6">Beauty as a trap.</p>
            <button
              className={`border border-white px-4 md:px-6 py-1 md:py-2 text-xs md:text-sm uppercase transition-all hover:bg-white hover:text-black ${
                products[currentProduct].status === "SOLD OUT" ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {products[currentProduct].status}
            </button>
          </div>
        </div>
      </section>

      <section className="relative flex items-center justify-center h-screen">
        <div className="w-[60vmin] md:w-[80vmin] h-[60vmin] md:h-[80vmin] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ff0000,#ff7f00,#ff0000)] opacity-20 blur-3xl"></div>
        {globalGlitch && <div className="absolute inset-0 glitch-overlay z-10"></div>}
      </section>

      <style jsx>{`
        @keyframes glitch {
          0% { text-shadow: 2px 2px red, -2px -2px blue; transform: translate(1px, 1px); }
          25% { text-shadow: -2px -2px red, 2px 2px blue; transform: translate(-1px, 1px); }
          50% { text-shadow: 1px -1px red, -1px 1px blue; transform: translate(1px, -1px); }
          75% { text-shadow: -1px 1px red, 1px -1px blue; transform: translate(-1px, -1px); }
          100% { text-shadow: 2px 2px red, -2px -2px blue; transform: translate(1px, 1px); }
        }
        .glitch { animation: glitch 0.5s infinite alternate; }
        .global-glitch { animation: globalGlitch 0.3s steps(2) infinite; }
        @keyframes globalGlitch {
          0% { filter: none; }
          25% { filter: hue-rotate(90deg) contrast(1.5); }
          50% { filter: brightness(2) invert(0.1); }
          75% { filter: saturate(2) hue-rotate(-45deg); }
          100% { filter: none; }
        }
        @keyframes videoGlitch {
          0% { transform: translate(0) scale(1); filter: none; }
          20% { transform: translate(5px, 0) scale(1.02); filter: hue-rotate(90deg) saturate(200%); }
          40% { transform: translate(-5px, 0) scale(0.98); filter: invert(100%); }
          60% { transform: translate(0, 5px) scale(1.01); filter: brightness(2) contrast(2); }
          80% { transform: translate(0, -5px) scale(0.99); filter: blur(2px); }
          100% { transform: translate(0) scale(1); filter: none; }
        }
        .glitch-video { animation: videoGlitch 0.2s steps(2) infinite; }
        .glitch-overlay {
          background: linear-gradient(45deg, rgba(255, 0, 0, 0.2), rgba(0, 0, 255, 0.2));
          mix-blend-mode: overlay;
          animation: videoGlitch 0.1s steps(2) infinite;
        }
        .vhs-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 30;
          opacity: 0.1;
        }
        .scanlines {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 1px,
            rgba(0, 0, 0, 0.25) 1px,
            rgba(0, 0, 0, 0.25) 2px
          );
        }
        .noise {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.2;
        }
        .flicker { position: absolute; left: 0; }
        @keyframes flicker {
          0% { opacity: 0; }
          2% { opacity: 0.1; }
          4% { opacity: 0; }
          8% { opacity: 0; }
          9% { opacity: 0.1; }
          10% { opacity: 0; }
          99% { opacity: 0; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </main>
  );
}