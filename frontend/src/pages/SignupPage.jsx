import React, { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import api from '../api/axios';
import logoImg from '../assets/MainPageLogo.png';

export default function SignupPage({ setPage }) {
    const [isVerified, setIsVerified] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);

    const [formData, setFormData] = useState({
        department: '',
        studentId: '',
        grade: '', // 학년 추가
        name: '',
        password: '',
        confirmPassword: '',
        email: '',
        verificationCode: ''
    });

    const [filteredDepts, setFilteredDepts] = useState([]);

    const departments = [
        "컴퓨터공학과", "전자정보통신공학과", "원자력에너지전기공학과", "경영학과",
        "호텔관광경영학전공", "바이오화학융합학부", "보건의료정보학과", "행정경찰공공학과",
        "국사학과", "영어영문학과", "조경정원디자인학과", "글로컬인재학과"
    ];

    const handleEmailSend = async () => {
        if (!formData.email.trim()) {
            alert('이메일을 입력해주세요.');
            return;
        }

        try {
            await api.post('/api/auth/register/send-code', {
                email: formData.email
            });
            setIsEmailSent(true);
            alert('인증번호가 발송되었습니다.');
        } catch (error) {
            alert(error.response?.data?.message || '인증번호 발송에 실패했습니다.');
        }
    };

    const handleDeptChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, department: value });

        if (value.trim().length > 0) {
            const filtered = departments.filter(d => d.includes(value));
            setFilteredDepts(filtered);
        } else {
            setFilteredDepts([]);
        }
    };

    const selectDept = (dept) => {
        setFormData({ ...formData, department: dept });
        setFilteredDepts([]);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            await api.post('/api/auth/register', {
                major: formData.department,
                student_number: formData.studentId,
                grade: Number(formData.grade),
                nickname: formData.name,
                password: formData.password,
                email: formData.email,
                verificationCode: formData.verificationCode
            });
            alert('회원가입이 완료되었습니다!');
            setPage('login');
        } catch (error) {
            alert('회원가입에 실패했습니다.');
        }
    };

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <img 
                    src={logoImg} 
                    alt="로고" 
                    style={logoImgStyle} 
                    onClick={() => setPage('login')} // 로고 클릭 시 이동
                />
                <IoIosArrowBack
                    style={backIconStyle}
                    onClick={() => isVerified ? setIsVerified(false) : setPage('login')}
                />
            </header>

            <main style={formSectionStyle}>
                {!isVerified ? (
                    <div style={cardStyle}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#003366', marginBottom: '25px' }}>이메일 인증</h2>
                        <div style={inputGroupStyle}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    style={{ ...inputStyle, flex: 1 }}
                                    placeholder="이메일 주소 입력"
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                                <button type="button" onClick={handleEmailSend} style={verifyButtonStyle}>발송</button>
                            </div>
                        </div>
                        {isEmailSent && <p style={{ fontSize: '12px', color: '#2ecc71', marginTop: '-10px', marginBottom: '15px', marginLeft: '15px' }}>✓ 인증번호가 발송되었습니다.</p>}

                        <div style={inputGroupStyle}>
                            <input style={inputStyle} placeholder="인증번호 입력" value={formData.verificationCode} onChange={(e) => setFormData({...formData, verificationCode: e.target.value})} />
                        </div>

                        <button style={signupButtonStyle} onClick={() => formData.verificationCode.trim() ? setIsVerified(true) : alert('인증번호를 입력해주세요.')}>인증 완료하기</button>
                    </div>
                ) : (
                    <div style={cardStyle}>
                        <form onSubmit={handleSignup}>
                            <div style={{ ...inputGroupStyle, position: 'relative' }}>
                                <label style={labelStyle}>학과</label>
                                <input
                                    style={inputStyle}
                                    placeholder="학과 입력 (예: 컴퓨터)"
                                    value={formData.department}
                                    onChange={handleDeptChange}
                                    required
                                    autoComplete="off"
                                />
                                {filteredDepts.length > 0 && (
                                    <div style={suggestionListStyle}>
                                        {filteredDepts.map((d, i) => (
                                            <div
                                                key={i}
                                                style={suggestionItemStyle}
                                                onClick={() => selectDept(d)}
                                            >
                                                {d}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>학번</label>
                                <input style={inputStyle} placeholder="학번 (예: 2021112233)" required onChange={(e)=>setFormData({...formData, studentId: e.target.value})} />
                            </div>

                            {/* 학년 입력 필드 추가 */}
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>학년</label>
                                <select 
                                    style={{...inputStyle, appearance: 'none', backgroundColor: '#f8f9fa'}} 
                                    required 
                                    value={formData.grade}
                                    onChange={(e)=>setFormData({...formData, grade: e.target.value})}
                                >
                                    <option value="" disabled hidden>학년 선택</option>
                                    <option value="1">1학년</option>
                                    <option value="2">2학년</option>
                                    <option value="3">3학년</option>
                                    <option value="4">4학년</option>
                                </select>
                            </div>

                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>이름</label>
                                <input style={inputStyle} placeholder="이름" required onChange={(e)=>setFormData({...formData, name: e.target.value})} />
                            </div>

                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>비밀번호</label>
                                <input
                                    type="password"
                                    style={inputStyle}
                                    placeholder="비밀번호"
                                    required
                                    onChange={(e)=>setFormData({...formData, password: e.target.value})}
                                />
                            </div>

                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>비밀번호 확인</label>
                                <input
                                    type="password"
                                    style={inputStyle}
                                    placeholder="비밀번호 재입력"
                                    required
                                    onChange={(e)=>setFormData({...formData, confirmPassword: e.target.value})}
                                />
                                {formData.confirmPassword && (
                                    <div style={{
                                        fontSize: '12px',
                                        marginTop: '8px',
                                        marginLeft: '15px',
                                        fontWeight: '600',
                                        color: formData.password === formData.confirmPassword ? '#2ecc71' : '#FF3B30'
                                    }}>
                                        {formData.password === formData.confirmPassword ? '✓ 일치합니다.' : '✕ 일치하지 않습니다.'}
                                    </div>
                                )}
                            </div>

                            <button type="submit" style={signupButtonStyle}>가입하기</button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}

// 스타일 상수는 기존과 동일하며, select 태그 디자인을 위해 inputStyle을 그대로 사용합니다.
const containerStyle = { width: '100%', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f8f9fa' };
const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px 10px', position: 'relative' };
const backIconStyle = { fontSize: '26px', color: '#555', cursor: 'pointer', position: 'absolute', left: '20px', top: '45px' };
const logoImgStyle = { height: '45px', width: 'auto', cursor: 'pointer' };
const formSectionStyle = { padding: '10px 16px 40px' };
const cardStyle = { backgroundColor: '#fff', padding: '30px 20px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' };
const inputGroupStyle = { marginBottom: '15px' };
const labelStyle = { display: 'block', fontSize: '14px', color: '#003366', marginBottom: '6px', fontWeight: '600' };
const inputStyle = { width: '100%', padding: '15px', borderRadius: '100px', border: '1px solid #e9ecef', backgroundColor: '#f8f9fa', boxSizing: 'border-box', outline: 'none', fontSize: '15px' };
const verifyButtonStyle = { padding: '0 20px', backgroundColor: '#003366', color: 'white', borderRadius: '100px', border: 'none', fontWeight: 'bold', cursor: 'pointer' };
const signupButtonStyle = { width: '100%', padding: '16px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '100px', fontWeight: '700', fontSize: '18px', cursor: 'pointer', marginTop: '20px' };

const suggestionListStyle = {
    position: 'absolute',
    top: '75px',
    left: '0',
    right: '0',
    backgroundColor: '#fff',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    zIndex: 10,
    maxHeight: '150px',
    overflowY: 'auto',
    border: '1px solid #eee'
};

const suggestionItemStyle = {
    padding: '12px 20px',
    fontSize: '14px',
    cursor: 'pointer',
    borderBottom: '1px solid #f8f9fa'
};