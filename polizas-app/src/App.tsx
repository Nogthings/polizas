import AppProviders from '@presentation/providers/AppProviders';
import AppRouter from '@presentation/router/AppRouter';
import './index.css';

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;
