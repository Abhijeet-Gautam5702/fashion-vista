import React,{useEffect} from 'react'

function About() {
  
  // On Page load => Scroll smoothly to the top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <div>About</div>
  )
}

export default About