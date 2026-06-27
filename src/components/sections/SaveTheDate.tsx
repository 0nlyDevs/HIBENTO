export default function SaveTheDate() {
  return (
    <>
      <style>{`
        .std-reveal {
          position: relative;
          animation: stdReveal 2.2s ease-out 1.8s both;
        }
        .std-reveal::before,
        .std-reveal::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          pointer-events: none;
        }
        .std-reveal::before {
          color: #ff0040;
          z-index: -1;
          animation: glitchR 2.2s ease-out 1.8s both;
        }
        .std-reveal::after {
          color: #00e5ff;
          z-index: -1;
          animation: glitchB 2.2s ease-out 1.8s both;
        }
        @keyframes stdReveal {
          0% { opacity: 0; clip-path: inset(0 0 100% 0); transform: translateY(24px); }
          30% { opacity: 1; clip-path: inset(0 0 0 0); transform: translateY(0); }
          100% { opacity: 1; clip-path: inset(0 0 0 0); transform: translateY(0); }
        }
        @keyframes glitchR {
          0% { opacity: 0; transform: translate(0); }
          30% { opacity: 0; }
          31% { opacity: 0.15; transform: translate(-1.5px, 0.5px); }
          33% { opacity: 0; transform: translate(0); }
          100% { opacity: 0; }
        }
        @keyframes glitchB {
          0% { opacity: 0; transform: translate(0); }
          30% { opacity: 0; }
          32% { opacity: 0.12; transform: translate(1.5px, -0.5px); }
          34% { opacity: 0; transform: translate(0); }
          100% { opacity: 0; }
        }
        .subtitle-reveal {
          animation: subtitleIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.2s both;
        }
        @keyframes subtitleIn {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="absolute bottom-4 sm:bottom-5 left-12 sm:left-16 lg:left-14">
        <div
          className="flex flex-col flex-wrap gap-3 sm:gap-4 md:gap-5"
          style={{ transform: "scaleX(1.08) scaleY(0.75)", transformOrigin: "left center" }}
        >
          <p
            className="std-reveal text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black uppercase text-white"
            data-text="SAVE THE DATE"
          >
            SAVE THE DATE!
          </p>
          <p className="subtitle-reveal text-primary text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold uppercase">
            Track any event, assist them anywhere
          </p>
        </div>
      </div>
    </>
  );
}
