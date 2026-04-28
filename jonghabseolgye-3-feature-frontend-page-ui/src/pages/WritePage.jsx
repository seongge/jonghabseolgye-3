import React, { useState } from 'react';
import { IoIosArrowBack, IoMdCheckmark } from 'react-icons/io';

export default function WritePage({ setPage, setPosts, category }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('1학년');

  const isMajorBoard = category === '전공 게시판';
  const gradeList = ['1학년', '2학년', '3학년', '4학년'];

  const handleComplete = () => {
    if (!title.trim() || !content.trim()) return;

    const newPost = {
      id: Date.now(),
      category: category === '게시판메인' ? '자유 게시판' : category,
      subCategory: isMajorBoard ? selectedGrade : null,
      title,
      content,
      author: '익명(나)',
      likes: 0,
      isLiked: false,
      date: '방금 전',
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);
    setPage('board');
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <IoIosArrowBack style={iconStyle} onClick={() => setPage('board')} />
        <h2 style={headerTitleStyle}>글 쓰기</h2>
        <IoMdCheckmark style={iconStyle} onClick={handleComplete} />
      </header>

      <main style={{ padding: '20px' }}>
        {isMajorBoard && (
          <div style={gradeSelectContainerStyle}>
            <p style={labelStyle}>학년 선택</p>
            <div style={gradeButtonGroupStyle}>
              {gradeList.map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  style={selectedGrade === g ? activeGradeButtonStyle : inactiveGradeButtonStyle}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        <input style={titleInputStyle} placeholder="제목을 입력해주세요." value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea style={contentInputStyle} placeholder="내용을 입력해주세요." value={content} onChange={(e) => setContent(e.target.value)} />
      </main>
    </div>
  );
}

const containerStyle = { width: '100%', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#fff' };
const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '50px 20px 15px', borderBottom: '1px solid #eee' };
const iconStyle = { fontSize: '24px', cursor: 'pointer' };
const headerTitleStyle = { fontSize: '16px', fontWeight: 'bold', color: '#003366' };
const titleInputStyle = { width: '100%', padding: '15px 0', fontSize: '18px', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #eee', outline: 'none' };
const contentInputStyle = { width: '100%', minHeight: '200px', padding: '15px 0', fontSize: '15px', border: 'none', outline: 'none', resize: 'none' };
const gradeSelectContainerStyle = { marginBottom: '20px' };
const labelStyle = { fontSize: '14px', color: '#868e96', marginBottom: '10px' };
const gradeButtonGroupStyle = { display: 'flex', gap: '8px' };
const inactiveGradeButtonStyle = { flex: 1, padding: '10px 0', borderRadius: '8px', border: '1px solid #eee', backgroundColor: '#fff', color: '#adb5bd', fontSize: '13px', cursor: 'pointer' };
const activeGradeButtonStyle = { ...inactiveGradeButtonStyle, backgroundColor: '#003366', color: '#fff', border: '1px solid #003366' };