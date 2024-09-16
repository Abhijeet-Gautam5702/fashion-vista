import React,{useEffect} from 'react'

function Contact() {
  
  // On Page load => Scroll smoothly to the top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <div>Contact</div>
  )
}

export default Contact