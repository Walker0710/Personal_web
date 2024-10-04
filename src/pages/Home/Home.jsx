import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from 'gsap/all';
import { useGSAP } from '@gsap/react';
import { SiNetlify } from "react-icons/si";
import { SiVercel } from "react-icons/si";
import { DiJavascript1 } from "react-icons/di";
import { IoLogoFirebase } from "react-icons/io5";
import { SiMicrosoftazure } from "react-icons/si";
import { FaReact } from "react-icons/fa";
import { DiGit } from "react-icons/di";
import { BiLogoMongodb } from "react-icons/bi";
import { TbBrandCpp } from "react-icons/tb";
import { DiNodejs } from "react-icons/di";
import './Home.css';
import Cover2 from '../../assets/Portfolio.mp4';
import event from '../../assets/Projects/event.png';
import nexus from '../../assets/Projects/nexus.png';
import pathway from '../../assets/Projects/pathway.png';
import sai from '../../assets/Projects/sai.png';

import { hightlightsSlides } from '../../constants/index';
import { pauseImg, playImg, replayImg } from '../../utils/index';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {

  const containerRef = useRef(null);
  const homeRef = useRef(null);
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);
  const endingRef = useRef(null);
  const workRefs = useRef([]);
  const workListRefs = useRef([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState([]);
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  useGSAP(() => {
    // slider animation to move the video out of the screen and bring the next video in
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut", // show visualizer https://gsap.com/docs/v3/Eases
    });

    // video animation to play the video when it is in the view
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);


  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      // animation to move the indicator
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          // get the progress of the video
          const progress = Math.ceil(anim.progress() * 100);

          if (progress != currentProgress) {
            currentProgress = progress;

            // set the width of the progress bar
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw" // mobile
                  : window.innerWidth < 1200
                    ? "10vw" // tablet
                    : "4vw", // laptop
            });

            // set the background color of the progress bar
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },

        // when the video is ended, replace the progress bar with the indicator and change the background color
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if (videoId == 0) {
        anim.restart();
      }

      // update the progress bar
      const animUpdate = () => {
        anim.progress(
          videoRef.current[videoId].currentTime /
          hightlightsSlides[videoId].videoDuration
        );
      };

      if (isPlaying) {
        // ticker to update the progress bar
        gsap.ticker.add(animUpdate);
      } else {
        // remove the ticker when the video is paused (progress bar is stopped)
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay]);

  const handleProcess = (type, i) => {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
        break;

      case "video-last":
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;

      case "video-reset":
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
        break;

      case "pause":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      case "play":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      default:
        return video;
    }
  };

  const handleLoadedMetaData = (i, e) => setLoadedData((pre) => [...pre, e]);


  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  useEffect(() => {
    if (window.innerWidth > 992) {
      gsap.to(homeRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '100%',
          scrub: 2,
        },
        backgroundColor: 'rgba(0,0,0,1)',
        duration: 3,
        ease: 'power2.inOut'
      });

      gsap.to(homeRef.current, {
        scrollTrigger: {
          trigger: endingRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        backgroundColor: 'rgba(0,0,0,0)',
        duration: 3,
        ease: 'power2.inOut',
        onEnter: () => {
          // containerRef.current.play();
        }
      });
    }
  }, []);



  useEffect(() => {
    const handleScroll = () => {
      workRefs.current.forEach((imgRef, index) => {
        const rect = imgRef.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          workListRefs.current.forEach((workItem) => workItem.classList.remove('highlight'));
          workListRefs.current[index].classList.add('highlight');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={homeRef}>

      <video
        src={Cover2}
        muted
        loop
        // autoPlay
        className="home-bg"
        ref={containerRef}
      ></video>
      <div id='home-all' className='home-all'>
        <div className='hero'>
          <div className='hero-creative'>
            <h1 className='hero-first font-style-2'>creative</h1>
            <div className='hero-yoo'>
              <h1 className='hero-second font-style-1'>DESIGNER </h1>
              <h1 className='hero-third font-style-2'>& </h1>
            </div>
            <h1 className='hero-fourth font-style-1'>DEVELOPER </h1>
          </div>
          <div className='hero-intro'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen
            book.
          </div>
        </div>

        <div id='intro' className='intro'>
          <div className='intro-details'>
            <h1 className='intro-heading'>YOO, I AM ANKUSH</h1>
            <p className='intro-content'>I USE MY PASSION AND SKILLS
              TO CREATE DIGITAL PRODUCTS AND
              EXPERIENCES. NATIONAL AND INTERNATIONAL
              CUSTOMERS RELY ON ME FOR DESIGN,
              IMPLEMENTATION, AND MANAGEMENT OF
              THEIR DIGITAL PRODUCTS. AS AN
              INDEPENDENT, I WORK ALSO WITH WEB
              AGENCIES, COMPANIES, STARTUPS AND
              INDIVIDUALS TO CREATE A BLUEPRINT FOR THE
              DIGITAL BUSINESS.</p>
          </div>
          <div className='intro-structure'>
            photo
          </div>
        </div>

        <div className="work">
          <div className="video-carousel-wrapper">
            {hightlightsSlides.map((list, i) => (
              <div key={list.id} id="slider" className="carousel-slide">
                <div className="video-carousel_container">
                  <div className="video-wrapper">
                    <video
                      id="video"
                      playsInline={true}
                      className={`video-element ${list.id === 2 ? "translate-x-44" : ""}`}
                      preload="auto"
                      muted
                      ref={(el) => (videoRef.current[i] = el)}
                      onEnded={() =>
                        i !== 3
                          ? handleProcess("video-end", i)
                          : handleProcess("video-last")
                      }
                      onPlay={() => setVideo((pre) => ({ ...pre, isPlaying: true }))}
                      onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                    >
                      <source src={list.video} type="video/mp4" />
                    </video>
                  </div>

                  <div className="video-text-overlay">
                    {list.textLists.map((text, i) => (
                      <p key={i} className="video-text">{text}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="video-controls-wrapper">
            <div className="video-controls">
              {videoRef.current.map((_, i) => (
                <span
                  key={i}
                  className="video-control-dot"
                  ref={(el) => (videoDivRef.current[i] = el)}
                >
                  <span
                    className="video-control-dot-inner"
                    ref={(el) => (videoSpanRef.current[i] = el)}
                  />
                </span>
              ))}
            </div>

            <button className="control-btn">
              <img
                src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
                alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
                onClick={
                  isLastVideo
                    ? () => handleProcess("video-reset")
                    : !isPlaying
                      ? () => handleProcess("play")
                      : () => handleProcess("pause")
                }
              />
            </button>
          </div>
        </div>

        <div className='skillset'>
          <h1 className='skillset-heading'>SKILLSET</h1>
          <div className='skillset-list'>
            <div className='skillset-list-icon'>
              <DiJavascript1 size={150} />
            </div>
            <div className='skillset-list-icon'>
              <DiGit size={150} />
            </div>
            <div className='skillset-list-icon'>
              <BiLogoMongodb size={130} />
            </div>
            {/* <div className='skillset-list-icon'>
              <TbBrandCpp size={130} />
            </div> */}
            <div className='skillset-list-icon'>
              <DiNodejs size={130} />
            </div>
            <div className='skillset-list-icon'>
              <FaReact size={120} />
            </div>
            <div className='skillset-list-icon'>
              <SiMicrosoftazure size={110} />
            </div>
            <div className='skillset-list-icon'>
              <IoLogoFirebase size={120} />
            </div>
            <div className='skillset-list-icon'>
              <SiVercel size={120} />
            </div>
            <div className='skillset-list-icon'>
              <SiNetlify size={130} />
            </div>
          </div>
        </div>

        <div className='ending'>
          <div className='ending-connect'>
            <h1 className='connect-head connect-first'>LET'S</h1>
            <h1 className='connect-head connect-second'>CONNECT</h1>
          </div>
          <div className='ending-inter-foot'>
            <div className='connect-interested'>
              <h2 className='connect-interested-heading'>WHAT INTEREST'S ME</h2>
              <div className='connect-interested-list'>
                <div className='connect-interested-list-first'>
                  <button className='connect-button'>FRONTEND DEVELOPMENT</button>
                  <button className='connect-button'>BACKEND DEVELOPMENT</button>
                  <button className='connect-button'>UX/UI DESIGN</button>
                </div>
                <div className='connect-interested-list-second'>
                  <button className='connect-button'>STARTUPS</button>
                  <button className='connect-button'>PIZZA</button>
                </div>
              </div>
            </div>
            <div ref={endingRef} className='footer'>
              <div className='footer-contact'>
                <h2 className='footer-contact-heading'>ARE YOU PLANNING A PROJECT?</h2>
                <button className='connect-button'>CONTACT ME</button>
              </div>
              <div className='footer-social'>
                <a href="mailto:ankushsingh00710@gmail.com" target="_blank" rel="noopener noreferrer">
                  <p>EMAIL</p>
                </a>
                <a href="https://github.com/Walker0710" target="_blank" rel="noopener noreferrer">
                  <p>GITHUB</p>
                </a>
                <a href="https://www.linkedin.com/in/ankush-singh-8a43482a4/" target="_blank" rel="noopener noreferrer">
                  <p>LINKEDIN</p>
                </a>
                <a href="https://www.instagram.com/4nkush_singh" target="_blank" rel="noopener noreferrer">
                  <p>INSTAGRAM</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;


