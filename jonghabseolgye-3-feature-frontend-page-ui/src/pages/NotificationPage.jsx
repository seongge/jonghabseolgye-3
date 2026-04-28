import React from 'react';
import { IoIosArrowBack, IoMdNotifications } from 'react-icons/io';

export default function NotificationPage({ setPage, notifications, setNotifications, posts, setSelectedPost }) {

  const handleItemClick = (notif) => {
    const updatedNotifications = notifications.map(n =>
      n.id === notif.id ? { ...n, isRead: true } : n
    );
    setNotifications(updatedNotifications);

    const targetPost = posts.find(p => p.id === notif.targetPostId);
    if (targetPost) {
      setSelectedPost(targetPost);
      setPage('postDetail');
    } else {
      alert("해당 게시글을 찾을 수 없습니다.");
    }
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <IoIosArrowBack style={backIconStyle} onClick={() => setPage('main')} />
        <h2 style={headerTitleStyle}>알림</h2>
        <div style={{ width: '26px' }} />
      </header>

      <main style={{ padding: '10px 16px' }}>
        {notifications.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#adb5bd', marginTop: '50px' }}>새 알림이 없습니다.</p>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => handleItemClick(n)}
              style={{
                ...notiCardStyle,
                backgroundColor: n.isRead ? '#fff' : '#f0f7ff',
                opacity: n.isRead ? 0.7 : 1,
                border: n.isRead ? '1px solid #eee' : '1px solid #d0e7ff'
              }}
            >
              <div style={notiIconCircleStyle}>
                <IoMdNotifications style={{ color: n.isRead ? '#adb5bd' : '#003366' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#333' }}>{n.title}</div>
                <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{n.content}</div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

const containerStyle = { width: '100%', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f8f9fa' };
const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '50px 20px 15px', backgroundColor: '#fff', borderBottom: '1px solid #eee' };
const backIconStyle = { fontSize: '26px', color: '#555', cursor: 'pointer' };
const headerTitleStyle = { fontSize: '18px', fontWeight: 'bold', color: '#003366', margin: 0 };
const notiCardStyle = { display: 'flex', gap: '15px', padding: '20px', borderRadius: '20px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer' };
const notiIconCircleStyle = { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', border: '1px solid #eee' };