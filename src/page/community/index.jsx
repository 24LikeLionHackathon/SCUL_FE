import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { ReactComponent as Select } from '../../assets/images/FilterSelect.svg';
import { ReactComponent as Search } from '../../assets/images/FilterSearch.svg';
import { ReactComponent as ViewsIcon } from '../../assets/images/ViewsIcon.svg';
import { ReactComponent as LikesIcon } from '../../assets/images/LikesIcon.svg';
import { ReactComponent as NextIcon } from '../../assets/images/Next.svg';
import DefaultPostImg from '../../assets/images/DefaultPostImg.jpg';
import axios from 'axios';

const tags = {
  free: ['전체', '자유'],
  review: ['전체', '소모임', '용품', '운동', '시설'],
  info: ['전체', '대회', '경기 일정', '경기 결과'],
};

// 게시판 목록 컴포넌트
const BoardList = ({ boardName }) => {
  return <div className="board-header-name">{boardName}</div>;
};

// 글 작성 버튼 컴포넌트
const WriteButton = ({ onWrite }) => {
  return (
    <button className="board-header-writebutton" onClick={onWrite}>
      글 작성
    </button>
  );
};

// 필터 컴포넌트
const Filter = ({ tags, onFilterChange, onTagChange, onSearch }) => {
  const [selectedSort, setSelectedSort] = useState('최신 순');
  const [selectedTag, setSelectedTag] = useState('전체');
  const [selectedSearchOption, setSelectedSearchOption] = useState('제목');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [searchDropdownVisible, setSearchDropdownVisible] = useState(false);

  const handleSortChange = (sort) => {
    setSelectedSort(sort);
    setSortDropdownVisible(false);
    onFilterChange({
      sort,
      tag: selectedTag,
      searchOption: selectedSearchOption,
      keyword: searchKeyword,
    });
  };

  const handleTagChange = (tag) => {
    setSelectedTag(tag);
    onTagChange({
      sort: selectedSort,
      tag,
      searchOption: selectedSearchOption,
      keyword: searchKeyword,
    });
  };

  const handleSearchOptionChange = (searchOption) => {
    setSelectedSearchOption(searchOption);
    setSearchKeyword('');
    setSearchDropdownVisible(false);
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };
  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter') {
      onSearch({
        sort: selectedSort,
        tag: selectedTag,
        searchOption: selectedSearchOption,
        keyword: searchKeyword,
      });
    }
  };

  return (
    <div className="board-filter-container">
      <div className="board-filter-select-container">
        <div className="board-filter-selected">{selectedSort}</div>
        <Select
          className="board-filter-select-button"
          onClick={() => setSortDropdownVisible(!sortDropdownVisible)}
        />
        {sortDropdownVisible && (
          <ul className="board-filter-select-dropdown-container">
            <li
              key="최신 순"
              className="board-filter-select-dropdown-list"
              onClick={() => handleSortChange('최신 순')}
            >
              최신 순
            </li>
            <hr className="board-filter-select-dropdown-list-hr" />
            <li
              key="조회 순"
              className="board-filter-select-dropdown-list"
              onClick={() => handleSortChange('조회 순')}
            >
              조회 순
            </li>
            <hr className="board-filter-select-dropdown-list-hr" />
            <li
              key="댓글 순"
              className="board-filter-select-dropdown-list"
              onClick={() => handleSortChange('댓글 순')}
            >
              댓글 순
            </li>
          </ul>
        )}
      </div>
      <div className="board-filter-tag-container">
        <ul className="board-filter-tag-list-container">
          {tags.map((tag) => (
            <li
              key={tag}
              onClick={() => handleTagChange(tag)}
              className={
                selectedTag === tag
                  ? 'board-filter-tag-list-selected'
                  : 'board-filter-tag-list'
              }
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
      <div className="board-filter-search-container">
        <div className="board-filter-search-select-container">
          <div
            className="board-filter-search-select-selected"
            onClick={() => setSearchDropdownVisible(!searchDropdownVisible)}
          >
            {selectedSearchOption}
            {searchDropdownVisible && (
              <ul className="board-filter-search-select-dropdown-container">
                <li
                  className="board-filter-search-select-dropdown-list"
                  onClick={() => handleSearchOptionChange('제목')}
                >
                  제목
                </li>
                <hr className="board-filter-search-select-dropdown-list-hr" />
                <li
                  className="board-filter-search-select-dropdown-list"
                  onClick={() => handleSearchOptionChange('작성자')}
                >
                  작성자
                </li>
                <hr className="board-filter-search-select-dropdown-list-hr" />
                <li
                  className="board-filter-search-select-dropdown-list"
                  onClick={() => handleSearchOptionChange('내용')}
                >
                  내용
                </li>
              </ul>
            )}
          </div>
        </div>
        <div className="board-filter-search-input-container">
          <Search className="board-filter-search-input-icon" />
          <input
            className="board-filter-search-input"
            type="text"
            value={searchKeyword}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
            placeholder="검색어를 입력해 주세요"
          />
        </div>
      </div>
    </div>
  );
};

// 게시글 목록 컴포넌트
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
const handleAdClick = (link) => {
  window.open(link, '_blank');
};
const Postlist = ({ posts, onDetail }) => {
  return (
    <div className="board-postlist-container">
      <ul className="board-postist">
        {posts.map((post, index) => (
          <li key={post.id} className="board-postlist-postitem-container">
            {post.isAd ? (
              <div className="board-postlist-postitem-ad">
                <img
                  src={post.imageUrl || DefaultPostImg}
                  alt="adimg"
                  className="board-postlist-postitem-adimage"
                />

                <div className="board-postlist-ad-adbox">
                  <div className="board-postlist-ad-adbox-titlebox">
                    <div className="board-postlist-ad-adbox-titlebox-tag">
                      {post.tag}
                    </div>
                    <div className="board-postlist-ad-adbox-titlebox-title">
                      {post.title}
                    </div>
                  </div>
                  <div className="board-postlist-ad-adbox-infobox">
                    <div className="board-postlist-ad-adbox-infobox-nickname">
                      {post.nickname}
                    </div>
                    <div
                      className="board-postlist-ad-adbox-infobox-link"
                      onClick={() => handleAdClick(post.link)}
                    >
                      {post.link}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="board-postlist-postitem-post">
                <img
                  src={post.imageUrl || DefaultPostImg}
                  alt={'img'}
                  className="board-postlist-postitem-postimage"
                />
                <div className="board-postlist-postitem-postbox">
                  <div className="board-postlist-postitem-postbox-titlebox">
                    <div className="board-postlist-postitem-postbox-titlebox-tag">
                      {post.tagName}
                    </div>
                    <div
                      className="board-postlist-postitem-postbox-titlebox-title"
                      onClick={() => {
                        onDetail(post.postId);
                      }}
                    >
                      {console.log(post.postId)}
                      {post.postTitle}
                    </div>
                    {/* {post.commentCount > 0 && ( */}
                    <div className="board-postlist-postitem-postbox-titlebox-comments">
                      {post.commentCount}
                    </div>
                    {/* )} */}
                  </div>
                  <div className="board-postlist-postitem-infobox">
                    <div className="board-postlist-postitem-infobox-nickname">
                      {post.nickname}
                    </div>
                    <div className="board-postlist-postitem-infobxo-dot">·</div>
                    <div className="board-postlist-postitem-infobox-time">
                      {timeForm(post.createdAt)}
                    </div>
                    <div className="board-postlist-postitem-infobxo-dot">·</div>
                    <ViewsIcon className="board-postlist-postitem-infobox-view-icon" />
                    <div className="postViboard-postlist-postitem-infobox-view">
                      {post.postView}{' '}
                    </div>
                    <div className="board-postlist-postitem-infobxo-dot">·</div>
                    <LikesIcon className="board-postlist-postitem-infobox-like-icon" />
                    {/* {post.likeCount > 0 && ( */}
                    <div className="board-postlist-postitem-infobox-like">
                      {post.likeCount}
                    </div>
                    {/* )} */}
                  </div>
                </div>
              </div>
            )}
            {index < posts.length - 1 && (
              <hr className="board-postlist-divider" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// 페이지네이션 컴포넌트
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxPagesToShow = 5;
  const currentGroup = Math.floor((currentPage - 1) / maxPagesToShow);
  const startPage = currentGroup * maxPagesToShow + 1;
  const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

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
          <div
            className="board-pagination-previcon-box"
            onClick={handlePrevGroup}
          >
            <NextIcon className="board-pagination-previcon" />
          </div>
        )}
        {pages.map((page) => (
          <div
            key={page}
            onClick={() => onPageChange(page)}
            className={
              page === currentPage
                ? 'board-pagination-selectedpage'
                : 'board-pagination-page'
            }
          >
            {page}
          </div>
        ))}
        {endPage < totalPages && (
          <div
            className="board-pagination-nexticon-box"
            onClick={handleNextGroup}
          >
            <NextIcon className="board-pagination-nexticon" />
          </div>
        )}
      </div>
    </div>
  );
};

// 메인 게시판 컴포넌트
const Community = () => {
  const { board } = useParams();
  const { sport } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [sortMethod, setSortMethod] = useState('최신 순');
  const [selectedTag, setSelectedTag] = useState('전체');
  const [searchType, setSearchType] = useState('제목');
  const [searchContent, setSearchContent] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  // 현재 게시판에 맞는 태그 배열 선택
  const currentTags = tags[board] || [];
  // 총 페이지 수를 게시물 수로 계산

  // 광고 목업 데이터
  const adData = {
    id: 'ad1',
    isAd: true,
    tag: '광고',
    title: '나랑 스껄할래?',
    nickname: '스컬스컬',
    link: 'https://s-cul.com',
  };

  useEffect(() => {
    // 페이지에 맞는 게시물 목록을 필터링 및 광고 삽입
    const startIdx = (currentPage - 1) * 14;
    const endIdx = startIdx + 14;
    const postsWithAd = [
      ...posts.slice(startIdx, startIdx + 4),
      adData,
      ...posts.slice(startIdx + 4, endIdx),
    ];
    setPosts(postsWithAd);
  }, [currentPage]);

  const fetchPosts = async () => {
    const page = currentPage;
    const selectedSports = JSON.parse(localStorage.getItem('selectedSport'));
    const sportsName = selectedSports?.name || '';

    try {
      const response = await axios.post('/api/posts/list', {
        sportsName,
        boardName,
        tagName: selectedTag,
        sortMethod,
        searchType,
        searchContent,
        page,
      });
      console.log(response.data);
      // API 응답에서 게시물 데이터와 전체 게시물 수 추출
      const fetchedData = response.data;
      const totalPosts = fetchedData.totalPosts || 100; // 전체 게시물 수
      const postsArray = fetchedData.posts || []; // 게시물 배열

      const totalPages = Math.ceil(totalPosts / 14); // 총 페이지 수 계산
      setTotalPages(totalPages); // totalPages 상태 업데이트

      // PostListDto 형태로 변환
      const postListDto = postsArray.map((post) => ({
        postId: post.postId,
        nickname: post.nickname,
        tagName: post.tagName,
        postTitle: post.postTitle,
        createdAt: new Date(post.createdAt), // ISO 문자열을 Date 객체로 변환
        likeCount: post.likeCount,
        postView: post.postView,
        commentCount: post.commentCount,
        imageUrl: post.imageUrl,
      }));

      // 페이지에 맞는 게시물 목록을 필터링 및 광고 삽입
      const startIdx = (page - 1) * 14;
      const endIdx = startIdx + 14;
      const postsWithAd = [
        ...postListDto.slice(startIdx, startIdx + 4),
        adData,
        ...postListDto.slice(startIdx + 4, endIdx),
      ];

      setPosts(postsWithAd);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // 에러 발생 시 기본 상태로 설정하거나 사용자에게 에러 메시지 표시
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [board, currentPage, sortMethod, selectedTag, searchType, searchContent]);

  const handleSearch = ({ sort, tag, searchOption, keyword }) => {
    setSortMethod(sort);
    setSelectedTag(tag);
    setSearchType(searchOption);
    setSearchContent(keyword);
    setCurrentPage(1); // 검색 필터 변경 시 페이지를 1로 초기화
  };

  const handleWriteClick = () => {
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/createpost/${sport.toLowerCase()}`;
  };

  const handlePostClick = (postId) => {
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/post/${board.toLowerCase()}/${sport.toLowerCase()}/${postId}`;
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (filterParams) => {
    setSortMethod(filterParams.sort);
    setSelectedTag(filterParams.tag);
    setSearchType(filterParams.searchOption);
    setSearchContent(filterParams.keyword);
  };

  const handleTagChange = (filterParams) => {
    setSelectedTag(filterParams.tag);
  };

  const boardName =
    board === 'free'
      ? '자유 게시판'
      : board === 'review'
      ? '후기 게시판'
      : '정보 게시판';

  return (
    <div className="board-container">
      <div className="board-header">
        <BoardList boardName={boardName} />
        <WriteButton onWrite={handleWriteClick} />
      </div>
      <Filter
        tags={currentTags} // 현재 게시판에 맞는 태그 배열 전달
        onFilterChange={handleFilterChange}
        onTagChange={handleTagChange}
        onSearch={handleSearch}
      />
      <Postlist posts={posts} onDetail={handlePostClick} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
export default Community;
