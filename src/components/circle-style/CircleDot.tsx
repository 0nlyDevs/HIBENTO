const CircleDot = () => {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <style>{`
        .cd-load {
          animation: cdAppear 2.5s ease-out 0.4s forwards;
          opacity: 0;
          transform: scale(2.5);
        }
        .circle-spin {
          animation: spin 40s linear 0.8s infinite;
        }
        @keyframes cdAppear {
          0% { opacity: 0; transform: scale(2.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .ring-base {
          width: min(120vw, 120vh);
          height: min(120vw, 120vh);
        }
        @media (min-width: 768px) {
          .ring-base {
            width: min(130vw, 130vh);
            height: min(130vw, 130vh);
          }
        }
        @media (min-width: 1280px) {
          .ring-base {
            width: min(130vw, 130vh);
            height: min(130vw, 130vh);
          }
        }
        @media (min-width: 1920px) {
          .ring-base {
            width: min(150vw, 150vh);
            height: min(150vw, 150vh);
          }
        }
      `}</style>
      <div className="cd-load">
        <svg
          className="circle-spin ring-base"
          viewBox="0 0 100 100"
          style={{ overflow: "visible" }}
        >
          <circle
            cx="50" cy="50" r="43"
            fill="none"
            stroke="rgba(255, 255, 255,0.9)"
            strokeWidth="0.1"
            strokeDasharray="0.3 1.7"
          />
        </svg>
      </div>
    </div>
  );
}

export default CircleDot;