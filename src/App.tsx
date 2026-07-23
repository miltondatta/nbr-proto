import { Theme } from './settings/types';
import { CBMSApplicationShell } from './components/generated/CBMSApplicationShell';

let theme: Theme = 'light';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  return (
    <>
      <CBMSApplicationShell />
    </>);
  // %EXPORT_STATEMENT%
}

export default App;