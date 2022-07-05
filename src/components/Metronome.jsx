import React, { useState, useEffect, useRef } from 'react';
import TrainingGraph from './TrainingGraph';
import useSound from 'use-sound';
import useStayAwake from "use-stay-awake";
import tickSound from '../tick2.mp3';

function Metronome() {
    const [active, setActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [ticks, setTicks] = useState(0);
    const [time, setTime] = useState(40*60);
    const [volume, setVolume] = useState(0.3);
    const [bpm, setBpm] = useState(85);
    const [secondsPassed, setSecondsPassed] = useState(0);
    const inputVolume = useRef(null);
    const inputBpm = useRef(null);
    const [progressPercent, setProgressPercent] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    // Device for preventing sleep
    const device = useStayAwake();
    
    // Set initial variables from Local Storage
    useEffect(() => {
        // Volume
        const lsVolume = localStorage.getItem('volume');

        if(lsVolume) {
            inputVolume.current.value = lsVolume*100;
            setVolume(lsVolume);
        } else {
            inputVolume.current.value = volume*100;
        }

        // Bpm
        const lsBpm = localStorage.getItem('bpm');

        if(lsBpm) {
            setBpm(lsBpm);
            inputBpm.current.value = lsBpm;
        }
    }, [])

    // Sound hook
    const [play, { stop, pause }] = useSound(
        tickSound,
        { volume: !isMuted ? volume : 0 }
    );

    // Prevent device sleep
    useEffect(() => {
        active
            ? device.preventSleeping()
            : device.allowSleeping()
    }, [active]);

    // Ticks + sound
    useEffect(() => {
        active && !isPaused && setTimeout(() => {
            if(active) {
                play();
                setTicks(prevTicks => prevTicks + 1);
            }
        }, 60000/bpm);
      }, [active, ticks, isPaused]);

    //Timer
    useEffect(() => {
        active && !isPaused && setTimeout(() => {
            setSecondsPassed(prevSeconds => prevSeconds + 1);
            setProgressPercent(secondsPassed * 100 / time);
        }, 1000);
    }, [active, secondsPassed, isPaused]);
    
    // Classes
    let btnClass = "";
    if(active) {
        isPaused
            ? btnClass = "btn-metronome resume"
            : btnClass = "btn-metronome pause"
    }
    else { 
        btnClass = "btn-metronome" 
    }

    let volumeIconClass = "";
    if(isMuted || volume === 0) {
        volumeIconClass = "svg-volume red";
    } else {
        volumeIconClass = "svg-volume";
    }

    // Volume icon SVG
    const sign = () => {
        if(isMuted || volume === 0) {
            return <path d="M 19.414 12 L 22.95 15.536 L 21.536 16.95 L 18 13.414 L 14.464 16.95 L 13.05 15.536 L 16.586 12 L 13.05 8.464 L 14.464 7.05 L 18 10.586 L 21.536 7.05 L 22.95 8.464 L 19.414 12 Z"></path>;
        } else if(volume < .5) {
            return <path d="M 15.877 16.6 L 14.455 15.178 C 15.439 14.421 16.015 13.25 16.014 12.009 C 16.014 10.579 15.264 9.324 14.134 8.617 L 15.573 7.178 C 17.109 8.308 18.016 10.102 18.014 12.009 C 18.014 13.851 17.184 15.499 15.877 16.6 Z"></path>;
        } else {
            return <path d="M 19.406 20.134 L 17.99 18.718 C 19.907 17.011 21.003 14.566 21 12 C 21.003 9.298 19.789 6.739 17.696 5.032 L 19.116 3.612 C 21.582 5.699 23.003 8.768 23 12 C 23 15.223 21.614 18.122 19.406 20.134 Z M 15.863 16.591 L 14.441 15.169 C 15.425 14.412 16.001 13.241 16 12 C 16 10.57 15.25 9.315 14.12 8.608 L 15.559 7.169 C 17.095 8.299 18.002 10.092 18 12 C 18 13.842 17.17 15.49 15.863 16.591 Z"></path>
        }
    }

    const volumeIcon =
        <svg 
            className={volumeIconClass} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            width="48" 
            height="48">
        <path d="M 10 7.22 L 6.603 10 L 3 10 L 3 14 L 6.603 14 L 10 16.78 L 10 7.22 Z M 5.889 16 L 2 16 C 1.448 16 1 15.552 1 15 L 1 9 C 1 8.447 1.448 8 2 8 L 5.889 8 L 11.183 3.668 C 11.481 3.424 11.931 3.593 11.993 3.973 C 11.998 4 12 4.027 12 4.055 L 12 19.945 C 12 20.329 11.584 20.57 11.25 20.378 C 11.227 20.364 11.204 20.349 11.183 20.332 L 5.89 16 L 5.889 16 Z"></path>
        {sign()}
        </svg>;

    // BPM label indent
    const labelStyle = {
        right: bpm > 99 ? `60px` : `70px`,
    };

    // Handlers
    function handlePlayPauseButtonClick() {
        if(!active) {
            setActive(prev => !prev);
        } else {
            setIsPaused(prev => !prev);

            !isPaused
                ? pause()
                : play()
        }
    }

    function handleStopButtonClick() {
        setActive(prev => !prev);
        setIsPaused(false);
        setSecondsPassed(0);
        setProgressPercent(0);
    }

    function handleTimeChange(newTime) {
        setTime(newTime);
    }

    function handleMuteClick() {
        setIsMuted(prev => !prev);
    }

    // Progress Bar
    const radius = 200;
    const dashoffset = (radius*Math.PI*2) - ((radius*Math.PI*2) * progressPercent) / 100;

    return (
        <div className="metronome-container">
            {/* SVG background */}
            <svg className="svg-progress-background" viewBox="0 0 420 420" version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                <circle cx="210" cy="210" r={radius} 
                    stroke={active ? "#848484" : "#6BBAFF" }
                    strokeWidth="5px"
                    fill="transparent"/>
            </svg> 
            {/* SVG progress bar */}
            <svg className="svg-progress" viewBox="0 0 420 420" version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                <circle cx="210" cy="210" r={radius} 
                    strokeWidth="15px"
                    strokeLinecap="round"
                    strokeDasharray={radius*Math.PI*2}
                    strokeDashoffset={dashoffset >= 0 ? dashoffset : 0}
                    fill="transparent"/>
            </svg>  
            <div className="mtn-circle">
                <div className="volume-container">
                    <div className="btn-volume" onClick={handleMuteClick}>
                        {volumeIcon}
                    </div>
                    <input
                        type="range"
                        ref={inputVolume}
                        defaultValue="0"
                        onChange={(e) => {
                            setVolume(e.target.value / 100);
                            // Save to Local Storage as well
                            localStorage.setItem('volume', e.target.value / 100)
                        }}
                    />
                </div>
                <div className="rpm-container">
                    <h3 className="label-aside" style={labelStyle}>BPM</h3>
                    <input id="rpm"
                        type="number"
                        ref={inputBpm}
                        defaultValue="85"
                        onChange={(e) => {
                            setBpm(e.target.value);
                            // Save to Local Storage as well
                            localStorage.setItem('bpm', e.target.value)
                        }}></input>
                </div>
                <TrainingGraph active={active} secondsPassed={secondsPassed} bpm={bpm} time={time} handleTimeChange={handleTimeChange} />
                <div className="controls-container">
                    { isPaused &&
                        <button id="stop" 
                        className="btn-metronome finish"
                        onClick={handleStopButtonClick}
                    >
                        Finish
                    </button>}
                    <button id="activate" 
                        className={btnClass}
                        onClick={handlePlayPauseButtonClick}
                    >
                        {!isPaused ? (active ? "Pause" : "Start") : "Resume"}
                    </button>
                </div>
            </div>
        </div>
  )
}

export default Metronome