import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TopicList from './pages/TopicList';
import CreateTopic from './pages/CreateTopic';
import TopicDetail from './pages/TopicDetail';
import Documents from './pages/Documents';
import UploadDocument from './pages/UploadDocument';
import DocumentDetail from './pages/DocumentDetail';
import Friends from './pages/Friends';
import MyLibrary from './pages/MyLibrary';

function App() {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar displayed on all pages */}
        <Sidebar />
        
        {/* Main content area with routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/topics" element={<TopicList />} />
          <Route path="/topics/create" element={<CreateTopic />} />
          <Route path="/topics/:id" element={<TopicDetail />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/documents/:id" element={<DocumentDetail />} />
          <Route path="/upload" element={<UploadDocument />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/library" element={<MyLibrary />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

