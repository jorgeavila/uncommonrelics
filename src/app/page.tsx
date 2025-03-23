"use client";

import { useState } from "react";
import Link from "next/link";

export default function InfoWebsite() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative bg-black text-white min-h-screen flex flex-col items-center justify-start font-mono overflow-hidden pt-10 pb-40">
      {/* Main content overlay */}
      <div className="z-10 text-center px-4 mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight glitch">
          UNCOMMON ARTIFACTS : Voidful Materials - Relics
        </h1>
        <span className="text-orange-500">E G R O J J J Ξξ Ξξ</span>
        <h2 className="mt-4 text-4xl md:text-6xl font-extrabold">
          <span className="text-white ml-2">by&nbsp;</span>
          <span className="text-orange-500">E G R O J J J Ξξ Ξξ</span>
        </h2>
        <br />
        <br />
        <p className="mt-6 text-lg md:text-xl opacity-80 text-center mx-auto">
          Hybrid physical-digital artifacts embody hyper-engineered materials of uncanny beauty and latent danger.
        </p>
        <br />
        {/* Use Next.js Link for client-side navigation */}
        <Link href="/page2">
          <button
            className={`mt-10 px-8 py-3 border-2 text-lg transition-all ${
              hovered ? "bg-white text-black" : "border-white"
            }`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            ENTER
          </button>
        </Link>
      </div>
      
      {/* ShaderToy embed at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 flex justify-center overflow-hidden">
        <iframe 
          src="https://www.shadertoy.com/embed/NstSW2?gui=false&t=10&paused=false&muted=false" 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          allowFullScreen
        ></iframe>
      </div>
      
      <style jsx>{`
        * {
          color: #fff;
          text-shadow: 1px 1px 2px #000;
        }
        @keyframes glitch {
          0% { text-shadow: 2px 2px red, -2px -2px blue; }
          50% { text-shadow: -2px -2px red, 2px 2px blue; }
          100% { text-shadow: 2px 2px red, -2px -2px blue; }
        }
        .glitch {
          animation: glitch 0.5s infinite alternate;
        }
      `}</style>
    </div>
  );
}
