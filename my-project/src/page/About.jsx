
import { useEffect } from 'react';
import Events from '../component/about/Events';
import Feature from '../component/about/Feature';
import Hero from '../component/about/Hero';
import Testimonial from '../component/Testimonial';
import { useLocation } from 'react-router';

const About = () => {
    const { hash } = useLocation();

    useEffect(() => {
      if (hash !== '#about-hero') return;

      requestAnimationFrame(() => {
        document
          .getElementById('about-hero')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }, [hash]);
  return (
    <div id="about-hero">
      <Hero />
      <Feature />
      <div className="w-full min-h-[80vh] mt-5">
        <hr className="bg-black h-0.5" />
        <Testimonial />
        <Events />
      </div>
    </div>
  );
}

export default About
