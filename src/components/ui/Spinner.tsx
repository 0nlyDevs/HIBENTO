interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-5 h-5",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`border-2 border-ivory/20 border-t-chartreuse rounded-full animate-spin ${sizes[size]} ${className ?? ""}`}
    />
  );
}

export function PageLoader({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className ?? "min-h-screen"}`}>
      <Spinner />
    </div>
  );
}
