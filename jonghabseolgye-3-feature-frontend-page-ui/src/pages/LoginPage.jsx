import React, { useState } from 'react';
import { IoIosArrowBack, IoMdHome, IoMdChatbubbles, IoMdPerson } from 'react-icons/io';
import logoImg from '../assets/MainPageLogo.png';

export default function LoginPage({ setIsLoggedIn, setPage, setBoardCategory }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('홈');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = (e) => {
        if (e) e.preventDefault();
        setErrorMessage('');

        // 빈칸 체크
        if (!email.trim() || !password.trim()) {
            setErrorMessage('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('올바른 이메일 형식이 아닙니다.');
            return;
        }

        //  가짜 데이터 검증 (백엔드 연동 전 테스트용)
        // 테스트용 계정: 이메일 'test@example.com', 비밀번호 '1234'
        if (email === 'test@example.com' && password === '1234') {
            setIsLoggedIn(true);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);

            setPage('main');
        } else {
            setErrorMessage('이메일 또는 비밀번호가 틀렸습니다.');
        }
    };

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <IoIosArrowBack style={backIconStyle} onClick={() => setPage('main')} />
                <img src={logoImg} alt="로고" style={logoImgStyle} />
            </header>

            <main style={formSectionStyle}>
                <div style={cardStyle}>
                    <form onSubmit={handleLogin}>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>이메일</label>
                            <input
                                type="email"
                                placeholder="이메일 주소 입력"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>비밀번호</label>
                            <input
                                type="password"
                                placeholder="비밀번호 입력"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={inputStyle}
                            />
                        </div>

                        {errorMessage && (
                            <div style={errorTextStyle}>{errorMessage}</div>
                        )}

                        <button type="submit" style={loginButtonStyle}>로그인</button>
                        <button
                            type="button"
                            style={signupButtonStyle}
                            onClick={() => setPage('signup')}
                        >
                            회원가입
                        </button>
                    </form>
                </div>
            </main>

            <nav style={bottomNavStyle}>
                <div style={activeTab === '홈' ? activeNavItemStyle : navItemStyle} onClick={() => {setActiveTab('홈'); setPage('main');}}>
                    <IoMdHome style={navIconStyle} />
                    <span style={navTextStyle}>홈</span>
                </div>
                <div style={activeTab === '게시판' ? activeNavItemStyle : navItemStyle} onClick={() => {setActiveTab('게시판'); setBoardCategory('게시판메인'); setPage('board');}}>
                    <IoMdChatbubbles style={navIconStyle} />
                    <span style={navTextStyle}>게시판</span>
                </div>
                <div style={activeTab === '내 정보' ? activeNavItemStyle : navItemStyle} onClick={() => {setActiveTab('내 정보'); setPage('profile');}}>
                    <IoMdPerson style={navIconStyle} />
                    <span style={navTextStyle}>내 정보</span>
                </div>
            </nav>
        </div>
    );
}

const containerStyle = { width: '100%', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex', flexDirection: 'column', position: 'relative', paddingBottom: '80px' };
const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px 10px', backgroundColor: 'transparent', position: 'relative' };
const backIconStyle = { fontSize: '26px', color: '#555', cursor: 'pointer', position: 'absolute', left: '20px', top: '45px' };
const logoImgStyle = { height: '45px', width: 'auto' };
const formSectionStyle = { padding: '10px 16px 40px', flex: 1 };
const cardStyle = { backgroundColor: '#fff', padding: '35px 20px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' };
const inputGroupStyle = { marginBottom: '20px' };
const labelStyle = { display: 'block', fontSize: '14px', color: '#003366', marginBottom: '8px', fontWeight: '600' };
const inputStyle = { width: '100%', padding: '16px', borderRadius: '100px', border: '1px solid #e9ecef', backgroundColor: '#f8f9fa', boxSizing: 'border-box', fontSize: '15px', outline: 'none' };
const loginButtonStyle = { width: '100%', padding: '16px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '100px', fontWeight: '700', fontSize: '18px', cursor: 'pointer', marginTop: '15px' };
const signupButtonStyle = { width: '100%', padding: '16px', backgroundColor: 'white', color: '#003366', border: '1px solid #003366', borderRadius: '100px', fontWeight: '700', fontSize: '18px', cursor: 'pointer', marginTop: '12px' };
const bottomNavStyle = { position: 'fixed', bottom: 0, width: '100%', maxWidth: '480px', height: '75px', backgroundColor: '#fff', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100, paddingBottom: '10px' };
const navItemStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#adb5bd', cursor: 'pointer' };
const activeNavItemStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#003366', cursor: 'pointer' };
const navIconStyle = { fontSize: '24px', marginBottom: '4px' };
const navTextStyle = { fontSize: '12px', fontWeight: '600' };
const errorTextStyle = { color: '#FF3B30', fontSize: '13px', textAlign: 'center', marginBottom: '10px', fontWeight: '600' };