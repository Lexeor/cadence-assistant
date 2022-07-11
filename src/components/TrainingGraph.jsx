import React, {useEffect} from 'react'

function TrainingGraph({active, secondsPassed, bpm, time, handleTimeChange}) {
    const bars = [ 85, 85, 100, 85, 85, 100, 85, 100, 85, 85, 100, 85 ];

    const barDuration = time / 12;
    const blinkTime = 60/bpm*2;

    // Setting up blink time
    useEffect(() => {
      let root = document.documentElement;
      root.style.setProperty('--blink-time', `${blinkTime}s`);
    }, [bpm])
    
    const activeBar = () => {
      return Math.floor(secondsPassed/barDuration);
    };

    // Styles
    const barStyle = {
      width: `${98 / bars.length}%`,
    }
    const graphStyle = {
      display: active ? 'flex' : 'none',
    };
    const inputStyle = {
      display: active ? 'none' : 'flex',
    };

    const barsHtml = bars.map((item, idx) => {
      const isActive = idx === activeBar();
      const barClass = `bar${isActive ? ' bar-active' : ''}${idx < activeBar() ? ' bar-passed' : ''}`;

      return <div key={idx} className={barClass} style={barStyle}></div>
    });

    function getFancyTime(s) {
        return (s-(s%=60))/60+(9<s?':':':0')+s;
    }

  return (
    <div className="graph-container">
      <div className="timer-input" style={inputStyle}>
        <h3 className="label-aside">Mins</h3>
        <input id="training-time"
          type="number"
          defaultValue={time/60}
          onChange={(e) => {
            handleTimeChange(e.target.value*60);
          }}></input>
      </div>
      <div className="graph" style={graphStyle}>
          {barsHtml}
      </div>
      <div className="timer" style={graphStyle}>
          {getFancyTime(secondsPassed)} / {getFancyTime(time)}
      </div>
    </div>
  )
}

export default TrainingGraph