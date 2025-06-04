import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

const ImageClipBox = ({ src, clipClass, floatRef }) => (
  <div
    ref={floatRef}
    className={clipClass}
    style={{ transformStyle: "preserve-3d" }}
  >
    <img src={src} alt="" />
  </div>
);

const Contact = () => {
  const floatRefs = useRef([]);

  useEffect(() => {
    // Set offscreen and hidden
    floatRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        x: i < 2 ? -200 : 200,
        opacity: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
      });
    });

    const slideInTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#contact",
        start: "top 80%",
        toggleActions: "play none none reset",
      },
    });

    floatRefs.current.forEach((el, i) => {
      if (!el) return;
      slideInTl.to(
        el,
        {
          duration: 1,
          x: 0,
          opacity: 1,
          ease: "power3.out",
          rotateX: i === 2 ? 5 : i === 3 ? -5 : 0,
          rotateY: i === 2 ? -7 : i === 3 ? 7 : 0,
        },
        i * 0.3
      );
    });

    // Floating animation
    slideInTl.eventCallback("onComplete", () => {
      floatRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: i === 2 ? -20 : i === 3 ? 20 : i % 2 === 0 ? -15 : 15,
          x: i === 2 ? 15 : i === 3 ? -15 : i % 2 === 0 ? 10 : -10,
          rotateX: i === 2 ? 5 : i === 3 ? -5 : 0,
          rotateY: i === 2 ? -7 : i === 3 ? 7 : 0,
          duration: 5 + i,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          transformOrigin: "center center",
          force3D: true,
        });
      });
    });

    ScrollTrigger.create({
      trigger: "#contact",
      start: "bottom 20%",
      onLeave: () => {
        floatRefs.current.forEach((el, i) => {
          gsap.killTweensOf(el);
          gsap.set(el, {
            x: i < 2 ? -200 : 200,
            opacity: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
          });
        });
      },
      onEnterBack: () => {
        slideInTl.restart();
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.killTweensOf(floatRefs.current);
    };
  }, []);

  return (
    <div
      id="contact"
      className="my-20 min-h-96 w-screen px-10 relative overflow-hidden perspective-[1000px]"
    >
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/videos/feature-2.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="relative rounded-lg bg-black bg-opacity-70 py-24 text-blue-50 z-10">
        {/* Left Floating Images */}
        <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96">
          <ImageClipBox
            src="/img/contact-1.webp"
            clipClass="contact-clip-path-1"
            floatRef={(el) => (floatRefs.current[0] = el)}
          />
          <ImageClipBox
            src="/img/contact-2.webp"
            clipClass="contact-clip-path-2 lg:translate-y-40 translate-y-60"
            floatRef={(el) => (floatRefs.current[1] = el)}
          />
        </div>

        {/* Right Swordman Group */}
        <div
          className="absolute -top-40 left-20 w-60 sm:top-1/2 md:left-auto md:right-10 lg:top-20 lg:w-80"
          ref={(el) => (floatRefs.current[2] = el)}
        >
          <ImageClipBox
            src="/img/swordman-partial.webp"
            clipClass="absolute md:scale-125"
            floatRef={(el) => (floatRefs.current[3] = el)}
          />
          <ImageClipBox
            src="/img/swordman.webp"
            clipClass="sword-man-clip-path md:scale-125"
            floatRef={() => {}} // no need to track further
          />
        </div>

        {/* Center Text Content */}
        <div className="flex flex-col items-center text-center">
          <p className="mb-10 font-general text-[10px] uppercase">Join Zentry</p>

          <AnimatedTitle
            title="let&#39;s b<b>u</b>ild the <br /> new era of <br /> g<b>a</b>ming t<b>o</b>gether."
            className="special-font !md:text-[6.2rem] w-full font-zentry !text-5xl !font-black !leading-[.9]"
          />

          <Button title="contact us" containerClass="mt-10 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
