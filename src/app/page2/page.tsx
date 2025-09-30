"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import p5 from "p5";
import { motion, AnimatePresence } from "framer-motion";

// **AnimatedText Component**: Progressively colors text letters red
const AnimatedText = ({ text }) => {
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
              color: isResetting
                ? "white"
                : index < activeIndex
                ? "red"
                : "white",
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

// **VHSOverlay Component**: Adds VHS-like effects with scanlines, noise, and flicker
const VHSOverlay = () => {
  return (
    <div className="vhs-overlay">
      <div className="scanlines"></div>
      <div className="noise"></div>
      <div className="flicker"></div>
    </div>
  );
};

// **Main Component**: VoidfulMaterials with NoiseCubes integrated
export default function VoidfulMaterials() {
  const sketchRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 1080, height: 720 });
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const [activeVideo, setActiveVideo] = useState(1);
  const [globalGlitch, setGlobalGlitch] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const productVideoRef = useRef(null);

  const products = [
    {
      id: 0,
      title: "Relic I",
      heading: "Voidful Materials - Relics I",
      description:
        "The first piece in a series exploring dystopian material science.",
      subtext:
        "A dimly lit lab-like space pulses with generative projections and reactive soundscapes.",
      videoSrc: "/Relic1b.mp4",
      status: "SOLD OUT",
    },
    {
      id: 1,
      title: "Relic II",
      heading: "Voidful Materials - Relics II",
      description:
        "The second piece in our dystopian material science exploration.",
      subtext:
        "Geometric anomalies emerge from electromagnetic field disturbances.",
      videoSrc: "/Relic2.mp4",
      status: "AVAILABLE",
    },
    {
      id: 2,
      title: "Relic III",
      heading: "Voidful Materials - Relics III",
      description:
        "The final piece in our dystopian material science trilogy.",
      subtext:
        "Quantum entanglement visualized through reactive crystalline structures.",
      videoSrc: "/Relic3.mp4",
      status: "COMING SOON",
    },
  ];

  // **NoiseCubes Component**: Integrated directly here
  const NoiseCubes = ({ isGlitching, className }) => {
    const containerRef = useRef(null);
    const p5InstanceRef = useRef(null);

    useEffect(() => {
      if (containerRef.current && !p5InstanceRef.current) {
        const noiseSketch = (p) => {
          const cubes = [
            { x: 0, y: 0, seed: p.random(1000), speed: 0.02, scale: 0.03 },
            { x: 0, y: 0, seed: p.random(1000), speed: 0.015, scale: 0.025 },
            { x: 0, y: 0, seed: p.random(1000), speed: 0.025, scale: 0.035 },
          ];
          const size = 64;
          const spacing = 12;
          let flickerIntensity = 0;

          p.setup = () => {
            p.createCanvas(3 * size + 2 * spacing, size);
            p.noStroke();
            p.pixelDensity(1);
            p.isGlitching = isGlitching;
          };

          p.draw = () => {
            p.background(0);
            flickerIntensity = p.lerp(
              flickerIntensity,
              p.noise(p.frameCount * 0.01) * 0.5 + 0.5,
              0.05
            );

            for (let i = 0; i < cubes.length; i++) {
              const cube = cubes[i];
              const cubeX = i * (size + spacing);
              cube.x += Math.sin(p.frameCount * 0.01 + cube.seed) * 0.2;
              cube.y += Math.cos(p.frameCount * 0.015 + cube.seed * 0.5) * 0.2;

              const buffer = p.createGraphics(size, size);
              buffer.pixelDensity(1);
              buffer.loadPixels();

              for (let x = 0; x < size; x++) {
                for (let y = 0; y < size; y++) {
                  const noiseVal = p.noise(
                    (x + cube.x) * cube.scale,
                    (y + cube.y) * cube.scale,
                    cube.seed + p.frameCount * cube.speed
                  );
                  const flickerVal = noiseVal * (0.7 + flickerIntensity * 0.3);
                  const baseVal = p.map(flickerVal, 0, 1, 0, 255);
                  const val = p.isGlitching ? 255 - baseVal : baseVal;
                  const index = 4 * (y * size + x);
                  buffer.pixels[index] = val;
                  buffer.pixels[index + 1] = val;
                  buffer.pixels[index + 2] = val;
                  buffer.pixels[index + 3] = 255;
                }
              }
              buffer.updatePixels();
              p.image(buffer, cubeX, 0);
            }
          };
        };

        p5InstanceRef.current = new p5(noiseSketch, containerRef.current);
      }

      return () => {
        if (p5InstanceRef.current) {
          p5InstanceRef.current.remove();
          p5InstanceRef.current = null;
        }
      };
    }, [isGlitching]); // Include isGlitching in dependency array

    useEffect(() => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.isGlitching = isGlitching;
      }
    }, [isGlitching]);

    return <div ref={containerRef} className={className} />;
  };

  // **Global Glitch Effect**: Triggers every 10 seconds
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlobalGlitch(true);
      setTimeout(() => setGlobalGlitch(false), 500);
    }, 10000);

    return () => clearInterval(glitchInterval);
  }, []);

  // **Responsive Design**: Adjusts canvas dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      const containerWidth =
        sketchRef.current?.clientWidth || window.innerWidth;
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

  // Create stable callbacks for video handlers
  const handleVideo1End = useCallback(() => {
    if (videoRef1.current && videoRef2.current) {
      videoRef1.current.style.display = "none";
      videoRef2.current.style.display = "block";
      videoRef2.current.play();
      setActiveVideo(2);
    }
  }, []);

  const handleVideo2End = useCallback(() => {
    if (videoRef2.current && videoRef1.current) {
      videoRef2.current.style.display = "none";
      videoRef1.current.style.display = "block";
      videoRef1.current.play();
      setActiveVideo(1);
    }
  }, []);

  // **Background Video Playback**: Alternates between two videos
  useEffect(() => {
    const video1 = videoRef1.current;
    const video2 = videoRef2.current;
    
    if (video1 && video2) {
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
  }, [activeVideo, handleVideo1End, handleVideo2End]);

  // **Neural Network Visualization**: p5.js sketch
  useEffect(() => {
    if (!sketchRef.current) return;

    const sketch = (p) => {
      let layers = [];
      let connections = [];
      const neuronsPerLayer = [5, 5, 5, 5];
      const inputLabels = ["Light", "EMF", "Heat", "Camera", "Geiger"];
      const hiddenLayer1Labels = [
        "Infrared Light 1",
        "Infrared Light 2",
        "Infrared Light 3",
        "Infrared Light 4",
        "Infrared Light 5",
      ];
      const hiddenLayer2Labels = [
        "Voidful Energy 1",
        "Voidful Energy 2",
        "Voidful Energy 3",
        "Voidful Energy 4",
        "Voidful Energy 5",
      ];
      const outputLabels = ["Relic 1", "Relic 2", "Relic 3", "Relic 4", "Relic 5"];
      const layerLabels = ["Input Layers", "Hidden Layer 1", "Hidden Layer 2"];

      p.setup = () => {
        p.createCanvas(dimensions.width, dimensions.height);
        resetSketch();
      };

      const resetSketch = () => {
        layers = [];
        for (let i = 0; i < neuronsPerLayer.length; i++) {
          const numNeurons = neuronsPerLayer[i];
          const layer = [];
          const x = p.map(i, 0, neuronsPerLayer.length - 1, 100, p.width - 100);
          for (let j = 0; j < numNeurons; j++) {
            const y = p.map(j, 0, numNeurons - 1, 100, p.height - 100);
            layer.push(p.createVector(x, y));
          }
          layers.push(layer);
        }

        connections = [];
        for (let i = 0; i < layers.length - 1; i++) {
          for (let j = 0; j < layers[i].length; j++) {
            for (let k = 0; k < layers[i + 1].length; k++) {
              const start = layers[i][j];
              const end = layers[i + 1][k];
              const offset = p.random(p.TWO_PI);
              connections.push({ start, end, offset });
            }
          }
        }
      };

      p.draw = () => {
        p.background(0);
        p.stroke(200, 200, 200, 100);
        p.strokeWeight(1);
        for (const conn of connections) {
          p.line(conn.start.x, conn.start.y, conn.end.x, conn.end.y);
        }

        p.noStroke();
        p.fill(11, 255, 37);
        const speed = p.TWO_PI / 300;
        for (const conn of connections) {
          const t = (p.sin(p.frameCount * speed + conn.offset) + 1) / 2;
          const x = p.lerp(conn.start.x, conn.end.x, t);
          const y = p.lerp(conn.start.y, conn.end.y, t);
          p.ellipse(x, y, 4, 4);
        }

        p.textSize(14);
        for (let i = 0; i < layers.length; i++) {
          const layer = layers[i];
          p.noStroke();
          p.fill(255);
          p.textAlign(p.CENTER, p.BOTTOM);
          if (i < layerLabels.length) {
            p.text(layerLabels[i], layer[0].x, 50);
          } else {
            p.text("Output", layer[0].x, 50);
          }

          for (let j = 0; j < layer.length; j++) {
            const pos = layer[j];
            p.fill(85, 0, 255);
            p.stroke(255);
            p.ellipse(pos.x, pos.y, 27, 27);
            p.noStroke();
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            if (i === 0 && j < inputLabels.length) {
              p.text(inputLabels[j], pos.x, pos.y - 22);
            } else if (i === 1 && j < hiddenLayer1Labels.length) {
              p.text(hiddenLayer1Labels[j], pos.x, pos.y - 22);
            } else if (i === 2 && j < hiddenLayer2Labels.length) {
              p.text(hiddenLayer2Labels[j], pos.x, pos.y - 22);
            } else if (i === 3 && j < outputLabels.length) {
              p.text(outputLabels[j], pos.x, pos.y - 22);
            }
          }
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(dimensions.width, dimensions.height);
        resetSketch();
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);
    return () => p5Instance.remove();
  }, [dimensions]);

  // **Product Navigation Functions**
  const nextProduct = useCallback(() => {
    setIsGlitching(true);
    setTimeout(() => {
      setCurrentProduct((prev) => (prev + 1) % products.length);
      setIsGlitching(false);
    }, 1000);
  }, [products.length]);

  const prevProduct = useCallback(() => {
    setIsGlitching(true);
    setTimeout(() => {
      setCurrentProduct((prev) =>
        prev === 0 ? products.length - 1 : prev - 1
      );
      setIsGlitching(false);
    }, 1000);
  }, [products.length]);

  return (
    <main
      className={`relative w-full min-h-screen overflow-hidden text-white bg-black font-sans ${
        globalGlitch ? "global-glitch" : ""
      }`}
    >
      {/* VHS Overlay */}
      <VHSOverlay />

      {/* Navigation Bar */}
      <nav className="sticky top-0 w-full flex justify-center items-center py-4 z-20 bg-black bg-opacity-80 backdrop-blur-sm">
        <div className="flex items-center space-x-6 md:space-x-10">
          <span className="cursor-pointer hover:opacity-80 text-sm md:text-base">
            <AnimatedText text="UNCOMMON" />
          </span>
          <div className="w-10 h-10 md:w-12 md:h-12 border border-white-500 rounded-full flex items-center justify-center text-xs md:text-sm text-red-100">
            NA
          </div>
          <span className="cursor-pointer hover:opacity-80 text-sm md:text-base">
            <AnimatedText text="ARTIFACTS" />
          </span>
        </div>
      </nav>

      {/* Background Videos */}
      <div className="fixed inset-0 z-0 opacity-20">
        <video
          ref={videoRef1}
          width="100%"
          height="100%"
          autoPlay
          muted
          playsInline
          className="object-cover w-full h-full"
        >
          <source src="/background1.mp4" type="video/mp4" />
        </video>

        <video
          ref={videoRef2}
          width="100%"
          height="100%"
          autoPlay
          muted
          playsInline
          className="object-cover w-full h-full"
          style={{ display: "none" }}
        >
          <source src="/background2.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Main Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[40vh] px-4 md:px-8 z-10 pt-10 md:pt-20">
        <div className="text-center max-w-xl mx-auto">
          <h1 className="text-base md:text-lg opacity-80 mb-1">EGROJJJ</h1>
          <h2
            className={`text-3xl md:text-5xl lg:text-6xl font-bold mb-3 ${
              globalGlitch ? "glitch" : ""
            }`}
          >
            Voidful Materials - Relics I
          </h2>
          <p className="text-xs md:text-sm lg:text-base opacity-90 mb-2">
            Hybrid physical-digital artifacts embody hyper-engineered materials.
          </p>
          <div className="flex justify-center mb-4">
            <NoiseCubes isGlitching={globalGlitch} className="h-16 mt-2 mb-2" />
          </div>
          <p className="text-xs md:text-sm lg:text-base mb-4">
            Beauty as a trap: Allure masks toxicity. Critique of innovation
            without ethics.
          </p>
          <button className="border border-white px-4 md:px-6 py-1 md:py-2 text-xs md:text-sm uppercase transition-all hover:bg-white hover:text-black mx-auto">
            SOLD OUT
          </button>
        </div>
      </section>

      {/* Neural Network Visualization */}
      <section className="w-full flex justify-center items-center px-4 mb-12 relative">
        <div
          ref={sketchRef}
          className="w-full max-w-5xl h-auto"
          style={{ height: `${dimensions.height}px` }}
        />
        {globalGlitch && (
          <div className="absolute inset-0 glitch-overlay z-10"></div>
        )}
      </section>

      {/* Gallery Section with Glitchy Transitions */}
      <section className="relative min-h-screen px-4 md:px-8 z-10 py-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center">
          {/* Left Side - Product Info */}
          <div className="lg:w-1/3 mb-10 lg:mb-0 lg:mr-10 text-left">
            <h1 className="text-base md:text-lg opacity-80 mb-1">
              {products[currentProduct].title}
            </h1>
            <motion.h2
              key={`heading-${currentProduct}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className={`text-3xl md:text-5xl lg:text-6xl font-bold mb-4 ${
                globalGlitch || isGlitching ? "glitch" : ""
              }`}
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
              <button
                onClick={prevProduct}
                className="border border-white px-4 py-1 text-xs md:text-sm uppercase transition-all hover:bg-white hover:text-black"
              >
                PREV
              </button>
              <button
                onClick={nextProduct}
                className="border border-white px-4 py-1 text-xs md:text-sm uppercase transition-all hover:bg-white hover:text-black"
              >
                NEXT
              </button>
            </div>
          </div>

          {/* Center - Product Video */}
          <div className="lg:w-1/3 flex flex-col items-center">
            <div className="w-[300px] h-[300px] bg-gray-900 overflow-hidden relative">
              <div
                className={`absolute inset-0 z-10 ${
                  isGlitching || globalGlitch ? "glitch-overlay" : "opacity-0"
                }`}
              ></div>

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
                    width="300"
                    height="300"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={`object-cover w-full h-full absolute top-0 left-0 ${
                      isGlitching || globalGlitch ? "glitch-video" : ""
                    }`}
                  >
                    <source
                      src={products[currentProduct].videoSrc}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side - Noise Cubes and Status */}
          <div className="lg:w-1/3 mt-10 lg:mt-0 lg:ml-10 flex flex-col items-center lg:items-start">
            <NoiseCubes isGlitching={globalGlitch} className="h-16 mb-4 w-full" />
            <p className="text-xs md:text-sm lg:text-base mb-6">
              Beauty as a trap.
            </p>
            <button
              className={`border border-white px-4 md:px-6 py-1 md:py-2 text-xs md:text-sm uppercase transition-all hover:bg-white hover:text-black mt-4 ${
                products[currentProduct].status === "SOLD OUT"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {products[currentProduct].status}
            </button>

            {/* Product Navigation Dots */}
            <div className="flex space-x-2 mt-8">
              {products.map((product, index) => (
                <button
                  key={product.id}
                  className={`w-3 h-3 rounded-full ${
                    currentProduct === index ? "bg-white" : "bg-gray-600"
                  }`}
                  onClick={() => {
                    setIsGlitching(true);
                    setTimeout(() => {
                      setCurrentProduct(index);
                      setIsGlitching(false);
                    }, 1000);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Color Wheel Section */}
      <section className="relative flex items-center justify-center h-screen">
        <div className="w-[60vmin] md:w-[80vmin] h-[60vmin] md:h-[80vmin] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ff0000,#ff7f00,#ff0000)] opacity-20 blur-3xl"></div>
        {globalGlitch && (
          <div className="absolute inset-0 glitch-overlay z-10"></div>
        )}
      </section>

      {/* Styles */}
      <style jsx>{`
        /* Glitch Effects */
        @keyframes glitch {
          0% {
            text-shadow: 2px 2px red, -2px -2px blue;
            transform: translate(1px, 1px);
          }
          25% {
            text-shadow: -2px -2px red, 2px 2px blue;
            transform: translate(-1px, 1px);
          }
          50% {
            text-shadow: 1px -1px red, -1px 1px blue;
            transform: translate(1px, -1px);
          }
          75% {
            text-shadow: -1px 1px red, 1px -1px blue;
            transform: translate(-1px, -1px);
          }
          100% {
            text-shadow: 2px 2px red, -2px -2px blue;
            transform: translate(1px, 1px);
          }
        }

        .glitch {
          animation: glitch 0.5s infinite alternate;
        }

        .global-glitch {
          animation: globalGlitch 0.3s steps(2) infinite;
        }

        @keyframes globalGlitch {
          0% {
            filter: none;
          }
          25% {
            filter: hue-rotate(90deg) contrast(1.5);
          }
          50% {
            filter: brightness(2) invert(0.1);
          }
          75% {
            filter: saturate(2) hue-rotate(-45deg);
          }
          100% {
            filter: none;
          }
        }

        @keyframes videoGlitch {
          0% {
            transform: translate(0) scale(1);
            filter: none;
          }
          20% {
            transform: translate(5px, 0) scale(1.02);
            filter: hue-rotate(90deg) saturate(200%);
          }
          40% {
            transform: translate(-5px, 0) scale(0.98);
            filter: invert(100%);
          }
          60% {
            transform: translate(0, 5px) scale(1.01);
            filter: brightness(2) contrast(2);
          }
          80% {
            transform: translate(0, -5px) scale(0.99);
            filter: blur(2px);
          }
          100% {
            transform: translate(0) scale(1);
            filter: none;
          }
        }

        .glitch-video {
          animation: videoGlitch 0.2s steps(2) infinite;
        }

        .glitch-overlay {
          background: linear-gradient(
            45deg,
            rgba(255, 0, 0, 0.2),
            rgba(0, 0, 255, 0.2)
          );
          mix-blend-mode: overlay;
          animation: videoGlitch 0.1s steps(2) infinite;
        }

        /* VHS Overlay Effects */
        .vhs-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 30;
          opacity: 0.15;
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

        .flicker {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #fff;
          opacity: 0;
          animation: flicker 0.3s infinite;
        }

        @keyframes flicker {
          0% {
            opacity: 0;
          }
          2% {
            opacity: 0.1;
          }
          4% {
            opacity: 0;
          }
          8% {
            opacity: 0;
          }
          9% {
            opacity: 0.1;
          }
          10% {
            opacity: 0;
          }
          99% {
            opacity: 0;
          }
          100% {
            opacity: 0.2;
          }
        }
      `}</style>
    </main>
  );
}