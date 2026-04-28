import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import BoardPage from './pages/BoardPage';
import PostDetailPage from './pages/PostDetailPage';
import WritePage from './pages/WritePage';
import ProfilePage from './pages/ProfilePage';
import NotificationPage from './pages/NotificationPage';

function App() {
  const [page, setPage] = useState('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [boardCategory, setBoardCategory] = useState('게시판메인');
  const [selectedPost, setSelectedPost] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const [notifications, setNotifications] = useState([
    { id: 1, title: '쪽지가 도착했습니다.', content: '과제 같이 하실래요?', isRead: false, targetPostId: 3 },
  ]);

  const [posts, setPosts] = useState([
    {
      id: 1,
      category: '자유 게시판',
      title: '오늘 점심 돈까스 어때요?',
      content: '학식 돈까스 진짜 맛있어 보이던데 같이 먹을 사람?',
      author: '익명',
      likes: 12,
      isLiked: false,
      date: '10분 전',
      comments: [{ id: 101, author: '익명1', content: '오 저도 먹으러 가요!', date: '5분 전', likes: 2, isLiked: false }]
    },
    { id: 2, category: '학교 공지', title: '2026-1 수강신청 안내', content: '기간 내에 신청 바랍니다.', author: '학생처', likes: 5, isLiked: false, date: '2026.04.25', comments: [] },
    { id: 3, category: '학교 공지', title: '2026학년도 비교과 교육과정 안내', content: '기간 내에 신청 바랍니다.', author: '학생처', likes: 5, isLiked: false, date: '2026.04.25', comments: [] },
    { id: 4, category: '학교 공지', title: '2026학년도 4월 모의토익 고사장 안내', content: '기간 내에 신청 바랍니다.', author: '학생처', likes: 5, isLiked: false, date: '2026.04.25', comments: [] },
    { id: 5, category: '학교 공지', title: '2026학년도 1학기 취득교과목 학점 포기 신청 안내', content: '기간 내에 신청 바랍니다.', author: '학생처', likes: 5, isLiked: false, date: '2026.04.25', comments: [] },
    { id: 7, category: '학과 공지', title: '2026 학사제도 및 졸업이수가이드', content: '상세 일정은 공지사항 확인', author: '학과실', likes: 3, isLiked: false, date: '2026.04.24', comments: [] },
    { id: 8, category: '학과 공지', title: '2026-1 학기 학부 수강신청 실시 안내', content: '상세 일정은 공지사항 확인', author: '학과실', likes: 3, isLiked: false, date: '2026.04.24', comments: [] },
    { id: 9, category: '학과 공지', title: '2026학년도 1학기 창업동아리 모집 안내', content: '상세 일정은 공지사항 확인', author: '학과실', likes: 3, isLiked: false, date: '2026.04.24', comments: [] },
    { id: 10, category: '학과 공지', title: '컴퓨터공학과 졸업요건 추가 안내', content: '상세 일정은 공지사항 확인', author: '학과실', likes: 3, isLiked: false, date: '2026.04.24', comments: [] },
    { id: 13, category: '전공 게시판', title: '컴퓨터공학종합설계 질문', content: '보강 일정 언제인가요?', subCategory: '4학년', author: '익명', likes: 2, isLiked: false, date: '2시간 전', comments: [] },
    { id: 14, category: '전공 게시판', title: '자바프로그래밍 어렵나요?', content: '수업 어렵나요?', subCategory: '2학년', author: '익명', likes: 2, isLiked: false, date: '2시간 전', comments: [] }
  ]);

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 1500);
  };

  const renderPage = () => {
    switch (page) {
      case 'login': return <LoginPage setIsLoggedIn={setIsLoggedIn} setPage={setPage} setBoardCategory={setBoardCategory} />;
      case 'signup': return <SignupPage setPage={setPage} />;
      case 'main': return <MainPage setPage={setPage} setBoardCategory={setBoardCategory} unreadCount={notifications.filter(n => !n.isRead).length} posts={posts} isLoggedIn={isLoggedIn} showToast={showToast} setSelectedPost={setSelectedPost} />;
      case 'board':
        let displayPosts = [];
        if (boardCategory === '게시판메인') {
          displayPosts = posts;
        } else if (boardCategory === '내가 작성한 글') {
          displayPosts = posts.filter(p => p.author === '익명(나)');
        } else if (boardCategory === '내가 작성한 댓글') {
          displayPosts = posts.filter(p => p.comments?.some(c => c.author === '익명(나)'));
        } else if (boardCategory === '좋아요 표시한 글') {
          displayPosts = posts.filter(p => p.isLiked);
        } else {
          displayPosts = posts.filter(p => p.category === boardCategory);
        }
        return <BoardPage setPage={setPage} category={boardCategory} posts={displayPosts} setSelectedPost={setSelectedPost} setBoardCategory={setBoardCategory} isLoggedIn={isLoggedIn} showToast={showToast} />;
      case 'postDetail': return <PostDetailPage setPage={setPage} post={selectedPost} setPosts={setPosts} posts={posts} setSelectedPost={setSelectedPost} isLoggedIn={isLoggedIn} showToast={showToast} />;
      case 'write': return <WritePage setPage={setPage} setPosts={setPosts} category={boardCategory} />;
      case 'profile': return <ProfilePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setPage={setPage} posts={posts} setBoardCategory={setBoardCategory} showToast={showToast} />;
      case 'notifications': return <NotificationPage setPage={setPage} notifications={notifications} setNotifications={setNotifications} posts={posts} setSelectedPost={setSelectedPost} />;
      default: return <MainPage setPage={setPage} setBoardCategory={setBoardCategory} unreadCount={notifications.filter(n => !n.isRead).length} posts={posts} isLoggedIn={isLoggedIn} showToast={showToast} setSelectedPost={setSelectedPost} />;
    }
  };

  return (
    <div className="App" style={{ position: 'relative' }}>
      {renderPage()}
      {toast.visible && (
        <div style={toastContainerStyle}>
          <div style={toastBoxStyle}>{toast.message}</div>
        </div>
      )}
    </div>
  );
}

const toastContainerStyle = { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10000, pointerEvents: 'none', width: '100%', display: 'flex', justifyContent: 'center' };
const toastBoxStyle = { backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', padding: '14px 28px', borderRadius: '100px', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', textAlign: 'center' };

export default App;