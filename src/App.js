import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Metronome from './components/Metronome';

function App() {
  return (
    <div className="App">
      <main>
        <div className="container-main">
            <Metronome />
        </div>
      </main>
    </div>
  );
}

export default App;