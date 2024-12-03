import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import './homex2.scss'; // Import any styles if needed
import { useNavigate } from 'react-router-dom';

// Register the GSAP Flip plugin
gsap.registerPlugin(Flip);

const MainPresentSec = () => {
  const containerRef = useRef(null); // Reference to the container div
  const audioRef = useRef(null); // Reference to the audio element
  const navigate = useNavigate(); // React Router navigate function for navigation
  const [hasStarted, setHasStarted] = useState(false); // State to track if the sound has started

  useEffect(() => {
    if (hasStarted) {
      // Play the sound when the user interacts
      const audio = audioRef.current;
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });

      // Set a timeout to redirect after 15 seconds
      const redirectTimeout = setTimeout(() => {
        navigate('/home_nakshatravels'); // Redirect to the new URL
      }, 7500); // 15 seconds

      const container = containerRef.current;
      let layouts = ["final", "plain", "columns", "grid"];
      let curLayout = 0; // Index of the current layout

      function nextState() {
        const state = Flip.getState(".letter, .for, .gsap", {
          props: "color,backgroundColor",
          simple: true,
        }); // Capture current state

        container.classList.remove(layouts[curLayout]); // Remove old class
        curLayout = (curLayout + 1) % layouts.length; // Increment (loop back to the start if at the end)
        container.classList.add(layouts[curLayout]); // Add the new class

        Flip.from(state, {
          // Animate from the previous state
          absolute: true,
          stagger: 0.07,
          duration: 0.7,
          ease: "power2.inOut",
          spin: curLayout === 0, // Only spin when going to the "final" layout
          simple: true,
          onEnter: (elements, animation) =>
            gsap.fromTo(
              elements,
              { opacity: 0 },
              { opacity: 1, delay: animation.duration() - 0.1 }
            ),
          onLeave: (elements) => gsap.to(elements, { opacity: 0 }),
        });

        gsap.delayedCall(curLayout === 0 ? 3.5 : 1.5, nextState);
      }

      gsap.delayedCall(1, nextState); // Start the animation sequence

      // Cleanup function to stop audio and remove GSAP animations and timeout when the component unmounts
      return () => {
        audio.pause(); // Stop the audio
        gsap.killTweensOf(nextState); // Kill any ongoing animations
        clearTimeout(redirectTimeout); // Clear the redirect timeout
      };
    }
  }, [hasStarted, navigate]); // Dependency on hasStarted and navigate for navigation

  const handleStart = () => {
    setHasStarted(true); // Update state to indicate start
  };
  return (
    <>
      <audio ref={audioRef} src="/lord-of-the-rings-main-theme-made-with-Voicemod.mp3" />
      {!hasStarted ? (
        <div className="x4se55423sdfd5x">
          <div class="container" onClick={handleStart}>
            <a class="button is-play" href="#">
              <div class="button-outer-circle has-scale-animation"></div>
              <div class="button-outer-circle has-scale-animation has-delay-short"></div>
              <div class="button-icon is-play"><svg height="100%" width="100%" fill="#f857a6"><polygon class="triangle" points="5,0 30,15 5,30" viewBox="0 0 30 15"></polygon><path class="path" d="M5,0 L30,15 L5,30z" fill="none" stroke="#f857a6" stroke-width="1"></path></svg></div>
            </a>
          </div>
          {/* <button onClick={handleStart}>Start</button> */}
        </div>
      ) : (
        <div className="allproductsofdetsclkx2">
          <div>
            <div className="container final" ref={containerRef}>
              <div className="letter M">M</div>
              <div className="letter E">E</div>
              <div className="letter G">G</div>
              <div className="letter A">A</div>
              <div className="gsap">MARKET</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MainPresentSec;
