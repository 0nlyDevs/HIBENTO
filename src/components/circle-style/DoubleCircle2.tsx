const DoubleCircle2 = () => {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <style>{`
        .dc2-load {
          animation: dc2Load 2.8s ease-out forwards;
          transform: translateX(60vw) scale(3.5);
        }
        .dc2-orbit {
          animation: orbitSpin2 60s linear 2.2s infinite;
          transform-origin: 50px 50px;
        }
        .dc2-self {
          animation: selfSpin2 20s linear 2.2s infinite;
          transform-origin: 83.25px 50px;
        }
        @keyframes dc2Load {
          0% { transform: translateX(60vw) scale(3.5); }
          50% { transform: translateX(0) scale(1.12); }
          100% { transform: translateX(0) scale(1); }
        }
        @keyframes orbitSpin2 {
          to { transform: rotate(-360deg); }
        }
        @keyframes selfSpin2 {
          to { transform: rotate(360deg); }
        }
        .dc2-ring {
          width: min(100vw, 100vh);
          height: min(100vw, 100vh);
        }
        @media (min-width: 768px) {
          .dc2-ring {
            width: min(110vw, 110vh);
            height: min(110vw, 110vh);
          }
        }
        @media (min-width: 1280px) {
          .dc2-ring {
            width: min(110vw, 110vh);
            height: min(110vw, 110vh);
          }
        }
        @media (min-width: 1920px) {
          .dc2-ring {
            width: min(140vw, 140vh);
            height: min(140vw, 140vh);
          }
        }
      `}</style>
      <div className="dc2-load">
        <svg
          className="dc2-ring"
          viewBox="0 0 100 100"
          style={{ overflow: "visible" }}
        >
          <g className="dc2-orbit">
            <g className="dc2-self">
              <circle
                cx="83.25" cy="50" r="33"
                fill="none"
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="0.1"
              />
              <circle
                cx="116" cy="69" r="5"
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

export default DoubleCircle2;