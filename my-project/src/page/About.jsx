
import Events from '../component/about/Events';
import Feature from '../component/about/Feature';
import Hero from '../component/about/Hero';
import Testimonial from '../component/Testimonial';

const About = () => {
  return (
    <div className="">
      <Hero />
      <Feature />
      <div className="w-full min-h-[80vh] mt-5">
        <hr className="bg-black h-0.5" />
        <Testimonial />
        <Events/>
      </div>
    </div>
  );
}

export default About
