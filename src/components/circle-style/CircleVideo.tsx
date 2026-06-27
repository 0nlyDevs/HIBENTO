const CircleVideo= () => {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <style>{`
        .cv-load {
          animation: cvAppear 2.6s ease-out 1.2s forwards;
          opacity: 0;
          transform: scale(0.2);
        }
        @keyframes cvAppear {
          0% { opacity: 0; transform: scale(0.2); }
          100% { opacity: 0.4; transform: scale(1); }
        }
        .cv-ring {
          width: min(90vw, 90vh);
          height: min(90vw, 90vh);
        }
        @media (min-width: 768px) {
          .cv-ring {
            width: min(100vw, 100vh);
            height: min(100vw, 100vh);
          }
        }
        @media (min-width: 1280px) {
          .cv-ring {
            width: min(130vw, 130vh);
            height: min(130vw, 130vh);
          }
        }
        @media (min-width: 1920px) {
          .cv-ring {
            width: min(150vw, 150vh);
            height: min(150vw, 150vh);
          }
        }
      `}</style>
      <div className="cv-load">
        <svg
          className="cv-ring"
          viewBox="0 0 100 100"
          style={{ overflow: "visible" }}
        >
          <defs>
            <clipPath id="videoClip">
              <circle cx="50" cy="50" r="35" />
            </clipPath>
          </defs>
          <foreignObject
            x="15" y="15" width="70" height="70"
            clipPath="url(#videoClip)"
          >
            <video
              autoPlay muted loop playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            >
              <source src="/videos/home-header.mp4" type="video/mp4" />
            </video>
          </foreignObject>
        </svg>
      </div>
    </div>
  );
}

export default CircleVideo;