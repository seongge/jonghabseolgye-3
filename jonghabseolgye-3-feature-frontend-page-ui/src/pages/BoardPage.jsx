import React, { useState } from 'react';
import {
    IoIosArrowBack,
    IoIosSearch,
    IoMdHome,
    IoMdChatbubbles,
    IoMdPerson,
    IoMdHeart,
    IoMdText,
    IoMdCreate,
    IoMdClose
} from 'react-icons/io';

export default function BoardPage({ setPage, category, posts, setSelectedPost, setBoardCategory, isLoggedIn, showToast }) {
    const [subCategory, setSubCategory] = useState('전체');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');

    const gradeFilters = ['전체', '1학년', '2학년', '3학년', '4학년'];
    const noticeFilters = ['전체', '일반', '학사', '교직', '취업프로그램', '채용공고', '장학/봉사', '행사', '기금'];

    const isSummaryView = category === '게시판메인';
    const isSchoolNotice = category === '학교 공지';
    const isDeptNotice = category === '학과 공지';
    const canWrite = category === '자유 게시판' || category === '전공 게시판';
    const isSpecialView = ['내가 작성한 글', '내가 작성한 댓글', '좋아요 표시한 글'].includes(category);

    const handleBack = () => {
        if (isSummaryView || isSchoolNotice || isDeptNotice || isSpecialView) {
            setPage(isSpecialView ? 'profile' : 'main');
        } else {
            setBoardCategory('게시판메인');
        }
    };

    const handleWriteClick = () => {
        if (!isLoggedIn) {
            showToast('로그인이 필요한 서비스입니다.');
        } else {
            setPage('write');
        }
    };

    const Section = ({ title, displayItems, targetCategory }) => (
        <div style={popularCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <b style={{ fontSize: '16px', color: '#003366' }}>{title}</b>
                <span
                    style={{ fontSize: '12px', color: '#adb5bd', cursor: 'pointer' }}
                    onClick={() => setBoardCategory(targetCategory)}
                >
                    더보기
                </span>
            </div>
            {displayItems.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#adb5bd' }}>게시글이 없습니다.</p>
            ) : (
                displayItems.map((post, idx) => (
                    <div
                        key={post.id}
                        onClick={() => { setSelectedPost(post); setPage('postDetail'); }}
                        style={{
                            ...popItemStyle,
                            borderBottom: idx !== displayItems.length - 1 ? '1px solid #f1f3f5' : 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <p style={{ fontSize: '14px', flex: 1, margin: 0 }}>{post.title}</p>
                    </div>
                ))
            )}
        </div>
    );

    const filteredPosts = posts.filter((p) => {
        let isMatch = true;

        if (!isSummaryView && !isSpecialView) {
            isMatch = p.category === category;
        }

        if (isMatch && (category === '전공 게시판' || isSchoolNotice) && subCategory !== '전체') {
            isMatch = p.subCategory === subCategory;
        }

        if (isMatch && searchKeyword.trim() !== '') {
            const keyword = searchKeyword.toLowerCase();
            isMatch = p.title?.toLowerCase().includes(keyword) || p.content?.toLowerCase().includes(keyword);
        }
        return isMatch;
    });

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                {!isSearchOpen ? (
                    <>
                        <IoIosArrowBack style={backIconStyle} onClick={handleBack} />
                        <h2 style={headerTitleStyle}>{isSummaryView ? '게시판' : category}</h2>
                        {!isSummaryView && (
                            <IoIosSearch
                                style={{ fontSize: '24px', color: '#003366', cursor: 'pointer' }}
                                onClick={() => setIsSearchOpen(true)}
                            />
                        )}
                        {isSummaryView && <div style={{ width: '24px' }} />}
                    </>
                ) : (
                    <div style={searchBarWrapperStyle}>
                        <IoIosArrowBack
                            style={{ fontSize: '24px', color: '#555', cursor: 'pointer' }}
                            onClick={() => {
                                setIsSearchOpen(false);
                                setSearchKeyword('');
                            }}
                        />
                        <input
                            style={searchInputStyle}
                            placeholder="검색어를 입력하세요"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            autoFocus
                        />
                        {searchKeyword && (
                            <IoMdClose
                                style={{ fontSize: '20px', color: '#adb5bd', cursor: 'pointer' }}
                                onClick={() => setSearchKeyword('')}
                            />
                        )}
                    </div>
                )}
            </header>

            {isSummaryView ? (
                <div style={{ padding: '20px' }}>
                    <Section
                        title="자유 게시판"
                        displayItems={posts.filter(p => p.category === '자유 게시판').slice(0, 3)}
                        targetCategory="자유 게시판"
                    />
                    <Section
                        title="전공 게시판"
                        displayItems={posts.filter(p => p.category === '전공 게시판').slice(0, 3)}
                        targetCategory="전공 게시판"
                    />
                </div>
            ) : (
                <>
                    {(category === '전공 게시판' || isSchoolNotice) && !isSearchOpen && (
                        <div style={filterAreaStyle}>
                            {(isSchoolNotice ? noticeFilters : gradeFilters).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setSubCategory(f)}
                                    style={subCategory === f ? activeFilterStyle : inactiveFilterStyle}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    )}
                    <main style={contentStyle}>
                        {filteredPosts.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#adb5bd', marginTop: '50px' }}>결과가 없습니다.</div>
                        ) : (
                            filteredPosts.map((p) => (
                                <div key={p.id} style={postCardStyle} onClick={() => { setSelectedPost(p); setPage('postDetail'); }}>
                                    <div style={postMetaStyle}>{p.date} | {p.author}</div>
                                    <div style={postTitleStyle}>{p.title}</div>
                                    {!(isSchoolNotice || isDeptNotice) && (
                                        <div style={postStatStyle}>
                                            <span style={{ color: '#FF3366', display: 'flex', alignItems: 'center', gap: '4px' }}><IoMdHeart /> {p.likes}</span>
                                            <span style={{ color: '#00D1D1', display: 'flex', alignItems: 'center', gap: '4px' }}><IoMdText /> {p.comments?.length || 0}</span>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </main>
                </>
            )}

            {canWrite && !isSummaryView && !isSearchOpen && (
                <button style={writeButtonStyle} onClick={handleWriteClick}>
                    <IoMdCreate size={24} style={{ marginRight: '5px' }} />
                    <span style={{ fontWeight: 'bold' }}>글 쓰기</span>
                </button>
            )}

            <nav style={bottomNavStyle}>
                <div style={navItemStyle} onClick={() => setPage('main')}><IoMdHome size={24} /><span style={navTextStyle}>홈</span></div>
                <div style={activeNavItemStyle} onClick={() => { setBoardCategory('게시판메인'); setPage('board'); }}><IoMdChatbubbles size={24} /><span style={navTextStyle}>게시판</span></div>
                <div style={navItemStyle} onClick={() => setPage('profile')}><IoMdPerson size={24} /><span style={navTextStyle}>내 정보</span></div>
            </nav>
            <style>
                {`div::-webkit-scrollbar { display: none; }`}
            </style>
        </div>
    );
}

const containerStyle = { width: '100%', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f8f9fa', position: 'relative', paddingBottom: '80px' };
const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '50px 20px 15px', backgroundColor: '#fff', borderBottom: '1px solid #eee', height: '100px', boxSizing: 'border-box' };
const backIconStyle = { fontSize: '26px', color: '#555', cursor: 'pointer' };
const headerTitleStyle = { fontSize: '18px', fontWeight: 'bold', color: '#003366', margin: 0 };
const searchBarWrapperStyle = { display: 'flex', alignItems: 'center', gap: '10px', width: '100%' };
const searchInputStyle = { flex: 1, border: 'none', backgroundColor: '#f1f3f5', padding: '10px 15px', borderRadius: '100px', outline: 'none', fontSize: '15px' };
const popularCardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '15px' };
const popItemStyle = { padding: '10px 0', borderBottom: '1px solid #f1f3f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const filterAreaStyle = { display: 'flex', gap: '8px', padding: '15px 20px', backgroundColor: '#fff', overflowX: 'auto', whiteSpace: 'nowrap', msOverflowStyle: 'none', scrollbarWidth: 'none' };
const inactiveFilterStyle = { padding: '8px 16px', borderRadius: '100px', border: '1px solid #e9ecef', backgroundColor: '#f8f9fa', color: '#868e96', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 };
const activeFilterStyle = { ...inactiveFilterStyle, backgroundColor: '#003366', color: '#fff' };
const contentStyle = { padding: '10px 16px' };
const postCardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '20px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer' };
const postMetaStyle = { fontSize: '11px', color: '#adb5bd', marginBottom: '4px' };
const postTitleStyle = { fontSize: '15px', fontWeight: 'bold', color: '#333', marginBottom: '8px' };
const postStatStyle = { fontSize: '12px', fontWeight: '600', display: 'flex', gap: '15px' };
const bottomNavStyle = { position: 'fixed', bottom: 0, width: '100%', maxWidth: '480px', height: '75px', backgroundColor: '#fff', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100, paddingBottom: '10px' };
const navItemStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#adb5bd', cursor: 'pointer' };
const activeNavItemStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#003366', cursor: 'pointer' };
const navTextStyle = { fontSize: '12px', fontWeight: '600', marginTop: '4px' };

const writeButtonStyle = {
    position: 'fixed',
    bottom: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#003366',
    color: '#fff',
    border: 'none',
    borderRadius: '100px',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    cursor: 'pointer',
    zIndex: 99,
    whiteSpace: 'nowrap'
};