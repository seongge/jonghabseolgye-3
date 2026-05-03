import React, { useEffect, useState } from 'react';
import {
  IoIosArrowBack,
  IoIosSearch,
  IoMdHome,
  IoMdChatbubbles,
  IoMdPerson,
  IoMdHeart,
  IoMdText,
  IoMdCreate,
  IoMdClose,
  IoMdMegaphone
} from 'react-icons/io';

export default function BoardPage({ setPage, category, posts, setSelectedPost, setBoardCategory, isLoggedIn, showToast }) {
  const [subCategory, setSubCategory] = useState('전체');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [noticePage, setNoticePage] = useState(1);

  const gradeFilters = ['전체', '1학년', '2학년', '3학년', '4학년'];
  const noticeFilters = ['전체', '일반', '학사', '교직', '취업프로그램', '채용공고', '장학/봉사', '행사', '기금'];

  const isSummaryView = category === '게시판메인';
  const isSchoolNotice = category === '학교 공지';
  const isDeptNotice = category === '학과 공지';
  const isNotice = isSchoolNotice || isDeptNotice;
  const isMajorBoard = category.includes('전공'); 
  const canWrite = category === '자유 게시판' || isMajorBoard;
  const isSpecialView = ['내가 작성한 글', '내가 작성한 댓글', '좋아요 표시한 글'].includes(category);

  const currentUserEmail = localStorage.getItem('userEmail');
  const currentUserName = localStorage.getItem('userName');
  const currentUserId = localStorage.getItem('userId') || '';

  // posts 데이터 구조 대응
  const postList = Array.isArray(posts) ? posts : (posts?.data || []);

  const getAuthorId = (item) => {
    if (!item) return '';
    if (typeof item.user_id === 'object' && item.user_id !== null) return item.user_id._id || item.user_id.id || '';
    return item.user_id || item.authorId || '';
  };

  const isMyPost = (post) => {
    const authorId = getAuthorId(post);
    return post.isMine === true || post.is_mine === true ||
      (currentUserId && authorId && String(authorId) === String(currentUserId)) ||
      (post.authorEmail && post.authorEmail === currentUserEmail) ||
      (post.author === currentUserName) ||
      (post.author === '익명(나)');
  };

  const isMyComment = (comment) => {
    const authorId = getAuthorId(comment);
    return comment.isMine === true || comment.is_mine === true ||
      (currentUserId && authorId && String(authorId) === String(currentUserId)) ||
      (comment.authorEmail && comment.authorEmail === currentUserEmail) ||
      (comment.author === currentUserName) ||
      (comment.author === '익명(나)');
  };

  const hasMyComment = (post) => {
    return post.hasMyComment === true || post.has_my_comment === true || Number(post.myCommentCount) > 0 || Number(post.my_comment_count) > 0 ||
      (Array.isArray(post.comments) && post.comments.some(isMyComment));
  };

  const normalizeCategory = (value = '') => String(value).replace(/\s+/g, '').trim();
  const getNoticeCategory = (post) => post.noticeCategory || post.notice_category || post.original_category || '일반';
  const isSearching = searchKeyword.trim() !== '';

  useEffect(() => {
    setNoticePage(1);
  }, [category, subCategory, searchKeyword]);

  const handleBack = () => {
    if (isSummaryView || isNotice || isSpecialView) {
      setPage(isSpecialView ? 'profile' : 'main');
    } else {
      setBoardCategory('게시판메인');
    }
  };

  const handleWriteClick = () => {
    if (!isLoggedIn) {
      showToast('로그인이 필요한 서비스입니다.');
    } else {
      setPage('write');
    }
  };

  const filteredPosts = postList.filter((p) => {
    let isMatch = true;

    // 1. 카테고리별 기본 필터링
    if (isSpecialView) {
      if (category === '내가 작성한 글') {
        isMatch = isMyPost(p);
      } else if (category === '내가 작성한 댓글') {
        isMatch = hasMyComment(p);
      } else if (category === '좋아요 표시한 글') {
        isMatch = p.isLiked === true || p.is_liked === true || (Array.isArray(p.likedUsers) && p.likedUsers.includes(currentUserEmail));
      }
    } 
    else if (!isSummaryView) {
      if (isMajorBoard) {
        isMatch = (p.board_type === 'major');
      } else if (category === '자유 게시판') {
        isMatch = (p.board_type === 'free');
      } 
      else if (isSchoolNotice) {
        isMatch = (p.notice_scope === 'school');
      } else if (isDeptNotice) {
        isMatch = (p.notice_scope === 'department');
      }
    }

    // 2. 세부 필터 적용 (학교 공지와 전공 게시판만 적용)
    if (isMatch && subCategory !== '전체' && !isSpecialView) {
      if (isMajorBoard) {
        const gradeValue = subCategory.replace('학년', '');
        const postGrades = Array.isArray(p.grade_filter) ? p.grade_filter.map(String) : [String(p.grade_filter)];
        isMatch = postGrades.some(g => g.includes(gradeValue) || g === subCategory);
      } else if (isSchoolNotice) { // 학과 공지는 필터링에서 제외
        isMatch = normalizeCategory(getNoticeCategory(p)) === normalizeCategory(subCategory);
      }
    }

    // 3. 검색어 필터링
    if (isMatch && searchKeyword.trim() !== '') {
      const keyword = searchKeyword.toLowerCase();
      isMatch = p.title?.toLowerCase().includes(keyword) || p.content?.toLowerCase().includes(keyword);
    }
    
    return isMatch;
  });

  const shouldPaginateNotices = isSchoolNotice && !isSearching;
  const noticePageSize = 10;
  const totalNoticePages = shouldPaginateNotices
    ? Math.max(1, Math.ceil(filteredPosts.length / noticePageSize))
    : 1;
  const safeNoticePage = Math.min(noticePage, totalNoticePages);
  const displayPosts = shouldPaginateNotices
    ? filteredPosts.slice((safeNoticePage - 1) * noticePageSize, safeNoticePage * noticePageSize)
    : filteredPosts;

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        {!isSearchOpen ? (
          <>
            <IoIosArrowBack style={backIconStyle} onClick={handleBack} />
            <h2 style={headerTitleStyle}>{isSummaryView ? '게시판' : category}</h2>
            {!isSummaryView && (
              <IoIosSearch style={{ fontSize: '24px', color: '#003366', cursor: 'pointer' }} onClick={() => setIsSearchOpen(true)} />
            )}
            {isSummaryView && <div style={{ width: '24px' }} />}
          </>
        ) : (
          <div style={searchBarWrapperStyle}>
            <IoIosArrowBack style={{ fontSize: '24px', color: '#555', cursor: 'pointer' }} onClick={() => { setIsSearchOpen(false); setSearchKeyword(''); setNoticePage(1); }} />
            <input 
              style={searchInputStyle} 
              placeholder="검색어를 입력하세요" 
              value={searchKeyword} 
              onChange={(e) => setSearchKeyword(e.target.value)} 
              autoFocus 
            />
            {searchKeyword && <IoMdClose style={{ fontSize: '20px', color: '#adb5bd', cursor: 'pointer' }} onClick={() => { setSearchKeyword(''); setNoticePage(1); }} />}
          </div>
        )}
      </header>

      {isSummaryView ? (
        <div style={{ padding: '20px' }}>
          <BoardSection 
            title="자유 게시판" 
            items={postList.filter(p => p.board_type === 'free').slice(0, 3)} 
            onMore={() => setBoardCategory('자유 게시판')} 
            onSelect={(p) => { setSelectedPost(p); setPage('postDetail'); }} 
          />
          <BoardSection 
            title="전공 게시판" 
            items={postList.filter(p => p.board_type === 'major').slice(0, 3)} 
            onMore={() => setBoardCategory('전공 게시판')} 
            onSelect={(p) => { setSelectedPost(p); setPage('postDetail'); }} 
          />
        </div>
      ) : (
        <>
          {/* 학교 공지 또는 전공 게시판일 때만 필터 바 노출 (학과 공지는 제외) */}
          {(isMajorBoard || isSchoolNotice) && !isSearchOpen && (
            <div style={filterAreaStyle}>
              {(isSchoolNotice ? noticeFilters : gradeFilters).map((f) => (
                <button key={f} onClick={() => { setSubCategory(f); setNoticePage(1); }} style={subCategory === f ? activeFilterStyle : inactiveFilterStyle}>
                  {f}
                </button>
              ))}
            </div>
          )}
          <main style={contentStyle}>
            {displayPosts.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#adb5bd', marginTop: '50px' }}>
                {isSpecialView ? `${category} 내역이 없습니다.` : "게시글이 없습니다."}
              </div>
            ) : (
              displayPosts.map((p) => (
                <div key={p._id || p.id} style={postCardStyle} onClick={() => { setSelectedPost(p); setPage('postDetail'); }}>
                  <div style={postMetaStyle}>
                    {/* 학과 공지는 무조건 '일반' 태그 표시, 학교 공지는 데이터의 실제 카테고리 표시 */}
                    {isNotice && <span style={noticeTagStyle}>{isDeptNotice ? '일반' : getNoticeCategory(p)}</span>}
                    {new Date(p.published_at || p.date || p.created_at).toLocaleDateString()} | {isNotice ? '관리자' : p.author}
                  </div>
                  <div style={postTitleStyle}>
                    {isNotice && <IoMdMegaphone style={{marginRight: '5px', color: '#003366'}} />}
                    {p.title}
                  </div>
                  {!isNotice && (
                    <div style={postStatStyle}>
                      <span style={{ color: '#FF3366', display: 'flex', alignItems: 'center', gap: '4px' }}><IoMdHeart /> {p.likes || 0}</span>
                      <span style={{ color: '#00D1D1', display: 'flex', alignItems: 'center', gap: '4px' }}><IoMdText /> {p.comments?.length || p.comments_count || p.comment_count || 0}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </main>
          {shouldPaginateNotices && totalNoticePages > 1 && (
            <div style={paginationStyle}>
              <button
                style={safeNoticePage === 1 ? disabledPageButtonStyle : pageButtonStyle}
                disabled={safeNoticePage === 1}
                onClick={() => setNoticePage((prev) => Math.max(prev - 1, 1))}
              >
                이전
              </button>
              <span style={pageInfoStyle}>{safeNoticePage} / {totalNoticePages}</span>
              <button
                style={safeNoticePage === totalNoticePages ? disabledPageButtonStyle : pageButtonStyle}
                disabled={safeNoticePage === totalNoticePages}
                onClick={() => setNoticePage((prev) => Math.min(prev + 1, totalNoticePages))}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}

      {canWrite && !isSummaryView && !isSearchOpen && (
        <button style={writeButtonStyle} onClick={handleWriteClick}>
          <IoMdCreate size={24} style={{ marginRight: '5px' }} />
          <span>글 쓰기</span>
        </button>
      )}

      <nav style={bottomNavStyle}>
        <div style={navItemStyle} onClick={() => setPage('main')}><IoMdHome size={24} /><span style={navTextStyle}>홈</span></div>
        <div style={activeNavItemStyle} onClick={() => { setBoardCategory('게시판메인'); setPage('board'); }}><IoMdChatbubbles size={24} /><span style={navTextStyle}>게시판</span></div>
        <div style={navItemStyle} onClick={() => setPage('profile')}><IoMdPerson size={24} /><span style={navTextStyle}>내 정보</span></div>
      </nav>
    </div>
  );
}

const BoardSection = ({ title, items, onMore, onSelect }) => (
  <div style={popularCardStyle}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
      <b style={{ color: '#003366' }}>{title}</b>
      <span style={{ fontSize: '12px', color: '#adb5bd', cursor: 'pointer' }} onClick={onMore}>더보기</span>
    </div>
    {items.length === 0 ? (
      <div style={{ fontSize: '14px', color: '#adb5bd', padding: '10px 0' }}>글이 없습니다.</div>
    ) : (
      items.map((post) => (
        <div key={post._id || post.id} onClick={() => onSelect(post)} style={popItemStyle}>{post.title}</div>
      ))
    )}
  </div>
);

// --- 스타일 상수 (기존과 동일) ---
const containerStyle = { width: '100%', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f8f9fa', position: 'relative', paddingBottom: '80px' };
const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '50px 20px 15px', backgroundColor: '#fff', borderBottom: '1px solid #eee' };
const backIconStyle = { fontSize: '26px', color: '#555', cursor: 'pointer' };
const headerTitleStyle = { fontSize: '18px', fontWeight: 'bold', color: '#003366' };
const searchBarWrapperStyle = { display: 'flex', alignItems: 'center', gap: '10px', width: '100%' };
const searchInputStyle = { flex: 1, border: 'none', backgroundColor: '#f1f3f5', padding: '10px 15px', borderRadius: '100px', outline: 'none' };
const filterAreaStyle = { display: 'flex', gap: '8px', padding: '15px 20px', backgroundColor: '#fff', overflowX: 'auto', WebkitOverflowScrolling: 'touch' };
const inactiveFilterStyle = { padding: '8px 16px', borderRadius: '100px', border: '1px solid #e9ecef', backgroundColor: '#f8f9fa', color: '#868e96', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' };
const activeFilterStyle = { ...inactiveFilterStyle, backgroundColor: '#003366', color: '#fff', border: '1px solid #003366' };
const contentStyle = { padding: '10px 16px' };
const postCardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '20px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer' };
const postMetaStyle = { fontSize: '11px', color: '#adb5bd', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' };
const postTitleStyle = { fontSize: '15px', fontWeight: 'bold', color: '#333', marginBottom: '8px', display: 'flex', alignItems: 'center' };
const postStatStyle = { fontSize: '12px', display: 'flex', gap: '15px' };
const noticeTagStyle = { backgroundColor: '#eef2ff', color: '#003366', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '10px' };
const popularCardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '24px', marginBottom: '15px' };
const popItemStyle = { padding: '10px 0', borderBottom: '1px solid #f1f3f5', fontSize: '14px', cursor: 'pointer' };
const paginationStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '8px 16px 20px' };
const pageButtonStyle = { border: '1px solid #003366', backgroundColor: '#fff', color: '#003366', borderRadius: '100px', padding: '8px 18px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' };
const disabledPageButtonStyle = { ...pageButtonStyle, border: '1px solid #e9ecef', color: '#adb5bd', cursor: 'not-allowed' };
const pageInfoStyle = { fontSize: '13px', color: '#495057', fontWeight: 'bold', minWidth: '48px', textAlign: 'center' };
const bottomNavStyle = { position: 'fixed', bottom: 0, width: '100%', maxWidth: '480px', height: '70px', backgroundColor: '#fff', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100 };
const navItemStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#adb5bd', cursor: 'pointer' };
const activeNavItemStyle = { ...navItemStyle, color: '#003366' };
const navTextStyle = { fontSize: '12px', marginTop: '4px' };
const writeButtonStyle = { position: 'fixed', bottom: '90px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#003366', color: '#fff', border: 'none', borderRadius: '100px', padding: '12px 24px', display: 'flex', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', cursor: 'pointer', zIndex: 99 };