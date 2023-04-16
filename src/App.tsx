import { Route } from 'react-router-dom';
import { KanjiContextProvider } from './contexts/kanjiContext';
import Footer from './components/Footer';
import Header from './components/Header';
import Nav from './components/Nav';
import LearnByMeaningPage from './pages/LearnByMeaningPage';
import LearnByWritingPage from './pages/LearnByWritingPage';
import PopularPage from './pages/PopularPage';
import SavedKanjiPage from './pages/SavedKanjiPage';
import SearchPage from './pages/SearchPage';
import SelectedPage from './pages/SelectedPage';
import AnimatedRoutes from './components/AnimatedRoutes';
import PageNotFound from './pages/PageNotFound';
import ModalWindow from './components/ModalWindow';
import { ReactNode, useState } from 'react';
import NavigateOnce from './components/NavigateOnce';

export type showModalFunction = (modalContents: ReactNode) => any;
export type closeModalFunction = () => any;

const App = () => {
  const [modalWindowShown, setModalWindowShown] = useState(false);
  const [modalContents, setModalContents] = useState<ReactNode>(null);

  const showModal = (modalContents: ReactNode) => {
    setModalWindowShown(true);
    setModalContents(modalContents);
  };

  const closeModal = () => {
    setModalWindowShown(false);
  };

  return (
    <div className="App">
      <Header showModal={showModal} closeModal={closeModal} />
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
      <ModalWindow shown={modalWindowShown} handleClose={() => closeModal()}>
        {modalContents}
      </ModalWindow>
    </div>
  );
};

export default App;
