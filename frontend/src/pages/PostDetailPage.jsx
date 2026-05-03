import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { IoIosArrowBack, IoMdHeart, IoIosHeartEmpty, IoMdSend, IoMdMore, IoMdThumbsUp, IoIosThumbsUp } from 'react-icons/io';

export default function PostDetailPage({ setPage, post, setPosts, posts, setSelectedPost, isLoggedIn, showToast }) {
  const [commentInput, setCommentInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post?.title || '');
  const [editContent, setEditContent] = useState(post?.content || '');

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentValue, setEditCommentValue] = useState('');

  const postId = post?._id || post?.id;
  const isNotice = post?.category === '학교 공지' || post?.category === '학과 공지' || post?.notice_scope === 'school' || post?.notice_scope === 'department';

  const getAuthorId = (item) => {
    if (!item) return '';
    if (typeof item.user_id === 'object' && item.user_id !== null) return item.user_id._id || item.user_id.id || '';
    return item.user_id || item.authorId || '';
  };

  const mapComment = (comment) => {
    const currentUserId = localStorage.getItem('userId') || '';
    const authorId = getAuthorId(comment);
    const isMine = Boolean(currentUserId && authorId && String(authorId) === String(currentUserId)) || comment.is_mine === true;
    const authorName = comment.user_id?.nickname || comment.nickname || '익명';

    return {
      ...comment,
      id: comment._id || comment.id,
      authorId,
      author: isMine ? '익명(나)' : authorName,
      authorEmail: comment.user_id?.email || comment.email || '',
      likes: Number(comment.like_count) || comment.likes || 0,
      isLiked: comment.is_liked || comment.isLiked || false,
      date: comment.created_at || comment.date || new Date().toISOString(),
    };
  };

  const updatePostInState = (updatedPost) => {
    const updatedPosts = posts.map(p => (p.id === postId || p._id === postId) ? updatedPost : p);
    setPosts(updatedPosts);
    setSelectedPost(updatedPost);
  };

  useEffect(() => {
    setEditTitle(post?.title || '');
    setEditContent(post?.content || '');
  }, [post?.id, post?._id, post?.title, post?.content]);

  useEffect(() => {
    if (!postId || isNotice || !isLoggedIn) return;

    const fetchComments = async () => {
      try {
        const response = await api.get(`/api/posts/${postId}/comments`);
        const comments = Array.isArray(response.data.data) ? response.data.data.map(mapComment) : [];
        const currentUserId = localStorage.getItem('userId') || '';
        const myCommentCount = comments.filter(c => c.authorId && String(c.authorId) === String(currentUserId)).length;
        const updatedPost = {
          ...post,
          comments,
          comments_count: comments.length,
          comment_count: comments.length,
          hasMyComment: myCommentCount > 0,
          myCommentCount,
        };
        const updatedPosts = posts.map(p => (p.id === postId || p._id === postId) ? updatedPost : p);
        setPosts(updatedPosts);
        setSelectedPost(updatedPost);
      } catch (error) {
        console.error('댓글 조회 실패:', error);
      }
    };

    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, isNotice, isLoggedIn]);

  if (!post) return null;

  const handleSaveEdit = async () => {
    try {
      const response = await api.put(`/api/posts/${postId}`, {
        title: editTitle,
        content: editContent,
      });

      const updatedPost = {
        ...post,
        ...response.data.data,
        id: response.data.data?._id || postId,
        title: response.data.data?.title || editTitle,
        content: response.data.data?.content || editContent,
        author: '익명(나)',
        isMine: true,
      };

      updatePostInState(updatedPost);
      setIsEditing(false);
      setShowMenu(false);
      showToast('게시글이 수정되었습니다.');
    } catch (error) {
      showToast(error.response?.data?.message || '게시글 수정에 실패했습니다.');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('삭제하시겠습니까?')) return;

    try {
      await api.delete(`/api/posts/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId && p._id !== postId));
      setPage('board');
      showToast('삭제되었습니다.');
    } catch (error) {
      showToast(error.response?.data?.message || '게시글 삭제에 실패했습니다.');
    }
  };

  const handlePostLike = async () => {
    if (!isLoggedIn) {
      showToast('로그인 후 이용 가능합니다.');
      return;
    }

    try {
      const response = await api.post(`/api/posts/${postId}/like`);
      const liked = response.data.liked;
      const likeCount = Number(response.data.like_count) || 0;

      const updatedPost = {
        ...post,
        likes: likeCount,
        like_count: likeCount,
        isLiked: liked,
        is_liked: liked,
      };

      updatePostInState(updatedPost);
      showToast(response.data.message);
    } catch (error) {
      console.error('좋아요 처리 에러:', error);
      showToast(error.response?.data?.message || '좋아요 처리에 실패했습니다.');
    }
  };

  const handleCommentLike = async (commentId) => {
    if (!isLoggedIn) {
      showToast('로그인 후 이용 가능합니다.');
      return;
    }

    try {
      const response = await api.post(`/api/comments/${commentId}/like`);
      const liked = response.data.liked;
      const likeCount = Number(response.data.like_count) || 0;

      const updatedComments = (post.comments || []).map(c => {
        if (c.id === commentId || c._id === commentId) {
          return {
            ...c,
            likes: likeCount,
            like_count: likeCount,
            isLiked: liked,
          };
        }
        return c;
      });

      const updatedPost = { ...post, comments: updatedComments };
      updatePostInState(updatedPost);
    } catch (error) {
      showToast(error.response?.data?.message || '댓글 좋아요 처리에 실패했습니다.');
    }
  };

  const handleAddComment = async () => {
    if (!isLoggedIn) {
      showToast('로그인이 필요합니다.');
      return;
    }
    if (!commentInput.trim()) return;

    try {
      const response = await api.post(`/api/posts/${postId}/comments`, {
        content: commentInput,
      });

      const newComment = mapComment(response.data.data);
      const updatedComments = [...(post.comments || []), newComment];
      const myCommentCount = updatedComments.filter(c => c.author === '익명(나)').length;
      const updatedPost = {
        ...post,
        comments: updatedComments,
        comments_count: updatedComments.length,
        comment_count: updatedComments.length,
        hasMyComment: myCommentCount > 0,
        myCommentCount,
      };

      updatePostInState(updatedPost);
      setCommentInput('');
      showToast('댓글이 작성되었습니다.');
    } catch (error) {
      showToast(error.response?.data?.message || '댓글 작성에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/api/comments/${commentId}`);
      const updatedComments = (post.comments || []).filter(c => c.id !== commentId && c._id !== commentId);
      const myCommentCount = updatedComments.filter(c => c.author === '익명(나)').length;
      const updatedPost = {
        ...post,
        comments: updatedComments,
        comments_count: updatedComments.length,
        comment_count: updatedComments.length,
        hasMyComment: myCommentCount > 0,
        myCommentCount,
      };
      updatePostInState(updatedPost);
      showToast('댓글이 삭제되었습니다.');
    } catch (error) {
      showToast(error.response?.data?.message || '댓글 삭제에 실패했습니다.');
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editCommentValue.trim()) return;

    try {
      const response = await api.put(`/api/comments/${commentId}`, {
        content: editCommentValue,
      });

      const updatedComment = mapComment(response.data.data);
      const updatedComments = (post.comments || []).map(c => (c.id === commentId || c._id === commentId) ? updatedComment : c);
      const updatedPost = { ...post, comments: updatedComments };
      updatePostInState(updatedPost);
      setEditingCommentId(null);
      showToast('댓글이 수정되었습니다.');
    } catch (error) {
      showToast(error.response?.data?.message || '댓글 수정에 실패했습니다.');
    }
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <IoIosArrowBack style={backIconStyle} onClick={() => setPage('board')} />
        <h2 style={headerTitleStyle}>{post.category}</h2>
        <IoMdMore
          style={{ fontSize: '24px', color: isNotice || post.author !== '익명(나)' ? 'transparent' : '#333', cursor: isNotice || post.author !== '익명(나)' ? 'default' : 'pointer' }}
          onClick={() => !isNotice && post.author === '익명(나)' && setShowMenu(!showMenu)}
        />
        {showMenu && (
          <div style={dropdownStyle}>
            <div onClick={() => { setIsEditing(true); setShowMenu(false); }} style={dropdownItemStyle}>수정</div>
            <div onClick={handleDeletePost} style={{ ...dropdownItemStyle, color: '#FF3B30' }}>삭제</div>
          </div>
        )}
      </header>

      <main style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
        <div style={profileSectionStyle}>
          <div style={avatarStyle}>👤</div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{post.author}</div>
            <div style={{ fontSize: '12px', color: '#adb5bd' }}>{new Date(post.date || post.created_at || post.published_at).toLocaleString()}</div>
          </div>
        </div>

        {isEditing ? (
          <div>
            <input style={inputStyle} value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            <textarea style={textAreaStyle} value={editContent} onChange={(e) => setEditContent(e.target.value)} />
            <button style={saveButtonStyle} onClick={handleSaveEdit}>저장</button>
          </div>
        ) : (
          <>
            <h2 style={postTitleStyle}>{post.title}</h2>
            <p style={postContentStyle}>{post.content}</p>
          </>
        )}

        {!isNotice && (
          <>
            <div style={likeSectionStyle} onClick={handlePostLike}>
              {post.isLiked ? <IoMdHeart color="#FF3366" size={20} /> : <IoIosHeartEmpty size={20} />}
              <span style={{ fontWeight: 'bold', color: post.isLiked ? '#FF3366' : '#333' }}>{post.likes}</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '25px 0' }} />
            {post.comments?.map(c => {
              const isAuthor = c.authorId && c.authorId === post.authorId;
              const isMyComment = c.author === '익명(나)';
              return (
                <div key={c.id || c._id} style={commentCardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '13px', color: isAuthor ? '#003366' : '#333' }}>{c.author}</div>
                      {isAuthor && <span style={authorBadgeStyle}>작성자</span>}
                    </div>
                    {isMyComment && editingCommentId !== (c.id || c._id) && (
                      <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#adb5bd' }}>
                        <span style={{ cursor: 'pointer' }} onClick={() => { setEditingCommentId(c.id || c._id); setEditCommentValue(c.content); }}>수정</span>
                        <span style={{ cursor: 'pointer', color: '#FF3B30' }} onClick={() => handleDeleteComment(c.id || c._id)}>삭제</span>
                      </div>
                    )}
                  </div>
                  {editingCommentId === (c.id || c._id) ? (
                    <div style={{ marginTop: '5px' }}>
                      <input style={commentEditInputStyle} value={editCommentValue} onChange={(e) => setEditCommentValue(e.target.value)} />
                      <div style={{ display: 'flex', gap: '10px', marginTop: '5px', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: '12px', color: '#adb5bd', cursor: 'pointer' }} onClick={() => setEditingCommentId(null)}>취소</span>
                        <span style={{ fontSize: '12px', color: '#003366', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleUpdateComment(c.id || c._id)}>완료</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '14px', color: '#444' }}>{c.content}</div>
                  )}
                  <div style={commentLikeAreaStyle} onClick={() => handleCommentLike(c.id || c._id)}>
                    {c.isLiked ? <IoMdThumbsUp color="#003366" size={16} /> : <IoIosThumbsUp size={16} color="#adb5bd" />}
                    <span style={{ fontSize: '12px', color: c.isLiked ? '#003366' : '#adb5bd', fontWeight: 'bold' }}>
                      {c.likes || 0}
                    </span>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </main>

      {!isNotice && (
        <div style={bottomInputAreaStyle}>
          <input
            style={isLoggedIn ? commentInputStyle : disabledInputStyle}
            placeholder={isLoggedIn ? '댓글을 입력하세요...' : '로그인 후 댓글을 작성할 수 있습니다.'}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            readOnly={!isLoggedIn}
            onClick={() => { if(!isLoggedIn) showToast('로그인이 필요합니다.'); }}
          />
          <IoMdSend style={{ fontSize: '24px', color: isLoggedIn ? '#003366' : '#adb5bd', cursor: 'pointer' }} onClick={handleAddComment} />
        </div>
      )}
    </div>
  );
}

const containerStyle = { width: '100%', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', position: 'relative' };
const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '50px 20px 15px', borderBottom: '1px solid #eee', position: 'relative' };
const backIconStyle = { fontSize: '26px', color: '#555', cursor: 'pointer' };
const headerTitleStyle = { fontSize: '16px', fontWeight: 'bold', color: '#003366' };
const dropdownStyle = { position: 'absolute', right: '20px', top: '80px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '12px', zIndex: 100 };
const dropdownItemStyle = { padding: '12px 20px', fontSize: '14px', cursor: 'pointer', borderBottom: '1px solid #eee' };
const profileSectionStyle = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' };
const avatarStyle = { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f3f5', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' };
const postTitleStyle = { fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#333' };
const postContentStyle = { lineHeight: '1.6', color: '#444', fontSize: '15px' };
const likeSectionStyle = { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '20px', cursor: 'pointer', width: 'fit-content' };
const commentCardStyle = { padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '15px', marginBottom: '10px' };
const bottomInputAreaStyle = { padding: '15px 20px', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#fff' };
const commentInputStyle = { flex: 1, padding: '12px 20px', borderRadius: '100px', border: '1px solid #eee', backgroundColor: '#f8f9fa', outline: 'none' };
const disabledInputStyle = { ...commentInputStyle, backgroundColor: '#f1f3f5', color: '#adb5bd', cursor: 'pointer' };
const inputStyle = { width: '100%', padding: '12px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '10px', boxSizing: 'border-box' };
const textAreaStyle = { width: '100%', minHeight: '150px', padding: '12px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '10px', boxSizing: 'border-box' };
const saveButtonStyle = { width: '100%', padding: '12px', backgroundColor: '#003366', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' };
const authorBadgeStyle = { fontSize: '10px', color: '#fff', backgroundColor: '#003366', borderRadius: '4px', padding: '2px 5px', marginLeft: '5px' };
const commentLikeAreaStyle = { display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', width: 'fit-content', cursor: 'pointer' };
const commentEditInputStyle = { width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #eee', boxSizing: 'border-box' };
