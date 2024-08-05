import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as Lock } from '../../assets/images/Lock.svg';
import { ReactComponent as Unlock } from '../../assets/images/Unlock.svg';
import { ReactComponent as NextIcon } from '../../assets/images/Next.svg';

// 시간 나타내는 폼
const timeForm = (date) => {
    const now = new Date();
    const diff = now - new Date(date);

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const weeks = Math.floor(diff / 604800000);
    const months = Math.floor(diff / 2592000000);
    const years = Math.floor(diff / 31536000000);

    if (minutes < 1) return '지금';
    if (hours < 1) return `${minutes}분 전`;
    if (days < 1) return `${hours}시간 전`;
    if (weeks < 1) return `${days}일 전`;
    if (months < 1) return `${weeks}주 전`;
    if (years < 1) return `${months}달 전`;
    return new Date(date).toLocaleDateString();
};

// 모의 데이터 (30개로 확장)
const mockInquiry = Array.from({ length: 30 }, (_, index) => ({
    id: index + 1,
    answered: index % 2 === 0,
    tag: index % 3 === 0 ? '버그제보' : '문의',
    nickname: index % 2 === 0 ? '도라산너구리' : '작성자',
    title: `제목입니다 ${index + 1}`,
    createdAt: new Date(2024, 0, index + 1).toISOString() // 2024년 1월 1일부터 시작하는 날짜
}));

// 페이지네이션 컴포넌트
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const maxPagesToShow = 5;
    const currentGroup = Math.floor((currentPage - 1) / maxPagesToShow);
    const startPage = currentGroup * maxPagesToShow + 1;
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    const handleNextGroup = () => {
        const nextGroupFirstPage = startPage + maxPagesToShow;
        if (nextGroupFirstPage <= totalPages) {
            onPageChange(nextGroupFirstPage);
        }
    };

    const handlePrevGroup = () => {
        const prevGroupFirstPage = startPage - maxPagesToShow;
        if (prevGroupFirstPage > 0) {
            onPageChange(prevGroupFirstPage);
        }
    };

    return (
        <div className="board-pagination-container">
            <div className="board-pagination-box">
                {startPage > 1 && (
                    <div className="board-pagination-previcon-box" onClick={handlePrevGroup}>
                        <NextIcon className="board-pagination-previcon" />
                    </div>
                )}
                {pages.map((page) => (
                    <div
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={page === currentPage ? 'board-pagination-selectedpage' : 'board-pagination-page'}
                    >
                        {page}
                    </div>
                ))}
                {endPage < totalPages && (
                    <div className="board-pagination-nexticon-box" onClick={handleNextGroup}>
                        <NextIcon className="board-pagination-nexticon" />
                    </div>
                )}
            </div>
        </div>
    );
};

// 포스트 리스트 컴포넌트
const InquiryPostList = ({ posts }) => {
    const userName = '도라산너구리';
    const nav = useNavigate();

    return (
        <ul className="inquiry-post-lists">
            {posts.map((post) => (
                <li key={post.id} className="inquiry-post-item" onClick={() => {
                    if (post.answered && post.nickname === userName) {
                        nav(`/inquiryPost/${post.id}`);
                    }
                }}>
                    <div className="inquiry-post-head">
                        <div className="inquiry-post-icon">
                            {post.nickname === userName ? <Unlock /> : <Lock />}
                        </div>
                        <div className={`inquiry-post-answer ${post.answered ? 'answered' : ''}`}>
                            {post.answered ? '답변 완료' : '답변 예정'}
                        </div>
                        <div className="inquiry-post-tag">[{post.tag}]</div>
                        <div className="inquiry-post-title">{post.nickname === userName ? post.title : '비밀글 입니다.'}</div>
                    </div>
                    <div className="inquiry-post-foot">
                        <div className="inquiry-post-nickname">
                            {post.nickname === userName ? post.nickname : '익명'}
                        </div>·
                        <div className="inquiry-post-time">{timeForm(post.createdAt)}</div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

// Inquiry 컴포넌트
const Inquiry = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 15;
    const totalPages = Math.ceil(mockInquiry.length / ITEMS_PER_PAGE);
    const nav = useNavigate();

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // 현재 페이지에 해당하는 포스트만 필터링
    const currentPosts = mockInquiry.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="Inquiry">
            <div className="inquiry-head">
                <h1>문의/신고</h1>
                <button onClick={() => { nav('/createInquiry') }}>글 작성</button>
            </div>
            <div className="inquiry-body">
                <InquiryPostList posts={currentPosts} />
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            /></div>

    );
};

export default Inquiry;
