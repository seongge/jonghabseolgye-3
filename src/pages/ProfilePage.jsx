import React, { useEffect, useState } from 'react';
import { IoIosArrowBack, IoMdHome, IoMdChatbubbles, IoMdPerson, IoMdLogOut, IoMdClipboard, IoMdHeart, IoMdLock, IoMdText } from 'react-icons/io';

export default function ProfilePage({ isLoggedIn, setIsLoggedIn, setPage, posts, setBoardCategory, showToast }) {
  const [userInfo, setUserInfo] = useState({
    name: '',
    studentId: '',
    department: '컴퓨터공학과'
  });

  useEffect(() => {
    if (isLoggedIn) {
      const savedName = localStorage.getItem('userName') || '사용자';
      const savedId = localStorage.getItem('studentId') || '학번 미설정';
      const savedDept = localStorage.getItem('userDept') || '컴퓨터공학과';
      
      setUserInfo({
        name: savedName,
        studentId: savedId,
        department: savedDept
      });
    }
  }, [isLoggedIn]);

  // 2. 실제 데이터 기반 카운트 계산 (데이터 매칭 강화)
  const currentUserEmail = localStorage.getItem('userEmail');
  const currentUserName = localStorage.getItem('userName');

  // 내가 작성한 글 카운트 (이메일 없으면 이름으로 체크)
  const myPostsCount = posts 
    ? posts.filter(p => (p.authorEmail && p.authorEmail === currentUserEmail) || (p.author === currentUserName)).length 
    : 0;

  // 좋아요 표시한 글 카운트
  const likedPostsCount = posts 
    ? posts.filter(p => p.isLiked === true || (Array.isArray(p.likedUsers) && p.likedUsers.includes(currentUserEmail))).length 
    : 0;

  // 내가 작성한 댓글 카운트
  const myCommentsCount = posts 
    ? posts.filter(p => Array.isArray(p.comments) && p.comments.some(c => 
        (c.authorEmail && c.authorEmail === currentUserEmail) || (c.author === currentUserName)
      )).length 
    : 0;

  const handleLogout = () => {
    localStorage.clear(); // 모든 정보 삭제
    setIsLoggedIn(false);
    setPage('main');
    if (showToast) showToast('로그아웃 되었습니다.');
  };

  const handleMenuClick = (categoryName) => {
    setBoardCategory(categoryName);
    setPage('board');
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <IoIosArrowBack style={backIconStyle} onClick={() => setPage('main')} />
        <h2 style={headerTitleStyle}>내 정보</h2>
        <div style={{ width: '26px' }} />
      </header>

      <main style={{ padding: '20px' }}>
        {!isLoggedIn ? (
          <div style={loginGuideCardStyle}>
            <div style={lockCircleStyle}><IoMdLock size={40} color="#adb5bd" /></div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>로그인이 필요합니다</h3>
            <p style={{ color: '#868e96', fontSize: '14px', marginBottom: '25px', lineHeight: '1.5' }}>
              로그인하시면 내가 쓴 글과<br />작성한 댓글을 확인할 수 있습니다.
            </p>
            <button style={loginRedirectButtonStyle} onClick={() => setPage('login')}>로그인 하러가기</button>
          </div>
        ) : (
          <>
            <div style={profileCardStyle}>
              <div style={largeAvatarStyle}>👤</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '15px 0 5px' }}>
                {userInfo.name} ({userInfo.studentId})
              </h3>
              <p style={{ color: '#868e96', fontSize: '14px' }}>{userInfo.department}</p>
            </div>

            <div style={{ ...menuItemStyle, marginBottom: '12px' }} onClick={() => handleMenuClick('내가 작성한 글')}>
              <div style={menuLabelStyle}><IoMdClipboard size={20} color="#003366" /><span>내가 작성한 글</span></div>
              <span style={countStyle}>{myPostsCount}개</span>
            </div>

            <div style={{ ...menuItemStyle, marginBottom: '12px' }} onClick={() => handleMenuClick('내가 작성한 댓글')}>
              <div style={menuLabelStyle}><IoMdText size={20} color="#00D1D1" /><span>내가 작성한 댓글</span></div>
              <span style={{ ...countStyle, color: '#00D1D1' }}>{myCommentsCount}개</span>
            </div>

            <div style={menuItemStyle} onClick={() => handleMenuClick('좋아요 표시한 글')}>
              <div style={menuLabelStyle}><IoMdHeart size={20} color="#FF3366" /><span>좋아요 표시한 글</span></div>
              <span style={{ color: '#FF3366', fontWeight: 'bold' }}>{likedPostsCount}개</span>
            </div>

            <button style={logoutButtonStyle} onClick={handleLogout}>
              <IoMdLogOut size={20} /> 로그아웃
            </button>
          </>
        )}
      </main>

      <nav style={bottomNavStyle}>
        <div style={navItemStyle} onClick={() => setPage('main')}><IoMdHome size={24} /><span style={{ fontSize: '12px' }}>홈</span></div>
        <div style={navItemStyle} onClick={() => { setBoardCategory('게시판메인'); setPage('board'); }}><IoMdChatbubbles size={24} /><span style={{ fontSize: '12px' }}>게시판</span></div>
        <div style={activeNavItemStyle}><IoMdPerson size={24} /><span style={{ fontSize: '12px' }}>내 정보</span></div>
      </nav>
    </div>
  );
}

// 스타일 정의는 기존과 동일
const containerStyle = { width: '100%', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f8f9fa', position: 'relative', paddingBottom: '80px' };
const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '50px 20px 15px', backgroundColor: '#fff', borderBottom: '1px solid #eee' };
const backIconStyle = { fontSize: '26px', color: '#555', cursor: 'pointer' };
const headerTitleStyle = { fontSize: '18px', fontWeight: 'bold', color: '#003366', margin: 0 };
const profileCardStyle = { backgroundColor: '#fff', padding: '40px 20px', borderRadius: '24px', textAlign: 'center', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const largeAvatarStyle = { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f1f3f5', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '40px' };
const menuItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#fff', borderRadius: '20px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' };
const menuLabelStyle = { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600' };
const countStyle = { color: '#003366', fontWeight: 'bold' };
const logoutButtonStyle = { width: '100%', padding: '16px', backgroundColor: '#FF3B30', color: '#fff', border: 'none', borderRadius: '100px', fontWeight: 'bold', fontSize: '16px', marginTop: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };
const bottomNavStyle = { position: 'fixed', bottom: 0, width: '100%', maxWidth: '480px', height: '75px', backgroundColor: '#fff', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100, paddingBottom: '10px' };
const navItemStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#adb5bd', cursor: 'pointer' };
const activeNavItemStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#003366', cursor: 'pointer' };
const loginGuideCardStyle = { backgroundColor: '#fff', padding: '60px 20px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginTop: '40px' };
const lockCircleStyle = { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f8f9fa', margin: '0 auto 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const loginRedirectButtonStyle = { padding: '14px 40px', backgroundColor: '#003366', color: '#fff', border: 'none', borderRadius: '100px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' };