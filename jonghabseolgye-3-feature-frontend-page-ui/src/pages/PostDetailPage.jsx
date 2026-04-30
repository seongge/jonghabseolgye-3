import React, { useState } from 'react';
import { IoIosArrowBack, IoMdHeart, IoIosHeartEmpty, IoMdSend, IoMdMore, IoMdThumbsUp, IoIosThumbsUp } from 'react-icons/io';

export default function PostDetailPage({ setPage, post, setPosts, posts, setSelectedPost, isLoggedIn, showToast, addNotification }) {
  const [commentInput, setCommentInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post?.title || '');
  const [editContent, setEditContent] = useState(post?.content || '');

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentValue, setEditCommentValue] = useState('');

  if (!post) return null;

  const isNotice = post.category === '학교 공지' || post.category === '학과 공지';

  const handleSaveEdit = () => {
    const updatedPosts = posts.map(p => p.id === post.id ? { ...p, title: editTitle, content: editContent } : p);
    setPosts(updatedPosts);
    setSelectedPost({ ...post, title: editTitle, content: editContent });
    setIsEditing(false);
    setShowMenu(false);
    showToast('게시글이 수정되었습니다.');
  };

  const handlePostLike = () => {
    if (!isLoggedIn) {
      showToast('로그인 후 이용 가능합니다.');
      return;
    }
    const isNowLiked = !post.isLiked;
    const updatedPosts = posts.map(p => p.id === post.id ? { ...p, likes: isNowLiked ? p.likes + 1 : p.likes - 1, isLiked: isNowLiked } : p);
    setPosts(updatedPosts);
    setSelectedPost({ ...post, likes: isNowLiked ? post.likes + 1 : post.likes - 1, isLiked: isNowLiked });
  };

  const handleCommentLike = (commentId) => {
    if (!isLoggedIn) {
      showToast('로그인 후 이용 가능합니다.');
      return;
    }
    const updatedComments = post.comments.map(c => {
      if (c.id === commentId) {
        const isNowLiked = !c.isLiked;
        return {
          ...c,
          likes: isNowLiked ? (c.likes || 0) + 1 : (c.likes || 0) - 1,
          isLiked: isNowLiked
        };
      }
      return c;
    });
    const updatedPosts = posts.map(p => p.id === post.id ? { ...p, comments: updatedComments } : p);
    setPosts(updatedPosts);
    setSelectedPost({ ...post, comments: updatedComments });
  };

  const handleAddComment = () => {
    if (!isLoggedIn) {
      showToast('로그인이 필요합니다.');
      return;
    }
    if (!commentInput.trim()) return;

    const newComment = { id: Date.now(), author: '익명(나)', content: commentInput, likes: 0, isLiked: false, date: '방금 전' };
    const updatedComments = [...(post.comments || []), newComment];
    const updatedPosts = posts.map(p => p.id === post.id ? { ...p, comments: updatedComments } : p);

    setPosts(updatedPosts);
    setSelectedPost({ ...post, comments: updatedComments });

    if (post.author === '익명(나)') {
      addNotification('새 댓글 알림', `내 게시글 "${post.title}"에 새로운 댓글이 달렸습니다.`, post.id);
    }

    setCommentInput('');
    showToast('댓글이 작성되었습니다.');
  };

  const handleDeleteComment = (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    const updatedComments = post.comments.filter(c => c.id !== commentId);
    const updatedPosts = posts.map(p => p.id === post.id ? { ...p, comments: updatedComments } : p);
    setPosts(updatedPosts);
    setSelectedPost({ ...post, comments: updatedComments });
    showToast('댓글이 삭제되었습니다.');
  };

  const handleUpdateComment = (commentId) => {
    if (!editCommentValue.trim()) return;
    const updatedComments = post.comments.map(c => c.id === commentId ? { ...c, content: editCommentValue } : c);
    const updatedPosts = posts.map(p => p.id === post.id ? { ...p, comments: updatedComments } : p);
    setPosts(updatedPosts);
    setSelectedPost({ ...post, comments: updatedComments });
    setEditingCommentId(null);
    showToast('댓글이 수정되었습니다.');
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
            <div onClick={() => { if(window.confirm("삭제하시겠습니까?")) { setPage('board'); showToast('삭제되었습니다.'); } }} style={{ ...dropdownItemStyle, color: '#FF3B30' }}>삭제</div>
          </div>
        )}
      </header>

      <main style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
        <div style={profileSectionStyle}>
          <div style={avatarStyle}>👤</div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{post.author}</div>
            <div style={{ fontSize: '12px', color: '#adb5bd' }}>{post.date}</div>
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
              const isAuthor = c.author === post.author;
              const isMyComment = c.author === '익명(나)';
              return (
                <div key={c.id} style={commentCardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '13px', color: isAuthor ? '#003366' : '#333' }}>{c.author}</div>
                      {isAuthor && <span style={authorBadgeStyle}>작성자</span>}
                    </div>
                    {isMyComment && editingCommentId !== c.id && (
                      <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#adb5bd' }}>
                        <span style={{ cursor: 'pointer' }} onClick={() => { setEditingCommentId(c.id); setEditCommentValue(c.content); }}>수정</span>
                        <span style={{ cursor: 'pointer', color: '#FF3B30' }} onClick={() => handleDeleteComment(c.id)}>삭제</span>
                      </div>
                    )}
                  </div>
                  {editingCommentId === c.id ? (
                    <div style={{ marginTop: '5px' }}>
                      <input style={commentEditInputStyle} value={editCommentValue} onChange={(e) => setEditCommentValue(e.target.value)} />
                      <div style={{ display: 'flex', gap: '10px', marginTop: '5px', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: '12px', color: '#adb5bd', cursor: 'pointer' }} onClick={() => setEditingCommentId(null)}>취소</span>
                        <span style={{ fontSize: '12px', color: '#003366', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleUpdateComment(c.id)}>완료</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '14px', color: '#444' }}>{c.content}</div>
                  )}
                  <div style={commentLikeAreaStyle} onClick={() => handleCommentLike(c.id)}>
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
            placeholder={isLoggedIn ? "댓글을 입력하세요..." : "로그인 후 댓글을 작성할 수 있습니다."}
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
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', marginBottom: '10px', outline: 'none' };
const textAreaStyle = { width: '100%', minHeight: '150px', padding: '12px', borderRadius: '8px', border: '1px solid #eee', outline: 'none', resize: 'none' };
const saveButtonStyle = { width: '100%', padding: '12px', backgroundColor: '#003366', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' };
const authorBadgeStyle = { fontSize: '10px', color: '#003366', backgroundColor: '#eef2ff', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px', fontWeight: 'bold' };
const commentEditInputStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' };
const commentLikeAreaStyle = { display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', cursor: 'pointer', width: 'fit-content' };