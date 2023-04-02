import InteractiveGrid from './components/InteractiveGrid';
import ControlPanel from './components/ControlPanel';
import DropdownList from './components/DropdownList';

function App() {
  return (
    <div className="app-container">
      <DropdownList />
      <InteractiveGrid />
      <ControlPanel />
    </div>
  );
}

export default App;
