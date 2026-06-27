import CircleDot from "../circle-style/CircleDot";
import CircleVideo from "../circle-style/CircleVideo";
import DoubleCircle from "../circle-style/DoubleCircle";
import DoubleCircle2 from "../circle-style/DoubleCircle2";
import SaveTheDate from "./SaveTheDate";

const HomeSection = () => {
  return (
    <section id="home" className="relative min-h-screen snap-start">
      <CircleVideo />
      <CircleDot />
      <DoubleCircle />
      <DoubleCircle2 />
      <SaveTheDate />
    </section>
  );
};

export default HomeSection;
