import Hero from '../component/Hero'
import About_us from '../component/About_us'
import Host from '../component/Host'
import Testimonial from '../component/Testimonial'
import Menu_section from '../component/Menu_section'
import Reviews from '../component/Reviews'
import { useEffect } from 'react'

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <Hero />
      <About_us />
      <Host />
      <Testimonial />
      <Menu_section />
      
      <Reviews/>
    </div>
  );
}

export default Home
