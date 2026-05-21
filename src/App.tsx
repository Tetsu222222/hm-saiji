import SaijiForm from './components/SaijiForm';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>食品催事届</h1>
        <p>宇都宮市保健所 提出用フォーム</p>
      </header>
      <main>
        <SaijiForm />
      </main>
    </div>
  );
}
