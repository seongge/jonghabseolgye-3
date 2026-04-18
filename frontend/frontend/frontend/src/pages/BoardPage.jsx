import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack, IoIosSearch, IoMdHome, IoMdChatbubbles, IoMdPerson, IoMdHeart, IoMdText } from 'react-icons/io';

function BoardPage() {
    const navigate = useNavigate();
    const [gradeFilter, setGradeFilter] = useState('전체');
    const [activeTab, setActiveTab] = useState('커뮤니티');

    const dummyPosts = [
        { id: 1, title: '배달 같이 시키실 분?', category: '자유', date: '2026.04.16', likes: 15, comments: 3, grade: '전체' },
        { id: 2, title: '4학년 졸업작품 공지', category: '학년별', date: '2026.04.15', likes: 25, comments: 10, grade: '4' },
        { id: 7, title: '3학년 전공 필수 질문', category: '학년별', date: '2026.04.15', likes: 12, comments: 5, grade: '3' },
    ];

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <IoIosArrowBack style={backIconStyle} onClick={() => navigate(-1)} />
                <h2 style={headerTitleStyle}>커뮤니티</h2>
                <IoIosSearch style={{ fontSize: '24px', color: '#003366', cursor: 'pointer' }} />
            </header>

            <div style={filterAreaStyle}>
                {['전체', '1', '2', '3', '4'].map((g) => (
                    <button key={g} onClick={() => setGradeFilter(g)} style={gradeFilter === g ? activeFilterStyle : inactiveFilterStyle}>
                        {g === '전체' ? '전체' : `${g}학년`}
                    </button>
                ))}
            </div>

            <main style={contentStyle}>
                {dummyPosts
                    .filter((p) => gradeFilter === '전체' || p.grade === gradeFilter)
                    .map((p) => (
                        <div key={p.id} style={postCardStyle} onClick={() => navigate(`/post/${p.id}`)}>
                            <div style={postMetaStyle}>{p.date} | {p.category} {p.grade !== '전체' && `(${p.grade}학년)`}</div>
                            <div style={postTitleStyle}>{p.title}</div>
                            <div style={postStatStyle}>
                <span style={{ color: '#FF3366', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IoMdHeart /> {p.likes}
                </span>
                                <span style={{ color: '#00D1D1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IoMdText /> {p.comments}
                </span>
                            </div>
                        </div>
                    ))}
            </main>

            <nav style={bottomNavStyle}>
                <div style={navItemStyle} onClick={() => navigate('/home')}>
                    <IoMdHome style={navIconStyle} />
                    <span style={navTextStyle}>홈</span>
                </div>
                <div style={activeNavItemStyle}>
                    <IoMdChatbubbles style={navIconStyle} />
                    <span style={navTextStyle}>커뮤니티</span>
                </div>
                <div style={navItemStyle}>
                    <IoMdPerson style={navIconStyle} />
                    <span style={navTextStyle}>내 정보</span>
                </div>
            </nav>
        </div>
    );
}

const containerStyle = { width: '100%', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f8f9fa', position: 'relative', paddingBottom: '80px' };
const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', backgroundColor: '#fff', borderBottom: '1px solid #eee' };
const backIconStyle = { fontSize: '26px', color: '#555', cursor: 'pointer' };
const headerTitleStyle = { fontSize: '18px', fontWeight: 'bold', color: '#003366', margin: 0 };
const filterAreaStyle = { display: 'flex', gap: '8px', padding: '15px 20px', backgroundColor: '#fff', overflowX: 'auto' };
const inactiveFilterStyle = { padding: '8px 16px', borderRadius: '100px', border: '1px solid #e9ecef', backgroundColor: '#f8f9fa', color: '#868e96', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' };
const activeFilterStyle = { ...inactiveFilterStyle, backgroundColor: '#003366', color: '#fff', border: '1px solid #003366' };
const contentStyle = { padding: '10px 16px' };
const postCardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '20px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer' };
const postMetaStyle = { fontSize: '11px', color: '#adb5bd', marginBottom: '4px' };
const postTitleStyle = { fontSize: '15px', fontWeight: 'bold', color: '#333', marginBottom: '8px' };
const postStatStyle = { fontSize: '12px', fontWeight: '600', display: 'flex', gap: '15px' };
const bottomNavStyle = { position: 'fixed', bottom: 0, width: '100%', maxWidth: '480px', height: '75px', backgroundColor: '#fff', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100, paddingBottom: '10px' };
const navItemStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#adb5bd', cursor: 'pointer' };
const activeNavItemStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#003366', cursor: 'pointer' };
const navIconStyle = { fontSize: '24px', marginBottom: '4px' };
const navTextStyle = { fontSize: '12px', fontWeight: '600' };

export default BoardPage;