import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IoMdMegaphone,
    IoMdChatbubbles,
    IoMdPerson,
    IoIosSearch,
    IoIosNotifications,
    IoMdHome,
    IoMdSchool,
    IoMdNotifications,
    IoMdCreate,
    IoMdHeart,
    IoMdClipboard,
    IoMdCalendar
} from 'react-icons/io';
import mainLogo from '../assets/MainPageLogo.png';

function MainPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('홈');

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <img src={mainLogo} alt="메인 로고" style={mainLogoStyle} onClick={() => navigate('/home')} />
                <div style={{ display: 'flex', gap: '15px' }}>
                    <IoIosSearch style={{ fontSize: '24px', color: '#003366', cursor: 'pointer' }} />
                    <IoIosNotifications style={{ fontSize: '24px', color: '#003366', cursor: 'pointer' }} />
                </div>
            </header>

            <main style={contentStyle}>
                <div style={hotCardStyle}>
                    <span style={tagStyle}>HOT</span>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>[공지] 기말고사 일정 안내</span>
                </div>

                <div style={{ height: '20px' }}></div>

                <div style={loginAreaStyle}>
                    <button style={mainLoginButtonStyle} onClick={() => navigate('/login')}>로그인</button>
                </div>

                <div style={menuGridStyle}>
                    <div style={menuItemStyle}>
                        <IoMdHome style={menuIconStyle} />
                        <span style={menuTextStyle}>학교 홈페이지</span>
                    </div>
                    <div style={menuItemStyle} onClick={() => navigate('/board')}>
                        <IoMdClipboard style={menuIconStyle} />
                        <span style={menuTextStyle}>게시판</span>
                    </div>
                    <div style={menuItemStyle}>
                        <IoMdNotifications style={menuIconStyle} />
                        <span style={menuTextStyle}>공지사항</span>
                    </div>
                </div>

                <div style={popularCardStyle}>
                    <b style={{ fontSize: '16px', color: '#003366', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                        실시간 인기글
                    </b>
                    <div style={popItemStyle}>
                        <div style={{ fontSize: '14px' }}>배달 같이 시키실 분?</div>
                        <div style={{ fontSize: '11px', color: '#868e96', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                            자유 | <IoMdHeart style={{ color: '#FF3366' }} /> 15
                        </div>
                    </div>
                    <div style={popItemStyle}>
                        <div style={{ fontSize: '14px' }}>이번 시험 난이도 실화냐..</div>
                        <div style={{ fontSize: '11px', color: '#868e96', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                            자유 | <IoMdHeart style={{ color: '#FF3366' }} /> 12
                        </div>
                    </div>
                </div>

                <div style={calendarCardStyle}>
                    <b style={{ fontSize: '16px', color: '#003366', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                        <IoMdCalendar style={{ fontSize: '20px' }} /> 이번 달 학교 일정
                    </b>
                    <div style={popItemStyle}>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>4/10</div>
                        <div style={{ fontSize: '13px', color: '#444' }}>4.19혁명 기념 동국인 등산대회</div>
                    </div>
                    <div style={popItemStyle}>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>4/14 ~ 4/27</div>
                        <div style={{ fontSize: '13px', color: '#444' }}>2026학년도 1학기 중간시험</div>
                    </div>
                    <div style={popItemStyle}>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>4/28 ~ 4/30</div>
                        <div style={{ fontSize: '13px', color: '#444' }}>취득교과목 학점 포기 신청</div>
                    </div>
                </div>

                <div style={writeButtonContainerStyle}>
                    <button style={writeButtonStyle}>
                        <IoMdCreate style={{ fontSize: '20px' }} /> 새 글 작성하기
                    </button>
                </div>
            </main>

            <nav style={bottomNavStyle}>
                <div style={activeTab === '홈' ? activeNavItemStyle : navItemStyle} onClick={() => setActiveTab('홈')}>
                    <IoMdHome style={navIconStyle} />
                    <span style={navTextStyle}>홈</span>
                </div>
                <div style={activeTab === '커뮤니티' ? activeNavItemStyle : navItemStyle} onClick={() => { setActiveTab('커뮤니티'); navigate('/board'); }}>
                    <IoMdChatbubbles style={navIconStyle} />
                    <span style={navTextStyle}>커뮤니티</span>
                </div>
                <div style={activeTab === '내 정보' ? activeNavItemStyle : navItemStyle} onClick={() => setActiveTab('내 정보')}>
                    <IoMdPerson style={navIconStyle} />
                    <span style={navTextStyle}>내 정보</span>
                </div>
            </nav>
        </div>
    );
}

const containerStyle = { width: '100%', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f8f9fa', position: 'relative', paddingBottom: '80px' };
const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#fff', borderBottom: '1px solid #eee' };
const mainLogoStyle = { height: '45px', width: 'auto', cursor: 'pointer', objectFit: 'contain' };

const contentStyle = {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 145px)',
    boxSizing: 'border-box'
};

const hotCardStyle = { backgroundColor: '#fff', padding: '15px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' };
const tagStyle = { backgroundColor: '#FF3B30', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', marginRight: '10px' };
const loginAreaStyle = { padding: '0 20px', marginBottom: '20px' };
const mainLoginButtonStyle = { width: '100%', padding: '16px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '100px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' };
const menuGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '25px' };
const menuItemStyle = { textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const menuIconStyle = { fontSize: '32px', color: '#003366', marginBottom: '8px' };
const menuTextStyle = { fontSize: '12px', fontWeight: '600', color: '#333' };
const popularCardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '15px' };
const popItemStyle = { padding: '10px 0', borderBottom: '1px solid #f1f3f5' };
const calendarCardStyle = { ...popularCardStyle, marginBottom: '20px' };

const writeButtonContainerStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingBottom: '40px'
};

const writeButtonStyle = { width: '100%', padding: '16px', backgroundColor: '#003366', color: '#fff', border: 'none', borderRadius: '100px', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(0,51,102,0.2)', cursor: 'pointer' };
const bottomNavStyle = { position: 'fixed', bottom: 0, width: '100%', maxWidth: '480px', height: '75px', backgroundColor: '#fff', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100, paddingBottom: '10px' };
const navItemStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#adb5bd', cursor: 'pointer' };
const activeNavItemStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#003366', cursor: 'pointer' };
const navIconStyle = { fontSize: '24px', marginBottom: '4px' };
const navTextStyle = { fontSize: '12px', fontWeight: '600' };

export default MainPage;