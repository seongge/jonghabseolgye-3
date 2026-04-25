import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import BoardPage from './pages/BoardPage';
import PostDetailPage from './pages/PostDetailPage';
import './index.css';

function App() {
    return (
        <Router>
            <Routes>
                {/* 첫 접속 시(/) 바로 메인 페이지가 뜨도록 설정 */}
                <Route path="/" element={<MainPage />} />

                {/* 나머지 경로들은 그대로 유지 */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/home" element={<MainPage />} />
                <Route path="/board" element={<BoardPage />} />
                <Route path="/post/:id" element={<PostDetailPage />} />
            </Routes>
        </Router>
    );
}

export default App;