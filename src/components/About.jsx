import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const bgImgRef = useRef(null);
  const tweenRef = useRef(null);
  const rafId = useRef(null);
  const lastRotation = useRef({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    if (!bgImgRef.current) return;
    if (rafId.current) return;

    rafId.current = requestAnimationFrame(() => {
      const rect = bgImgRef.current.getBoundingClientRect();
      const xPos = e.clientX - rect.left;
      const yPos = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((yPos - centerY) / centerY) * 15;
      const rotateY = ((xPos - centerX) / centerX) * -15;

      if (
        Math.abs(rotateX - lastRotation.current.rotateX) > 0.1 ||
        Math.abs(rotateY - lastRotation.current.rotateY) > 0.1
      ) {
        lastRotation.current = { rotateX, rotateY };

        if (tweenRef.current) {
          tweenRef.current.kill();
        }

        tweenRef.current = gsap.to(bgImgRef.current, {
          duration: 0.4,
          rotateX,
          rotateY,
          z: -40,
          ease: "power3.out",
          overwrite: "auto",
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          willChange: "transform",
        });
      }

      rafId.current = null;
    });
  };

  const handleMouseLeave = () => {
    if (!bgImgRef.current) return;
    if (tweenRef.current) {
      tweenRef.current.kill();
    }
    tweenRef.current = gsap.to(bgImgRef.current, {
      duration: 0.8,
      rotateX: 0,
      rotateY: 0,
      z: 0,
      ease: "power3.out",
      overwrite: "auto",
      transformOrigin: "center center",
      transformStyle: "preserve-3d",
      willChange: "transform",
    });
  };

  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation
      .to(".mask-clip-path", {
        width: "100vw",
        height: "100vh",
        borderRadius: 0,
        ease: "power2.out",
      })
      .fromTo(
        ".stone-image",
        { scale: 1.8, opacity: 0.8 },
        { scale: 1, opacity: 1, ease: "power2.out" },
        "<"
      )
      .fromTo(
        ".background-image",
        {
          clipPath: "polygon(4% 0, 83% 21%, 100% 73%, 0% 100%)",
          webkitClipPath: "polygon(4% 0, 83% 21%, 100% 73%, 0% 100%)",
        },
        {
          clipPath: "inset(0%)",
          webkitClipPath: "inset(0%)",
          ease: "power2.out",
        },
        "<"
      )
      .fromTo(
        ".scroll-text",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.5"
      );
  });

  useEffect(() => {
    return () => {
      if (tweenRef.current) tweenRef.current.kill();
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div id="about" className="min-h-screen w-screen bg-white">
      {/* Top Text Section */}
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5 px-4">
        <p className="font-general text-sm uppercase md:text-[10px]">
          Welcome to Zentry
        </p>

        <AnimatedTitle
          title="Disc<b>o</b>ver the world's <br /> largest shared <b>a</b>dventure"
          containerClass="mt-5 !text-black text-center"
        />

        <div className="about-subtext text-center">
          <p className="text-lg font-medium">
            The Game of Games begins—your life, now an epic MMORPG
          </p>
          <p className="text-gray-500 max-w-xl mx-auto">
            Zentry unites every player from countless games and platforms, both
            digital and physical, into a unified Play Economy
          </p>
        </div>
      </div>

      {/* Scroll Animation Section */}
      <div
        className="h-dvh w-screen"
        id="clip"
        style={{ perspective: "900px", transformStyle: "preserve-3d" }}
      >
        <div className="mask-clip-path about-image relative overflow-hidden w-full h-full">
          {/* Stone image (foreground) */}
          <img
            src="/img/stones.webp"
            alt="Stones"
            className="stone-image absolute top-0 left-0 w-full h-full object-cover z-50"
          />

          {/* Background image (behind) with floating tilt */}
          <img
            ref={bgImgRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            src="/img/about.webp"
            alt="Background"
            className="background-image absolute top-0 left-0 w-full h-full object-cover z-10"
            style={{
              willChange: "transform",
              pointerEvents: "auto",
              transformStyle: "preserve-3d",
            }}
          />

          {/* Main Headline Overlay */}
          

          {/* 👇 Scroll-In Text */}
              
        </div>
      </div>
    </div>
  );
};

export default About;
