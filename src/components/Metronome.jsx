import React, { useState, useEffect, useRef } from 'react';
import TrainingGraph from './TrainingGraph';
import useSound from 'use-sound';
import useStayAwake from "use-stay-awake";

function Metronome() {
    const [active, setActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const [ticks, setTicks] = useState(0);
    const [time, setTime] = useState(40*60);
    const [volume, setVolume] = useState(0.25);
    const [bpm, setBpm] = useState(85);
    const [secondsPassed, setSecondsPassed] = useState(0);
    const inputVolume = useRef(null);
    const inputBpm = useRef(null);
    const soundUrl = '../sounds/tick2.mp3';
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
        soundUrl,
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


    const volumeIcon = () => {
        if (isMuted || volume === 0) {
            return <i className="ri-volume-mute-line"></i>;
        } else if (volume < .5) {
            return <i className="ri-volume-down-line"></i>;
        } else {
            return <i className="ri-volume-up-line"></i>;
        }
    }

    // BPM label indent
    const labelStyle = {
        right: bpm > 99 ? `60px` : `70px`,
    };

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

    // Handlers
    function handleTimeChange(newTime) {
        setTime(newTime);
    }

    function handleMuteClick() {
        setIsMuted(prev => !prev);
    }

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
                        {volumeIcon()}
                    </div>
                    <input
                        type="range"
                        ref={inputVolume}
                        defaultValue="0"
                        className="progressBarvolume"
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