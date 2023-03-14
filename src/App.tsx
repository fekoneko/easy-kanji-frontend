import { Routes, Route, Navigate } from 'react-router-dom';
import { KanjiContextProvider } from './contexts/kanjiContext';
import Footer from './elements/Footer';
import Header from './elements/Header';
import Nav from './elements/Nav';
import LearnByMeaningPage from './pages/LearnByMeaningPage';
import LearnByWritingPage from './pages/LearnByWritingPage';
import PopularPage from './pages/PopularPage';
import SavedKanjiPage from './pages/SavedKanjiPage';
import SearchPage from './pages/SearchPage';
import SelectedPage from './pages/SelectedPage';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Nav />
      <KanjiContextProvider>
        <Routes>
          <Route path="/">
            <Route index element={<Navigate to="popular" />} />
            <Route path="popular" element={<PopularPage />} />
            <Route path="saved" element={<SavedKanjiPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="selected" element={<SelectedPage />} />
          </Route>
          <Route path="/learn">
            <Route index element={<Navigate to="by-meaning" />} />
            <Route path="by-meaning" element={<LearnByMeaningPage />} />
            <Route path="by-writing" element={<LearnByWritingPage />} />
          </Route>
        </Routes>
      </KanjiContextProvider>
      <Footer />
    </div>
  );
};

export default App;
