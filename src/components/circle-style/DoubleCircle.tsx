const DoubleCircle = () => {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <style>{`
        .dc1-load {
          animation: dc1Load 2.8s ease-out forwards;
          transform: translateX(-60vw) scale(3.5);
        }
        .dc-orbit {
          animation: orbitSpin 60s linear 2.2s infinite;
          transform-origin: 50px 50px;
        }
        .dc-self {
          animation: selfSpin 20s linear 2.2s infinite;
          transform-origin: 16.75px 50px;
        }
        @keyframes dc1Load {
          0% { transform: translateX(-60vw) scale(3.5); }
          50% { transform: translateX(0) scale(1.12); }
          100% { transform: translateX(0) scale(1); }
        }
        @keyframes orbitSpin {
          to { transform: rotate(-360deg); }
        }
        @keyframes selfSpin {
          to { transform: rotate(360deg); }
        }
        .dc-ring {
          width: min(100vw, 100vh);
          height: min(100vw, 100vh);
        }
        @media (min-width: 768px) {
          .dc-ring {
            width: min(110vw, 110vh);
            height: min(110vw, 110vh);
          }
        }
        @media (min-width: 1280px) {
          .dc-ring {
            width: min(110vw, 110vh);
            height: min(110vw, 110vh);
          }
        }
        @media (min-width: 1920px) {
          .dc-ring {
            width: min(140vw, 140vh);
            height: min(140vw, 140vh);
          }
        }
      `}</style>
      <div className="dc1-load">
        <svg
          className="dc-ring"
          viewBox="0 0 100 100"
          style={{ overflow: "visible" }}
        >
          <g className="dc-orbit">
            <g className="dc-self">
              <circle
                cx="16.75" cy="50" r="33"
                fill="none"
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="0.1"
              />
              <circle
                cx="-16" cy="31" r="5"
                fill="none"
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="0.1"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default DoubleCircle;
