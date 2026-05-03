import React, { useState, useEffect, useCallback } from 'react';
import api from './api/axios';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import BoardPage from './pages/BoardPage';
import PostDetailPage from './pages/PostDetailPage';
import WritePage from './pages/WritePage';
import ProfilePage from './pages/ProfilePage';
import NotificationPage from './pages/NotificationPage';

const SCHOOL_NOTICE_CATEGORIES = ['일반', '학사', '교직', '취업프로그램', '채용공고', '장학/봉사', '행사', '기금'];

function App() {
  const [page, setPage] = useState('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [boardCategory, setBoardCategory] = useState('게시판메인');
  const [selectedPost, setSelectedPost] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 1500);
  };

  const getCurrentUserId = () => localStorage.getItem('userId') || '';

  const getAuthorId = (item) => {
    if (!item) return '';
    if (typeof item.user_id === 'object' && item.user_id !== null) return item.user_id._id || item.user_id.id || '';
    return item.user_id || item.authorId || '';
  };

  const mapComment = useCallback((comment) => {
    const currentUserId = getCurrentUserId();
    const authorId = getAuthorId(comment);
    const isMine = Boolean(currentUserId && authorId && String(authorId) === String(currentUserId)) || comment.is_mine === true;
    const authorName = comment.user_id?.nickname || comment.nickname || '익명';

    return {
      ...comment,
      id: comment._id || comment.id,
      authorId,
      author: isMine ? '익명(나)' : authorName,
      authorEmail: comment.user_id?.email || comment.email || '',
      content: comment.content,
      likes: Number(comment.like_count) || 0,
      isLiked: comment.is_liked || comment.isLiked || false,
      isMine,
      date: comment.created_at || comment.date || new Date().toISOString(),
    };
  }, []);

  const mapPost = useCallback((item) => {
    const currentUserId = getCurrentUserId();
    const authorId = getAuthorId(item);
    const isMine = Boolean(currentUserId && authorId && String(authorId) === String(currentUserId)) || item.is_mine === true;
    const isNotice = item.notice_scope === 'school' || item.notice_scope === 'department';
    const authorName = item.user_id?.nickname || item.nickname || '익명';
    const comments = Array.isArray(item.comments) ? item.comments.map(mapComment) : [];
    const myCommentCountFromComments = comments.filter((comment) => comment.authorId && String(comment.authorId) === String(currentUserId)).length;

    return {
      ...item,
      id: item._id || item.id,
      category: item.notice_scope === 'school' ? '학교 공지' : item.notice_scope === 'department' ? '학과 공지' : item.board_type === 'major' ? '전공 게시판' : '자유 게시판',
      noticeCategory: isNotice ? (item.notice_category || item.original_category || item.category || '일반') : undefined,
      authorId,
      author: isNotice ? '관리자' : isMine ? '익명(나)' : authorName,
      authorEmail: item.user_id?.email || item.email || '',
      date: item.published_at || item.created_at || new Date().toISOString(),
      likes: Number(item.like_count) || 0,
      comments_count: Number(item.comment_count) || comments.length || 0,
      isLiked: item.is_liked || item.isLiked || false,
      isMine,
      hasMyComment: item.has_my_comment === true || Number(item.my_comment_count) > 0 || myCommentCountFromComments > 0,
      myCommentCount: Number(item.my_comment_count) || myCommentCountFromComments || 0,
      comments,
    };
  }, [mapComment]);

  const getItems = (result) => {
    if (result.status !== 'fulfilled') return [];
    const body = result.value.data;
    if (Array.isArray(body.data)) return body.data;
    if (Array.isArray(body.data?.items)) return body.data.items;
    if (Array.isArray(body.posts)) return body.posts;
    if (Array.isArray(body.items)) return body.items;
    return [];
  };

  const fetchCommentsForPost = useCallback(async (mappedPost) => {
    if (!mappedPost?.id || mappedPost.notice_scope) return mappedPost;

    try {
      const response = await api.get(`/api/posts/${mappedPost.id}/comments`);
      const comments = Array.isArray(response.data.data) ? response.data.data.map(mapComment) : [];
      const currentUserId = getCurrentUserId();
      const myCommentCount = comments.filter((comment) => comment.authorId && String(comment.authorId) === String(currentUserId)).length;
      return {
        ...mappedPost,
        comments,
        comments_count: comments.length,
        hasMyComment: mappedPost.hasMyComment || myCommentCount > 0,
        myCommentCount: mappedPost.myCommentCount || myCommentCount,
      };
    } catch (error) {
      return mappedPost;
    }
  }, [mapComment]);

  const addNotification = (title, content, targetPostId) => {
    const newNoti = { id: Date.now(), title, content, isRead: false, targetPostId };
    setNotifications(prev => [newNoti, ...prev]);
    showToast('새로운 알림이 도착했습니다!');
  };

  const fetchAlarms = useCallback(async () => {
    const savedToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (!savedToken || savedToken === 'undefined' || savedToken === 'null') return;

    try {
      const response = await api.get('/api/alarms');
      const alarmItems = Array.isArray(response.data.data) ? response.data.data : [];
      const mappedAlarms = alarmItems.map((alarm) => ({
        ...alarm,
        id: alarm.alarm_id || alarm._id,
        title: alarm.alarm_type === 'notice' ? '공지 알림' : '댓글 알림',
        content: alarm.alarm_body,
        isRead: false,
        targetPostId: alarm.post_id,
        targetNoticeId: alarm.notice_id,
        date: alarm.created_at,
      }));

      const seenAlarmKeys = new Set();
      const uniqueMappedAlarms = mappedAlarms.filter((alarm) => {
        const key = alarm.alarm_type === 'notice' && alarm.targetNoticeId
          ? `notice:${alarm.targetNoticeId}`
          : alarm.alarm_type === 'comment' && alarm.comment_id
            ? `comment:${alarm.comment_id}`
            : `${alarm.alarm_type}:${alarm.targetPostId || ''}:${alarm.content || ''}`;

        if (seenAlarmKeys.has(key)) return false;
        seenAlarmKeys.add(key);
        return true;
      });

      setNotifications(uniqueMappedAlarms);
    } catch (error) {
      console.error('[API 에러] 알림 로드 실패:', error);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    const savedToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (!savedToken || savedToken === 'undefined' || savedToken === 'null') return;

    try {
      const schoolNoticeRequests = SCHOOL_NOTICE_CATEGORIES.map((noticeCategory) =>
        api.get('/api/notices/school', {
          params: { category: noticeCategory, page: 1, limit: 1000 }
        })
      );

      const [freeRes, majorRes, deptNoticeRes, likedRes, myPostsRes, myCommentsRes, ...schoolNoticeResults] = await Promise.allSettled([
        api.get('/api/posts', { params: { board_type: 'free' } }),
        api.get('/api/posts', { params: { board_type: 'major' } }),
        api.get('/api/notices/department', { params: { page: 1, limit: 1000 } }),
        api.get('/api/posts/liked'),
        api.get('/api/posts/my'),
        api.get('/api/comments/my'),
        ...schoolNoticeRequests
      ]);

      const getPostId = (p) => p?._id || p?.id || p?.post_id?._id || p?.post_id || '';
      const getUniqueItemsById = (items) => {
        const seen = new Set();
        return items.filter((item) => {
          const id = String(item?._id || item?.id || item?.source_url || item?.title || '');
          if (!id || seen.has(id)) return false;
          seen.add(id);
          return true;
        });
      };

      const schoolNoticeItems = getUniqueItemsById(
        schoolNoticeResults.flatMap((result) => getItems(result))
      );

      const likedPostItems = getItems(likedRes);
      const likedPostIds = new Set(likedPostItems.map(getPostId).filter(Boolean).map(String));

      const myPostItems = getItems(myPostsRes);
      const myPostIds = new Set(myPostItems.map(getPostId).filter(Boolean).map(String));

      const myCommentItems = getItems(myCommentsRes);
      const myCommentCountByPostId = new Map();
      const myCommentPostItems = [];

      myCommentItems.forEach((comment) => {
        const post = comment.post_id;
        const postId = typeof post === 'object' && post !== null ? (post._id || post.id) : post;
        if (!postId) return;

        const key = String(postId);
        myCommentCountByPostId.set(key, (myCommentCountByPostId.get(key) || 0) + 1);

        if (typeof post === 'object' && post !== null) {
          myCommentPostItems.push({
            ...post,
            has_my_comment: true,
            my_comment_count: myCommentCountByPostId.get(key),
          });
        }
      });

      const boardData = [
        ...getItems(freeRes).map(p => ({ ...p, board_type: 'free' })),
        ...getItems(majorRes).map(p => ({ ...p, board_type: 'major' }))
      ];

      const boardDataIds = new Set(boardData.map((p) => String(p._id || p.id)));
      const missingLikedData = likedPostItems
        .filter((p) => !boardDataIds.has(String(p._id || p.id)))
        .map((p) => ({ ...p, is_liked: true }));
      const missingMyPostData = myPostItems
        .filter((p) => !boardDataIds.has(String(p._id || p.id)))
        .map((p) => ({ ...p, is_mine: true }));
      const missingMyCommentPostData = myCommentPostItems
        .filter((p) => !boardDataIds.has(String(p._id || p.id)))
        .map((p) => ({
          ...p,
          has_my_comment: true,
          my_comment_count: myCommentCountByPostId.get(String(p._id || p.id)) || p.my_comment_count || 1,
        }));

      const allData = [
        ...boardData.map((p) => {
          const postId = String(p._id || p.id);
          return {
            ...p,
            is_liked: likedPostIds.has(postId) || p.is_liked === true,
            is_mine: myPostIds.has(postId) || p.is_mine === true,
            has_my_comment: myCommentCountByPostId.has(postId) || p.has_my_comment === true,
            my_comment_count: myCommentCountByPostId.get(postId) || p.my_comment_count || 0,
          };
        }),
        ...missingLikedData,
        ...missingMyPostData,
        ...missingMyCommentPostData,
        ...schoolNoticeItems.map(p => ({ ...p, notice_scope: 'school', notice_category: p.category || '일반' })),
        ...getItems(deptNoticeRes).map(p => ({ ...p, notice_scope: 'department', notice_category: p.category || '일반' }))
      ];

      const mappedPosts = allData
        .map(mapPost)
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      const postsWithComments = await Promise.all(mappedPosts.map(fetchCommentsForPost));

      setPosts(postsWithComments);
    } catch (error) {
      console.error('[API 에러] 데이터 통합 로드 실패:', error);
    }
  }, [fetchCommentsForPost, mapPost]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchPosts();
      fetchAlarms();
    }
  }, [isLoggedIn, boardCategory, fetchPosts, fetchAlarms]);

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (loginStatus === 'true' && token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    setPosts([]);
    setNotifications([]);
    setPage('main');
    showToast('로그아웃 되었습니다.');
  };

  const renderPage = () => {
    const commonProps = {
      setPage,
      isLoggedIn,
      showToast,
      posts,
      setPosts,
      setSelectedPost,
      setBoardCategory,
      fetchPosts,
      fetchAlarms
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
