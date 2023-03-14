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
import AnimatedRoute from './elements/AnimatedRoute';
import PageNotFound from './pages/PageNotFound';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Nav />
      <KanjiContextProvider>
        <main role="main">
          <Routes>
            <Route path="/">
              <Route index element={<Navigate to="popular" />} />
              {['popular', 'saved', 'search', 'selected'].map((path, index) => (
                <Route
                  key={index}
                  path={path}
                  element={
                    <>
                      <AnimatedRoute absolutePath="/popular" element={<PopularPage />} />
                      <AnimatedRoute absolutePath="/saved" element={<SavedKanjiPage />} />
                      <AnimatedRoute absolutePath="/search" element={<SearchPage />} />
                      <AnimatedRoute absolutePath="/selected" element={<SelectedPage />} />
                    </>
                  }
                />
              ))}
            </Route>
            <Route path="/learn">
              <Route index element={<Navigate to="by-meaning" />} />
              <Route path="by-meaning" element={<LearnByMeaningPage />} />
              <Route path="by-writing" element={<LearnByWritingPage />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>
        <Footer />
      </KanjiContextProvider>
    </div>
  );
};

export default App;
