import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack, IoMdMegaphone, IoMdChatbubbles, IoMdPerson } from 'react-icons/io';
import api from '../api/axios';
import logoImg from '../assets/MainPageLogo.png';

function LoginPage() {
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('공지');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/login', { studentId, password });
            localStorage.setItem('token', response.data.token);
            alert('로그인 성공!');
            navigate('/home');
        } catch (error) {
            alert('로그인에 실패했습니다.');
        }
    };

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <IoIosArrowBack style={backIconStyle} onClick={() => navigate(-1)} />
                <img src={logoImg} alt="로고" style={logoImgStyle} />
            </header>

            <main style={formSectionStyle}>
                <div style={cardStyle}>
                    <form onSubmit={handleLogin}>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>학번</label>
                            <input type="text" placeholder="학번 입력" value={studentId} onChange={(e) => setStudentId(e.target.value)} style={inputStyle} />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>비밀번호</label>
                            <input type="password" placeholder="비밀번호 입력" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
                        </div>
                        <button type="submit" style={loginButtonStyle}>로그인</button>
                        <button type="button" style={signupButtonStyle} onClick={() => navigate('/signup')}>회원가입</button>
                    </form>

                </div>
            </main>

            <nav style={bottomNavStyle}>
                <div style={activeTab === '공지' ? activeNavItemStyle : navItemStyle} onClick={() => setActiveTab('공지')}>
                    <IoMdMegaphone style={navIconStyle} />
                    <span style={navTextStyle}>공지</span>
                </div>
                <div style={activeTab === '커뮤니티' ? activeNavItemStyle : navItemStyle} onClick={() => setActiveTab('커뮤니티')}>
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

const containerStyle = {
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    paddingBottom: '80px',
};

const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px 10px',
    backgroundColor: 'transparent',
    position: 'relative',
};

const backIconStyle = {
    fontSize: '26px',
    color: '#555',
    cursor: 'pointer',
    position: 'absolute',
    left: '20px',
    top: '45px',
};

const logoImgStyle = {
    height: '45px',
    width: 'auto',
};

const formSectionStyle = {
    padding: '10px 16px 40px',
    flex: 1
};

const cardStyle = {
    backgroundColor: '#fff',
    padding: '35px 20px',
    borderRadius: '24px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
};

const inputGroupStyle = { marginBottom: '20px' };

const labelStyle = {
    display: 'block',
    fontSize: '14px',
    color: '#003366',
    marginBottom: '8px',
    fontWeight: '600'
};

const inputStyle = {
    width: '100%',
    padding: '16px',
    borderRadius: '100px',
    border: '1px solid #e9ecef',
    backgroundColor: '#f8f9fa',
    boxSizing: 'border-box',
    fontSize: '15px',
    outline: 'none',
};

const loginButtonStyle = {
    width: '100%',
    padding: '16px',
    backgroundColor: '#003366',
    color: 'white',
    border: 'none',
    borderRadius: '100px',
    fontWeight: '700',
    fontSize: '18px',
    cursor: 'pointer',
    marginTop: '15px',
};

const signupButtonStyle = {
    width: '100%',
    padding: '16px',
    backgroundColor: 'white',
    color: '#003366',
    border: '1px solid #003366',
    borderRadius: '100px',
    fontWeight: '700',
    fontSize: '18px',
    cursor: 'pointer',
    marginTop: '12px',
};

const linkSectionStyle = { textAlign: 'center', marginTop: '20px' };

const linkTextStyle = {
    fontSize: '13px',
    color: '#003366',
    cursor: 'pointer',
    textDecoration: 'underline'
};

const bottomNavStyle = {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    maxWidth: '480px',
    height: '75px',
    backgroundColor: '#fff',
    borderTop: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 100,
    paddingBottom: '10px',
};

const navItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#adb5bd',
    cursor: 'pointer'
};

const activeNavItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#003366',
    cursor: 'pointer'
};

const navIconStyle = { fontSize: '24px', marginBottom: '4px' };

const navTextStyle = { fontSize: '12px', fontWeight: '600' };

export default LoginPage;