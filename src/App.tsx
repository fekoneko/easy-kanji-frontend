import { Route } from 'react-router-dom';
import { KanjiContextProvider } from './contexts/kanjiContext';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import Nav from './components/layout/Nav';
import LearnByMeaningPage from './pages/LearnByMeaningPage';
import LearnByWritingPage from './pages/LearnByWritingPage';
import PopularPage from './pages/PopularPage';
import SavedKanjiPage from './pages/SavedKanjiPage';
import SearchPage from './pages/SearchPage';
import SelectedPage from './pages/SelectedPage';
import AnimatedRoutes from './components/routing/AnimatedRoutes';
import PageNotFound from './pages/PageNotFound';
import NavigateOnce from './components/routing/NavigateOnce';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Nav />
      <KanjiContextProvider>
        <main role="main">
          <AnimatedRoutes>
            <Route path="">
              <Route index element={<NavigateOnce to="popular" />} />
              <Route path="popular" element={<PopularPage />} />
              <Route path="saved" element={<SavedKanjiPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="selected" element={<SelectedPage />} />
            </Route>
            <Route path="learn">
              <Route index element={<NavigateOnce to="by-meaning" />} />
              <Route path="by-meaning" element={<LearnByMeaningPage />} />
              <Route path="by-writing" element={<LearnByWritingPage />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </AnimatedRoutes>
        </main>
        <Footer />
      </KanjiContextProvider>
    </div>
  );
};

export default App;
