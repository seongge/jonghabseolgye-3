import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowBack, IoMdHeart, IoMdHeartEmpty, IoIosSend, IoMdPerson } from 'react-icons/io';

function PostDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLiked, setIsLiked] = useState(false);
    const [comment, setComment] = useState('');

    const post = {
        id: 1,
        title: '배달 같이 시키실 분?',
        content: '정문 근처인데 마라탕 같이 시켜서 배달비 아껴요! 꿔바로우도 환영입니다.',
        date: '2026.04.16',
        author: '익명',
        likes: 15,
        comments: [
            { id: 1, author: '익명1', content: '저요! 어디서 시키시나요?' },
            { id: 2, author: '익명2', content: '지금 쪽지 드려도 될까요?' },
        ]
    };

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <IoIosArrowBack style={backIconStyle} onClick={() => navigate(-1)} />
                <h2 style={headerTitleStyle}>게시글</h2>
                <div style={{ width: '26px' }} />
            </header>

            <main style={mainStyle}>
                <div style={contentCardStyle}>
                    <div style={authorAreaStyle}>
                        <div style={profileCircleStyle}>
                            <IoMdPerson style={{ color: '#adb5bd' }} />
                        </div>
                        <div>
                            <div style={authorNameStyle}>{post.author}</div>
                            <div style={dateStyle}>{post.date}</div>
                        </div>
                    </div>
                    <h3 style={titleStyle}>{post.title}</h3>
                    <p style={bodyStyle}>{post.content}</p>
                    <div style={actionAreaStyle}>
                        <div onClick={() => setIsLiked(!isLiked)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '6px' }}>
                            {isLiked ? <IoMdHeart style={{ color: '#FF3366', fontSize: '22px' }} /> : <IoMdHeartEmpty style={{ color: '#adb5bd', fontSize: '22px' }} />}
                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: isLiked ? '#FF3366' : '#adb5bd' }}>
                좋아요 {isLiked ? post.likes + 1 : post.likes}
              </span>
                        </div>
                    </div>
                </div>

                <div style={commentSectionStyle}>
                    <b style={{ fontSize: '14px', color: '#333' }}>댓글 {post.comments.length}</b>
                    {post.comments.map((c) => (
                        <div key={c.id} style={commentItemStyle}>
                            <b style={commentAuthorStyle}>{c.author}</b>
                            <div style={commentTextStyle}>{c.content}</div>
                        </div>
                    ))}
                </div>
            </main>

            <div style={commentInputAreaStyle}>
                <input style={commentInputStyle} placeholder="댓글을 입력하세요..." value={comment} onChange={(e) => setComment(e.target.value)} />
                <IoIosSend style={sendIconStyle} />
            </div>
        </div>
    );
}

const containerStyle = { width: '100%', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f8f9fa', position: 'relative', paddingBottom: '70px' };
const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', backgroundColor: '#fff', borderBottom: '1px solid #eee' };
const backIconStyle = { fontSize: '26px', color: '#555', cursor: 'pointer' };
const headerTitleStyle = { fontSize: '18px', fontWeight: 'bold', color: '#003366', margin: 0 };
const mainStyle = { padding: '16px' };
const contentCardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '16px' };
const authorAreaStyle = { display: 'flex', alignItems: 'center', marginBottom: '15px' };
const profileCircleStyle = { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f3f5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', fontSize: '24px' };
const authorNameStyle = { fontSize: '14px', fontWeight: 'bold', color: '#333' };
const dateStyle = { fontSize: '11px', color: '#adb5bd' };
const titleStyle = { fontSize: '18px', fontWeight: 'bold', color: '#003366', marginBottom: '10px' };
const bodyStyle = { fontSize: '15px', color: '#444', lineHeight: '1.6', marginBottom: '20px' };
const actionAreaStyle = { borderTop: '1px solid #f1f3f5', paddingTop: '15px' };
const commentSectionStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const commentItemStyle = { padding: '12px 0', borderBottom: '1px solid #f1f3f5' };
const commentAuthorStyle = { fontSize: '13px', fontWeight: 'bold', color: '#003366', display: 'block', marginBottom: '4px' };
const commentTextStyle = { fontSize: '14px', color: '#444' };
const commentInputAreaStyle = { position: 'fixed', bottom: 0, width: '100%', maxWidth: '480px', backgroundColor: '#fff', padding: '10px 15px', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' };
const commentInputStyle = { flex: 1, backgroundColor: '#f8f9fa', border: 'none', borderRadius: '100px', padding: '12px 20px', outline: 'none', fontSize: '14px' };
const sendIconStyle = { fontSize: '28px', color: '#003366', cursor: 'pointer' };

export default PostDetailPage;