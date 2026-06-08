import Image from "next/image";
import SwipeLettersButton from "@/components/ui/SwipeLetterButton";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center">

      <Image
        src="/forest.png"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />

      <div className="absolute inset-0 bg-background/40" />

      <div className="absolute inset-0 flex items-center justify-center z-10 pb-24">
        <span className="text-display text-white select-none text-[clamp(10rem,25vw,20rem)] leading-none tracking-tighter">
          404
        </span>
      </div>

      <div className="absolute inset-0 flex items-end justify-center z-20">
        <div className="relative w-full max-w-3xl h-screen">
          <Image
            src="/lost-person.png"
            alt="Lost person"
            fill
            className="object-contain object-center"
          />
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 flex flex-col items-center pb-24 gap-5 z-30">
        <p className="text-white/80 text-lg">
          It looks like you&apos;re lost in the forest
        </p>
        <SwipeLettersButton
          as="a"
          href="/"
          label="Go back home"
          fontSize="0.875rem"
          fontWeight={600}
          direction="top"
          textColor="hsl(260 9% 18%)"
          hoverTextColor="hsl(260 9% 18%)"
          className="pill px-8 py-3 bg-accent hover:opacity-90 transition-opacity duration-200"
        />
      </div>

    </div>
  );
}
