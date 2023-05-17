import { Route } from 'react-router-dom';
import kanjiContext from './contexts/kanjiContext';
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
import AuthRequired from './components/routing/AuthRequired';
import ProfilePage from './pages/ProfilePage';
import useAxiosInterceptors from './hooks/useAxiosInterceptors';
import FeedbackPage from './pages/FeedbackPage';
import EditKanjisPage from './pages/EditKanjisPage';
import EditUserPage from './pages/EditUserPage';
import { useRef } from 'react';

const App = () => {
  const mainRef = useRef<HTMLElement>(null);

  useAxiosInterceptors();

  return (
    <div className="App">
      <Header />
      <Nav />
      <main role="main" ref={mainRef}>
        <AnimatedRoutes>
          <Route index element={<NavigateOnce to="popular" />} />
          <Route path="popular" element={<PopularPage mainRef={mainRef} />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="selected" element={<SelectedPage />} />
          <Route path="learn">
            <Route index element={<NavigateOnce to="by-meaning" />} />
            <Route path="by-meaning" element={<LearnByMeaningPage />} />
            <Route path="by-writing" element={<LearnByWritingPage />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />

          <Route element={<AuthRequired />}>
            <Route path="user">
              <Route index element={<ProfilePage />} />
              <Route path="edit" element={<EditUserPage />} />
            </Route>
            <Route path="saved" element={<SavedKanjiPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
          </Route>
          <Route element={<AuthRequired allowedRoles={['Admin']} />}>
            <Route path="edit/*" element={<EditKanjisPage />} />
          </Route>
        </AnimatedRoutes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
