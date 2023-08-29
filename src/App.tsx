import { useEffect, useRef } from 'react';
import { Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import AnimatedRoutes from './components/routing/AnimatedRoutes';
import NavigateOnce from './components/routing/NavigateOnce';
import useAxiosInterceptors from './hooks/useAxiosInterceptors';
import AuthRequired from './components/routing/AuthRequired';
import PopularPage from './pages/PopularPage';
import SavedPage from './pages/SavedPage';
import SearchPage from './pages/SearchPage';
import SelectedPage from './pages/SelectedPage';
import LearnByMeaningPage from './pages/LearnByMeaningPage';
import LearnByWritingPage from './pages/LearnByWritingPage';
import FeedbackPage from './pages/FeedbackPage';
import ProfilePage from './pages/ProfilePage';
import EditKanjisPage from './pages/EditKanjisPage';
import EditUserPage from './pages/EditUserPage';
import PageNotFound from './pages/PageNotFound';
import useRefreshFunction from './hooks/useRefreshFunction';

const App = () => {
  const mainRef = useRef<HTMLElement>(null);
  const refresh = useRefreshFunction();

  useAxiosInterceptors();

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="flex h-full w-full flex-col">
      <Header />
      <Nav />
      <main
        role="main"
        ref={mainRef}
        className="app-paddings flex flex-grow flex-col overflow-x-hidden overflow-y-scroll"
      >
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
            <Route path="saved" element={<SavedPage />} />
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
