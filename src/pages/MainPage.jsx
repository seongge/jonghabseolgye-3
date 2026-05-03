import React from 'react';
import {
    IoMdHome,
    IoMdSchool,
    IoMdLaptop,
    IoIosNotifications,
    IoMdHeart,
    IoMdPerson,
    IoMdChatbubbles
} from 'react-icons/io';
import mainLogo from '../assets/MainPageLogo.png';

export default function MainPage({ setPage, unreadCount, setBoardCategory, posts, isLoggedIn, showToast, setSelectedPost }) {
    // --- [로직 수정] 백엔드 데이터 필드(notice_scope)에 맞춰 필터링 ---
    const schoolNoticePreview = posts.filter(p => p.notice_scope === 'school').slice(0, 4);
    const deptNoticePreview = posts.filter(p => p.notice_scope === 'department' || p.notice_scope === 'dept').slice(0, 4);

    const handleNotificationClick = () => {
        if (!isLoggedIn) {
            showToast('로그인이 필요한 서비스입니다.');
        } else {
            setPage('notifications');
        }
    };

    const Section = ({ title, displayItems, isPopular }) => (
        <div style={popularCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <b style={{ fontSize: '16px', color: '#003366' }}>{title}</b>
                <span
                    style={{ fontSize: '12px', color: '#adb5bd', cursor: 'pointer' }}
                    onClick={() => {
                        setBoardCategory(title);
                        setPage('board');
                    }}
                >
                    더보기
                </span>
            </div>
            {displayItems.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#adb5bd' }}>게시글이 없습니다.</p>
            ) : (
                displayItems.map((post, idx) => (
                    <div 
                        key={post.id || post._id} 
                        onClick={() => { setSelectedPost(post); setPage('postDetail'); }} // 클릭 시 상세페이지 이동 추가
                        style={{
                            ...popItemStyle,
                            borderBottom: idx !== displayItems.length - 1 ? '1px solid #f1f3f5' : 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <p style={{ fontSize: '14px', flex: 1, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {post.title}
                        </p>
                        {isPopular && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FF3366' }}>
                                <IoMdHeart size={14} />
                                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{post.likes}</span>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <img src={mainLogo} alt="logo" style={mainLogoStyle} onClick={() => setPage('main')} />
                <div style={{ display: 'flex', gap: '15px', position: 'relative' }}>
                    <div onClick={handleNotificationClick} style={{ cursor: 'pointer', position: 'relative' }}>
                        <IoIosNotifications style={{ fontSize: '26px', color: '#003366' }} />
                        {unreadCount > 0 && (
                            <div style={badgeStyle}>{unreadCount}</div>
                        )}
                    </div>
                </div>
            </header>

            <div style={{ padding: '20px' }}>
                <div style={menuGridStyle}>
                    <div onClick={() => window.open('https://wise.dongguk.ac.kr')} style={menuItemStyle}>
                        <IoMdHome style={menuIconStyle} />
                        <p style={menuTextStyle}>학교홈</p>
                    </div>
                    <div onClick={() => window.open('https://ce.dongguk.ac.kr/')} style={menuItemStyle}>
                        <IoMdSchool style={menuIconStyle} />
                        <p style={menuTextStyle}>학과홈</p>
                    </div>
                    <div onClick={() => window.open('https://eclass.dongguk.ac.kr/')} style={menuItemStyle}>
                        <IoMdLaptop style={menuIconStyle} />
                        <p style={menuTextStyle}>E-CLASS</p>
                    </div>
                </div>

                <Section title="학교 공지" displayItems={schoolNoticePreview} />
                <Section title="학과 공지" displayItems={deptNoticePreview} />
            </div>

            <nav style={bottomNavStyle}>
                <div onClick={() => setPage('main')} style={activeNavItemStyle}>
                    <IoMdHome size={24} />
                    <p style={navTextStyle}>홈</p>
                </div>
                <div onClick={() => { setBoardCategory('게시판메인'); setPage('board'); }} style={navItemStyle}>
                    <IoMdChatbubbles size={24} />
                    <p style={navTextStyle}>게시판</p>
                </div>
                <div onClick={() => setPage('profile')} style={navItemStyle}>
                    <IoMdPerson size={24} />
                    <p style={navTextStyle}>내 정보</p>
                </div>
            </nav>
        </div>
    );
}

const containerStyle = { width: '100%', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f8f9fa', position: 'relative', paddingBottom: '80px' };
const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', backgroundColor: '#fff', borderBottom: '1px solid #eee' };
const mainLogoStyle = { height: '40px', width: 'auto', cursor: 'pointer', objectFit: 'contain' };
const menuGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '25px' };
const menuItemStyle = { textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const menuIconStyle = { fontSize: '32px', color: '#003366', marginBottom: '8px' };
const menuTextStyle = { fontSize: '12px', fontWeight: '600', color: '#333', marginTop: '5px' };
const popularCardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '15px' };
const popItemStyle = { padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const badgeStyle = { position: 'absolute', top: '-5px', right: '-5px', backgroundColor: 'red', color: 'white', fontSize: '10px', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' };
const bottomNavStyle = { position: 'fixed', bottom: 0, width: '100%', maxWidth: '480px', height: '75px', backgroundColor: '#fff', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100, paddingBottom: '10px' };
const navItemStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#adb5bd', cursor: 'pointer' };
const activeNavItemStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#003366', cursor: 'pointer' };
const navTextStyle = { fontSize: '12px', fontWeight: '600', marginTop: '4px' };