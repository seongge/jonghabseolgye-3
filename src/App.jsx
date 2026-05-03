import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
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
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // 토스트 알림 함수
  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 1500);
  };

  // 알림 추가 함수
  const addNotification = (title, content, targetPostId) => {
    const newNoti = { id: Date.now(), title, content, isRead: false, targetPostId };
    setNotifications(prev => [newNoti, ...prev]);
    showToast('새로운 알림이 도착했습니다!');
  };

  // 게시글 및 공지사항 데이터 통합 불러오기
  const fetchPosts = useCallback(async () => {
    const savedToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (!savedToken || savedToken === 'undefined' || savedToken === 'null') return;

    try {
      const cleanToken = savedToken.replace('Bearer ', '').trim();
      const headers = {
        'Authorization': `Bearer ${cleanToken}`,
        'Content-Type': 'application/json'
      };

      const postsUrl = 'http://localhost:5000/api/posts';
      const noticeUrl = 'http://localhost:5000/api/notices';

      // 1. 일반 게시글(자유/전공)과 공지사항(학교/학과)을 병렬로 요청
      const [freeRes, majorRes, schoolNoticeRes, deptNoticeRes] = await Promise.allSettled([
        axios.get(postsUrl, { params: { board_type: 'free' }, headers }),
        axios.get(postsUrl, { params: { board_type: 'major' }, headers }),
        axios.get(`${noticeUrl}/school`, { headers }),
        axios.get(`${noticeUrl}/department`, { headers })
      ]);

      // 성공한 데이터만 추출하는 헬퍼 함수
      const getItems = (res) => (res.status === 'fulfilled' ? (res.value.data.data || res.value.data.posts || []) : []);

      // 2. 모든 데이터를 하나의 배열로 통합 (각 데이터에 구분자 추가)
      const allData = [
        ...getItems(freeRes).map(p => ({ ...p, board_type: 'free' })),
        ...getItems(majorRes).map(p => ({ ...p, board_type: 'major' })),
        ...getItems(schoolNoticeRes).map(p => ({ ...p, notice_scope: 'school' })),
        ...getItems(deptNoticeRes).map(p => ({ ...p, notice_scope: 'department' }))
      ];

      // 3. UI에서 사용하기 쉽게 데이터 매핑
      const mappedPosts = allData.map(item => ({
        ...item,
        id: item._id || item.id,
        author: item.user_id?.nickname || item.nickname || (item.notice_scope ? '관리자' : '익명'),
        authorEmail: item.user_id?.email || item.email, 
        date: item.published_at || item.created_at || new Date().toISOString(),
        likes: Number(item.like_count) || 0,
        comments_count: Number(item.comment_count) || (item.comments?.length) || 0,
        isLiked: item.is_liked || false,
        comments: item.comments || []
      }));

      setPosts(mappedPosts);
    } catch (error) {
      console.error("[API 에러] 데이터 통합 로드 실패:", error);
    }
  }, []);

  // 로그인 상태거나 카테고리가 바뀔 때 데이터 갱신
  useEffect(() => {
    if (isLoggedIn) fetchPosts();
  }, [isLoggedIn, boardCategory, fetchPosts]);

  // 앱 실행 시 로컬 스토리지 확인 (로그인 유지)
  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (loginStatus === 'true' && token) {
      setIsLoggedIn(true);
    }
  }, []);

  // 로그아웃 처리
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    setPage('main');
    showToast('로그아웃 되었습니다.');
  };

  // 페이지 라우팅
  const renderPage = () => {
    const commonProps = { 
      setPage, 
      isLoggedIn, 
      showToast, 
      posts, 
      setPosts, 
      setSelectedPost, 
      setBoardCategory,
      fetchPosts 
    };
    
    switch (page) {
      case 'login': 
        return <LoginPage setIsLoggedIn={setIsLoggedIn} setPage={setPage} setBoardCategory={setBoardCategory} />;
      case 'signup': 
        return <SignupPage setPage={setPage} />;
      case 'main': 
        return <MainPage {...commonProps} unreadCount={notifications.filter(n => !n.isRead).length} />;
      case 'board': 
        return <BoardPage {...commonProps} category={boardCategory} />;
      case 'postDetail': 
        return <PostDetailPage {...commonProps} post={selectedPost} addNotification={addNotification} />;
      case 'write': 
        return <WritePage {...commonProps} category={boardCategory} fetchPosts={fetchPosts} />;
      case 'profile': 
        return <ProfilePage {...commonProps} setIsLoggedIn={handleLogout} />;
      case 'notifications': 
        return <NotificationPage {...commonProps} notifications={notifications} setNotifications={setNotifications} />;
      default: 
        return <MainPage {...commonProps} />;
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

// 스타일 정의
const toastContainerStyle = {
  position: 'fixed',
  bottom: '100px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 9999,
  width: '100%',
  maxWidth: '480px',
  display: 'flex',
  justifyContent: 'center',
  pointerEvents: 'none'
};

const toastBoxStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '25px',
  fontSize: '14px',
  fontWeight: '500',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  textAlign: 'center'
};

export default App;