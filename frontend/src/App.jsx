import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/admin/Dashboard';
import TopicList from './pages/admin/TopicList';
import CreateTopic from './pages/admin/CreateTopic';
import TopicDetail from './pages/admin/TopicDetail';
import Documents from './pages/admin/Documents';
import UploadDocument from './pages/admin/UploadDocument';
import DocumentDetail from './pages/admin/DocumentDetail';
import Friends from './pages/admin/Friends';
import MyLibrary from './pages/admin/MyLibrary';
import ClientSidebar from './components/ClientSidebar/ClientSidebar';
import Home from './pages/client/Home';
import Library from './pages/client/Library';
import Roadmap from './pages/client/Roadmap';
import Uploads from './pages/client/Uploads';
import Favorites from './pages/client/Favorites';
import StudyGroups from './pages/client/StudyGroups';
import Preferences from './pages/client/Preferences';
import HelpCenter from './pages/client/HelpCenter';
import LibraryDetail from './pages/client/LibraryDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <div className="flex">
            {/* Sidebar displayed on all admin pages */}
            <Sidebar />
            
            {/* Main content area for admin */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="topics" element={<TopicList />} />
              <Route path="topics/create" element={<CreateTopic />} />
              <Route path="topics/:id" element={<TopicDetail />} />
              <Route path="documents" element={<Documents />} />
              <Route path="documents/:id" element={<DocumentDetail />} />
              <Route path="upload" element={<UploadDocument />} />
              <Route path="friends" element={<Friends />} />
              <Route path="library" element={<MyLibrary />} />
            </Routes>
          </div>
        } />

        {/* Client Routes */}
        <Route path="*" element={
          <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-[#111318] dark:text-white font-display overflow-hidden antialiased">
             <ClientSidebar />
             <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/library" element={<Library />} />
               <Route path="/library/:id" element={<LibraryDetail />} />
               <Route path="/roadmap" element={<Roadmap />} />
               <Route path="/uploads" element={<Uploads />} />
               <Route path="/favorites" element={<Favorites />} />
               <Route path="/study-groups" element={<StudyGroups />} />
               <Route path="/preferences" element={<Preferences />} />
               <Route path="/help-center" element={<HelpCenter />} />
               <Route path="*" element={<Home />} />
             </Routes>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;

