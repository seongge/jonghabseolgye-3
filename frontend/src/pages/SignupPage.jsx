import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import api from '../api/axios';
import logoImg from '../assets/MainPageLogo.png';

function SignupPage() {
    const [formData, setFormData] = useState({
        department: '',
        studentId: '',
        name: '',
        password: '',
        confirmPassword: '',
        email: ''
    });
    const navigate = useNavigate();

    const departments = [
        "컴퓨터공학과", "전자·정보통신공학과", "원자력·에너지·전기공학과", "경영학과",
        "호텔관광경영학전공", "바이오·화학융합학부", "보건의료정보학과", "행정·경찰공공학부",
        "국사학과", "영어영문학과", "조경·정원디자인학과", "글로컬인재학부"
    ];

    const handleSignup = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
            return;
        }

        try {
            await api.post('/api/auth/signup', {
                department: formData.department,
                studentId: formData.studentId,
                name: formData.name,
                password: formData.password,
                email: formData.email
            });
            alert('회원가입이 완료되었습니다!');
            navigate('/login');
        } catch (error) {
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
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
                    <form onSubmit={handleSignup}>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>학과</label>
                            <select
                                style={inputStyle}
                                value={formData.department}
                                onChange={(e) => setFormData({...formData, department: e.target.value})}
                                required
                            >
                                <option value="">학과 선택</option>
                                {departments.map((d, i) => <option key={i} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>학번</label>
                            <input style={inputStyle} placeholder="학번" required onChange={(e)=>setFormData({...formData, studentId: e.target.value})} />
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
                            {/* 실시간 메시지 영역 */}
                            {formData.confirmPassword && (
                                <div style={{
                                    fontSize: '12px',
                                    marginTop: '8px',
                                    marginLeft: '15px',
                                    fontWeight: '600',
                                    color: formData.password === formData.confirmPassword ? '#2ecc71' : '#FF3B30'
                                }}>
                                    {formData.password === formData.confirmPassword
                                        ? '✓ 비밀번호가 일치합니다.'
                                        : '✕ 비밀번호가 일치하지 않습니다.'}
                                </div>
                            )}
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>이메일</label>
                            <input type="email" style={inputStyle} placeholder="이메일" required onChange={(e)=>setFormData({...formData, email: e.target.value})} />
                        </div>

                        <button type="submit" style={signupButtonStyle}>가입하기</button>
                    </form>
                </div>
            </main>
        </div>
    );
}

const containerStyle = { width: '100%', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f8f9fa' };
const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px 10px', position: 'relative' };
const backIconStyle = { fontSize: '26px', color: '#555', cursor: 'pointer', position: 'absolute', left: '20px', top: '45px' };
const logoImgStyle = { height: '45px', width: 'auto' };
const formSectionStyle = { padding: '10px 16px' };
const cardStyle = { backgroundColor: '#fff', padding: '30px 20px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' };
const inputGroupStyle = { marginBottom: '15px' };
const labelStyle = { display: 'block', fontSize: '14px', color: '#003366', marginBottom: '6px', fontWeight: '600' };
const inputStyle = { width: '100%', padding: '15px', borderRadius: '100px', border: '1px solid #e9ecef', backgroundColor: '#f8f9fa', boxSizing: 'border-box', outline: 'none' };
const signupButtonStyle = { width: '100%', padding: '16px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '100px', fontWeight: '700', fontSize: '18px', cursor: 'pointer', marginTop: '20px' };

export default SignupPage;