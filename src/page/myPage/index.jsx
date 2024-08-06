import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ReactComponent as ProfileImage } from '../../assets/images/ProfileImage.svg';
import { ReactComponent as SoccerIcon } from '../../assets/images/Soccer.svg';
import { ReactComponent as BasketballIcon } from '../../assets/images/Basketball.svg';
import { ReactComponent as BaseballIcon } from '../../assets/images/Baseball.svg';
import { ReactComponent as BadmintonIcon } from '../../assets/images/Badminton.svg';
import { ReactComponent as BowlingIcon } from '../../assets/images/Bowling.svg';
import { ReactComponent as ClimbingIcon } from '../../assets/images/Climbing.svg';
import { ReactComponent as BoxingIcon } from '../../assets/images/Boxing.svg';
import { ReactComponent as TennisIcon } from '../../assets/images/Tennis.svg';
import { ReactComponent as CyclingIcon } from '../../assets/images/Cycle.svg';
import { ReactComponent as GolfIcon } from '../../assets/images/Golf.svg';
import { ReactComponent as SwimmingIcon } from '../../assets/images/Swimming.svg';
import { ReactComponent as RunningIcon } from '../../assets/images/Running.svg';
import { ReactComponent as PilatesIcon } from '../../assets/images/Pilates.svg';
import { ReactComponent as HikingIcon } from '../../assets/images/Hiking.svg';
import { ReactComponent as CrossFitIcon } from '../../assets/images/CrossFit.svg';
import { ReactComponent as TableTennisIcon } from '../../assets/images/TableTennis.svg';
import { ReactComponent as YogaIcon } from '../../assets/images/Yoga.svg';
import { ReactComponent as PostImg } from '../../assets/images/PostImg.svg';
import { ReactComponent as PostNoImg } from '../../assets/images/PostNoImg.svg';
import { ReactComponent as NextIcon } from '../../assets/images/Next.svg';
import { ReactComponent as DefaultProfile } from '../../assets/images/DefaultProfile.svg';
import { ReactComponent as GreenCheckIcon } from '../../assets/images/GreenCheckIcon.svg';
import axios from 'axios';

const sportsList = [
  { name: '축구', englishName: 'Soccer' },
  { name: '야구', englishName: 'Baseball' },
  { name: '농구', englishName: 'Basketball' },
  { name: '볼링', englishName: 'Bowling' },
  { name: '배드민턴', englishName: 'Badminton' },
  { name: '클라이밍', englishName: 'Climbing' },
  { name: '복싱', englishName: 'Boxing' },
  { name: '테니스', englishName: 'Tennis' },
  { name: '사이클', englishName: 'Cycling' },
  { name: '골프', englishName: 'Golf' },
  { name: '수영', englishName: 'Swimming' },
  { name: '런닝', englishName: 'Running' },
  { name: '필라테스', englishName: 'Pilates' },
  { name: '등산', englishName: 'Hiking' },
  { name: '크로스핏', englishName: 'CrossFit' },
  { name: '탁구', englishName: 'TableTennis' },
  { name: '요가', englishName: 'Yoga' },
];

const sportIcons = {
  Soccer: SoccerIcon,
  Baseball: BaseballIcon,
  Basketball: BasketballIcon,
  Badminton: BadmintonIcon,
  Bowling: BowlingIcon,
  Climbing: ClimbingIcon,
  Boxing: BoxingIcon,
  Tennis: TennisIcon,
  Cycling: CyclingIcon,
  Golf: GolfIcon,
  Swimming: SwimmingIcon,
  Running: RunningIcon,
  Pilates: PilatesIcon,
  Hiking: HikingIcon,
  CrossFit: CrossFitIcon,
  TableTennis: TableTennisIcon,
  Yoga: YogaIcon,
};

const renderSportIcon = (sport) => {
  const englishName = sportsList.find((s) => s.name === sport)?.englishName;
  const SvgComponent = sportIcons[englishName];
  return SvgComponent ? (
    <SvgComponent className="mypage-profile-info-sport-icon" />
  ) : null;
};

const Tags = ({ tagList, selectedTag, handleTagClick, getTagCount }) => {
  return (
    <div>
      <ul className="tag-container">
        {tagList.map((tag) => (
          <li
            key={tag}
            className={selectedTag === tag ? 'tag-list-selected' : 'tag-list'}
            onClick={() => handleTagClick(tag)}
          >
            {tag} ({getTagCount(tag)})
          </li>
        ))}
      </ul>
    </div>
  );
};

//페이지네이션
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
    <div className="mypage-pagination-container">
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

//날짜폼
const timeForm = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

//소모임 수락 모달
const RequestModal = ({
  toggleRequestModal,
  nickname,
  title,
  info,
  gender,
  age,
  onConfirm,
}) => {
  const handleRequestAllow = () => {
    const isConfirmed = window.confirm(
      '소모임 신청을 수락하시겠습니까?\n' +
        nickname +
        ' 님에게 소모임 참가용 오픈채팅방 주소가 전달됩니다.'
    );

    if (isConfirmed) {
      alert(nickname + ' 의 소모임 신청을 수락하였습니다.');
      onConfirm();
      toggleRequestModal();
    }
  };

  const handleRequestDeny = () => {
    const isConfirmed = window.confirm(
      '소모임 신청을 거절하시겠습니까?\n' +
        nickname +
        '의 재신청 및 참가 불가합니다.'
    );
    if (isConfirmed) {
      alert(nickname + ' 의 소모임 신청이 거절되었습니다.');
      onConfirm();
      toggleRequestModal();
    }
  };

  return (
    <div className="request-modal-back" onClick={toggleRequestModal}>
      <div className="modal-request" onClick={(e) => e.stopPropagation()}>
        <div className="request-head">
          <h1>소모임 수락</h1>
          <button onClick={toggleRequestModal}>&#x2715;</button>
        </div>
        <div className="request-nickname">
          <p>신청자</p> {nickname} ({gender},{age})
        </div>
        <div className="request-content">
          <p>소모임</p>
          <div className="request-content-in">{title}</div>
        </div>
        <div className="request-reason">
          <p>자기 소개</p>
          <div className="request-info">{info}</div>
        </div>
        <div className="request-btn">
          <button className="request-allow" onClick={handleRequestAllow}>
            수락하기
          </button>
          <button className="request-deny" onClick={handleRequestDeny}>
            거절하기
          </button>
        </div>
      </div>
    </div>
  );
};
//알림 목업 데이터
const generateMockNotifications = (numNotifications) => {
  const notifications = [];
  const sports = [
    '축구',
    '야구',
    '농구',
    '볼링',
    '배드민턴',
    '클라이밍',
    '복싱',
    '테니스',
    '사이클',
    '골프',
    '수영',
    '런닝',
    '필라테스',
    '등산',
    '크로스핏',
    '탁구',
    '요가',
  ];
  const boards = ['자유', '후기', '정보'];
  const notificationTypes = ['댓글', '소모임신청', '소모임수락', '소모임마감'];
  const names = ['홍길동', '김철수', '이영희', '박영수'];
  const genders = ['남', '여'];
  const isCloseEarly = [true, false];

  for (let i = 0; i < numNotifications; i++) {
    const type =
      notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    const notification = {
      id: i + 1,
      nickname: names[Math.floor(Math.random() * names.length)],
      gender: genders[Math.floor(Math.random() * genders.length)],
      age: Math.floor(Math.random() * 60) + 20, // 20에서 80 사이의 나이
      sport: sports[Math.floor(Math.random() * sports.length)],
      board: boards[Math.floor(Math.random() * boards.length)],
      close: isCloseEarly[Math.floor(Math.random() * isCloseEarly.length)],
      notificationType: type,
      postTitle: `게시글 제목 ${i + 1}`,
      notificationDate: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
      ).toISOString(),
      isRead: Math.random() < 0.5,
    };

    if (type === '댓글') {
      notification.commentContent = `댓글 내용 ${i + 1}`;
    } else if (type === '소모임신청') {
      notification.info = `자기소개 내용 ${i + 1}`;
    }

    notifications.push(notification);
  }

  return notifications;
};
const Posts = ({ posts, totalPages, currentPage, onPageChange }) => {
  const nav = useNavigate();

  const sportTypeMapping = {
    축구: 'soccer',
    농구: 'basketball',
    야구: 'baseball',
    볼링: 'bowling',
    배드민턴: 'badminton',
    클라이밍: 'climbing',
    복싱: 'boxing',
    테니스: 'tennis',
    사이클: 'cycling',
    골프: 'golf',
    수영: 'swimming',
    런닝: 'running',
    필라테스: 'pilates',
    등산: 'hiking',
    크로스핏: 'crossfit',
    탁구: 'tabletennis',
    요가: 'yoga',
  };

  const boardTypeMapping = {
    자유: 'free',
    후기: 'review',
    정보: 'info',
  };

  if (posts.length === 0) {
    return (
      <div className="contents-no-post-list-container">
        <p>작성한 글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="contents-post-container">
        {posts.map((post) => {
          const translatedSportType = sportTypeMapping[post.sports_name];
          const translatedBoardType = boardTypeMapping[post.board_name];
          return (
            <div key={post.post_id} className="contents-post-list-container">
              <div className="contents-post-details">
                {post.imgType ? (
                  <PostImg className="contents-post-icon" />
                ) : (
                  <PostNoImg className="contents-post-icon" />
                )}

                <div
                  className="contents-post-box"
                  onClick={() => {
                    if (post.board_name === '문의/신고') {
                      nav(`/inquiry/${post.post_id}`);
                    } else {
                      nav(
                        `/post/${translatedBoardType}/${translatedSportType}/${post.post_id}`
                      );
                    }
                  }}
                >
                  {post.board_name !== '문의/신고' && (
                    <div className="contents-post-sport">
                      [{post.sports_name}]
                    </div>
                  )}
                  <div className="contents-post-board">[{post.board_name}]</div>
                  <div className="contents-post-title">{post.post_title}</div>
                </div>
                {post.comment_count > 0 && (
                  <div className="contents-post-comments-count">
                    {post.comment_count}
                  </div>
                )}
              </div>
              <div className="contents-post-info">
                <div className="contents-post-time">
                  {timeForm(post.created_at)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

const Comments = ({ comments, totalPages, currentPage, onPageChange }) => {
  const nav = useNavigate();

  const sportTypeMapping = {
    축구: 'soccer',
    농구: 'basketball',
    야구: 'baseball',
    볼링: 'bowling',
    배드민턴: 'badminton',
    클라이밍: 'climbing',
    복싱: 'boxing',
    테니스: 'tennis',
    사이클: 'cycling',
    골프: 'golf',
    수영: 'swimming',
    런닝: 'running',
    필라테스: 'pilates',
    등산: 'hiking',
    크로스핏: 'crossfit',
    탁구: 'tabletennis',
    요가: 'yoga',
  };

  const boardTypeMapping = {
    자유: 'free',
    후기: 'review',
    정보: 'info',
  };

  if (comments.length === 0) {
    return (
      <div className="contents-no-comment-list-container">
        <p>작성한 댓글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="contents-comment-container">
        {comments.map((comment) => {
          const translatedSportType = sportTypeMapping[comment.sports_name];
          const translatedBoardType = boardTypeMapping[comment.board_name];
          return (
            <div className="contents-comment-list-container">
              <div
                className="contents-comment-list-container-1"
                onClick={() => {
                  nav(
                    `/post/${translatedBoardType}/${translatedSportType}/${comment.post_id}`
                  );
                }}
              >
                <div className="contents-comment">
                  {comment.comment_content}
                </div>
                <div className="contents-comment-post">
                  <div className="contents-comment-post-sport">
                    [{comment.sports_name}]
                  </div>
                  <div className="contents-comment-post-board">
                    [{comment.board_name}]
                  </div>
                  <div className="contents-comment-post-title">
                    {comment.post_title}
                  </div>
                </div>
              </div>
              <div className="contents-comment-list-container-2">
                {timeForm(comment.created_at)}
              </div>
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

const ParticipatedClub = ({ clubs, totalPages, currentPage, onPageChange }) => {
  const nav = useNavigate();

  const sportTypeMapping = {
    축구: 'soccer',
    농구: 'basketball',
    야구: 'baseball',
    볼링: 'bowling',
    배드민턴: 'badminton',
    클라이밍: 'climbing',
    복싱: 'boxing',
    테니스: 'tennis',
    사이클: 'cycling',
    골프: 'golf',
    수영: 'swimming',
    런닝: 'running',
    필라테스: 'pilates',
    등산: 'hiking',
    크로스핏: 'crossfit',
    탁구: 'tabletennis',
    요가: 'yoga',
  };

  if (clubs.length === 0) {
    return (
      <div className="contents-no-club-list-container">
        <div className="contents-club-head">
          <div className="contents-club-head-1">제목</div>
          <div className="contents-club-head-2">장소</div>
          <div className="contents-club-head-3">소모임장</div>
          <div className="contents-club-head-4">참여날짜</div>
        </div>
        <p>참여한 소모임이 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="contents-post-container">
        <div className="contents-club-head">
          <div className="contents-club-head-1">제목</div>
          <div className="contents-club-head-2">장소</div>
          <div className="contents-club-head-3">소모임장</div>
          <div className="contents-club-head-4">참여날짜</div>
        </div>
        {clubs.map((club) => {
          const translatedSportType = sportTypeMapping[club.sports_name];
          return (
            <div key={club.post_id} className="contents-club-list-container">
              <div className="contents-club-details">
                <div
                  className="contents-club-box"
                  onClick={() => {
                    nav(`/clubpost/${translatedSportType}/${club.post_id}`);
                  }}
                >
                  {club.imgType ? (
                    <PostImg className="contents-post-icon" />
                  ) : (
                    <PostNoImg className="contents-post-icon" />
                  )}
                  <div className="contents-club-sport">
                    [{club.sports_name}]
                  </div>
                  <div className="contents-club-title">{club.club_name}</div>
                </div>
              </div>
              <div className="contents-club-location">{club.club_place}</div>
              <div className="contents-club-leader">{club.user_nickname}</div>
              <div className="contents-club-time">
                {timeForm(club.club_date)}
              </div>
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

const LikedPosts = ({ posts, totalPages, currentPage, onPageChange }) => {
  const nav = useNavigate();

  const sportTypeMapping = {
    축구: 'soccer',
    농구: 'basketball',
    야구: 'baseball',
    볼링: 'bowling',
    배드민턴: 'badminton',
    클라이밍: 'climbing',
    복싱: 'boxing',
    테니스: 'tennis',
    사이클: 'cycling',
    골프: 'golf',
    수영: 'swimming',
    런닝: 'running',
    필라테스: 'pilates',
    등산: 'hiking',
    크로스핏: 'crossfit',
    탁구: 'tabletennis',
    요가: 'yoga',
  };

  const boardTypeMapping = {
    자유: 'free',
    후기: 'review',
    정보: 'info',
  };

  if (posts.length === 0) {
    return (
      <div className="contents-no-post-list-container">
        <p>좋아요 한 글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="contents-post-container">
        {posts.map((post) => {
          const translatedSportType = sportTypeMapping[post.sports_name];
          const translatedBoardType = boardTypeMapping[post.board_name];
          return (
            <div key={post.post_id} className="contents-post-list-container">
              <div className="contents-post-details">
                {post.post_image ? (
                  <PostImg className="contents-post-icon" />
                ) : (
                  <PostNoImg className="contents-post-icon" />
                )}

                <div
                  className="contents-post-box"
                  onClick={() => {
                    nav(
                      `/post/${translatedBoardType}/${translatedSportType}/${post.post_id}`
                    );
                  }}
                >
                  {' '}
                  <div className="contents-post-sport">
                    [{post.sports_name}]
                  </div>
                  <div className="contents-post-board">[{post.board_name}]</div>
                  <div className="contents-post-title">{post.post_title}</div>
                </div>
                {post.comment_count > 0 && (
                  <div className="contents-post-comments-count">
                    {post.comment_count}
                  </div>
                )}
              </div>
              <div className="contents-post-info">
                <div className="contents-post-writer">
                  {post.post_author_nickname}
                </div>
                ·
                <div className="contents-post-time">
                  {timeForm(post.created_at)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
const Activity = () => {
  const activityTags = ['작성글', '댓글', '참여한 소모임', '좋아요한 글'];
  const [selectedTag, setSelectedTag] = useState(activityTags[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [likes, setLikes] = useState([]);
  const [tagCounts, setTagCounts] = useState({
    posts: 0,
    comments: 0,
    clubs: 0,
    likes: 0,
  });

  const tagTranslations = {
    작성글: 'posts',
    댓글: 'comments',
    '참여한 소모임': 'clubs',
    '좋아요한 글': 'likes',
  };

  const selectedTagEnglish = tagTranslations[selectedTag];
  const accessToken = localStorage.getItem('accessToken');
  const fetchActivityData = async () => {
    try {
      const response = await axios.get(
        `api/mypage/activity/${selectedTagEnglish}?page=${currentPage}&&userNickname=${username}`,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      switch (selectedTagEnglish) {
        case 'posts':
          setPosts(response.data.posts_list);
          break;
        case 'comments':
          setComments(response.data.comment_list);
          break;
        case 'clubs':
          setClubs(response.data.clubs);

          break;
        case 'likes':
          setLikes(response.data.posts_list);
          break;
        default:
          break;
      }
      setTagCounts({
        posts: response.data.total_posts,
        comments: response.data.total_comments,
        clubs: response.data.total_participating_clubs,
        likes: response.data.total_likes,
      });
    } catch (error) {
      console.error('Error fetching activity data:', error);
    }
  };

  useEffect(() => {
    fetchActivityData();
  }, [currentPage, selectedTagEnglish, username]);

  const getTagCount = (tag) => {
    const tagKey = tagTranslations[tag];
    return tagCounts[tagKey];
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setCurrentPage(1); // 태그 변경 시 첫 페이지로 초기화
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    switch (selectedTag) {
      case '작성글':
        return (
          <Posts
            posts={posts}
            currentPage={currentPage}
            postsPerPage={postsPerPage}
            onPageChange={handlePageChange}
          />
        );
      case '댓글':
        return (
          <Comments
            comments={comments}
            currentPage={currentPage}
            postsPerPage={postsPerPage}
            onPageChange={handlePageChange}
          />
        );
      case '참여한 소모임':
        return (
          <ParticipatedClub
            clubs={clubs}
            currentPage={currentPage}
            postsPerPage={postsPerPage}
            onPageChange={handlePageChange}
          />
        );
      case '좋아요한 글':
        return (
          <LikedPosts
            posts={likes}
            currentPage={currentPage}
            postsPerPage={postsPerPage}
            onPageChange={handlePageChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="activity">
      <Tags
        tagList={activityTags}
        selectedTag={selectedTag}
        handleTagClick={handleTagClick}
        getTagCount={getTagCount}
      />
      {renderContent()}
    </div>
  );
};

const Following = ({ userName }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [follows, setFollows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const { username } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    fetchFollows();
  }, [currentPage]);

  const fetchFollows = async () => {
    try {
      const response = await axios.get(
        `/api/api/following?userNickname=${username}&&pageNum=${currentPage}`
      );
      const data = response.data;
      setFollows(data);
      console.log('팔로잉 호출 : ', response.data);
    } catch (error) {
      console.error('Error fetching follows:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!follows) {
    return (
      <div className="no-followers">
        <div className="following-head">
          <span>{userName}</span>
          <div>님이 팔로우 중인 멤버</div>
        </div>
        <p>팔로우 중인 유저가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="Following">
      <div className="following-head">
        <span>{userName}</span>
        <div>님이 팔로우 중인 멤버</div>
      </div>
      <div className="following-list">
        {follows.map((follow) => (
          <div
            key={follow.user_id}
            className="following-item"
            onClick={() => {
              nav(`/mypage/${follow.nick_name}`);
            }}
          >
            <div className="following-item-profile">
              {follow.userImageUrl ? (
                <img src={follow.user_image_url} alt={follow.nick_name} />
              ) : (
                <ProfileImage />
              )}
            </div>
            <div className="following-item-info">
              <div className="following-item-nickname">{follow.nick_name}</div>
              <div className="following-item-sport">
                <div className="following-item-sport-svg">
                  {renderSportIcon(follow.favorite_sports)}
                </div>
                {follow.favorite_sports}
              </div>
              <div className="following-item-stats">
                <div className="following-item-stats-1">
                  팔로워 <span>{follow.follower_number}</span>
                </div>
                <div className="following-item-stats-1">
                  팔로잉 <span>{follow.following_number}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

const Follower = ({ userName }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [follows, setFollows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const nav = useNavigate();
  const { username } = useParams();
  useEffect(() => {
    fetchFollows();
  }, [currentPage]);

  const fetchFollows = async () => {
    try {
      const response = await axios.get(
        `/api/api/follower?userNickname=${username}&&pageNum=${currentPage}`
      );
      const { data } = response;
      setFollows(data);
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!follows) {
    return (
      <div className="no-followers">
        <div className="following-head">
          <span>{userName}</span>
          <div>님을 팔로우 중인 멤버</div>
        </div>
        <p>팔로우 중인 유저가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="Following">
      <div className="following-head">
        <span>{userName}</span>
        <div>님이 팔로우 중인 멤버</div>
      </div>
      <div className="following-list">
        {follows.map((follow) => (
          <div
            key={follow.userId}
            className="following-item"
            onClick={() => {
              nav(`/mypage/${follow.nick_name}`);
            }}
          >
            <div className="following-item-profile">
              {follow.user_image_url ? (
                <img src={follow.user_image_url} alt={follow.nick_name} />
              ) : (
                <ProfileImage />
              )}
            </div>
            <div className="following-item-info">
              <div className="following-item-nickname">{follow.nick_name}</div>
              <div className="following-item-sport">
                <div className="following-item-sport-svg">
                  {renderSportIcon(follow.favorite_sports)}
                </div>
                {follow.favorite_sports}
              </div>
              <div className="following-item-stats">
                <div className="following-item-stats-1">
                  팔로워 <span>{follow.follower_number}</span>
                </div>
                <div className="following-item-stats-1">
                  팔로잉 <span>{follow.following_number}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

const Notification = () => {
  const [notifications, setNotifications] = useState(
    generateMockNotifications(30)
  );
  const [selectedTag, setSelectedTag] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const nav = useNavigate();

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAsProcessed = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isProcessed: true, isRead: true }
          : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (selectedTag === '전체') return true;
    if (selectedTag === '읽음') return notification.isRead;
    if (selectedTag === '안읽음') return !notification.isRead;
    return true;
  });

  const sortedNotifications = filteredNotifications.sort(
    (a, b) => new Date(b.notificationDate) - new Date(a.notificationDate)
  );

  const totalPages = Math.ceil(
    sortedNotifications.length / notificationsPerPage
  );
  const startIndex = (currentPage - 1) * notificationsPerPage;
  const endIndex = startIndex + notificationsPerPage;
  const currentNotifications = sortedNotifications.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const sportTypeMapping = {
    축구: 'soccer',
    농구: 'basketball',
    야구: 'baseball',
    볼링: 'bowling',
    배드민턴: 'badminton',
    클라이밍: 'climbing',
    복싱: 'boxing',
    테니스: 'tennis',
    사이클: 'cycling',
    골프: 'golf',
    수영: 'swimming',
    런닝: 'running',
    필라테스: 'pilates',
    등산: 'hiking',
    크로스핏: 'crossfit',
    탁구: 'tabletennis',
    요가: 'yoga',
  };

  const boardTypeMapping = {
    자유: 'free',
    후기: 'review',
    정보: 'info',
  };

  console.log(notifications); // 디버깅: notification 객체의 값을 출력하여 확인

  return (
    <div>
      <Tags
        tagList={['전체', '읽음', '안읽음']}
        selectedTag={selectedTag}
        handleTagClick={handleTagClick}
        getTagCount={(tag) =>
          notifications.filter((notification) => {
            if (tag === '전체') return true;
            if (tag === '읽음') return notification.isRead;
            if (tag === '안읽음') return !notification.isRead;
            return true;
          }).length
        }
      />
      {currentNotifications.length === 0 ? (
        <div className="no-notifications">알림이 없습니다</div>
      ) : (
        currentNotifications.map((notification) => {
          const translatedSportType = sportTypeMapping[notification.sport];
          const translatedBoardType = boardTypeMapping[notification.board];
          return (
            <div
              key={notification.id}
              className={`notification-item ${
                notification.isRead ? 'read' : 'unread'
              }`}
            >
              <div className="notification-content">
                {notification.notificationType === '댓글' && (
                  <div
                    onClick={() => {
                      nav(
                        `/post/${translatedBoardType}/${translatedSportType}/${notification.id}`
                      );
                    }}
                  >
                    <div className="notification-content-head">
                      <div className="notification-content-title">
                        <span>{notification.nickname}</span> 님이 게시글에
                        댓글을 작성했습니다
                      </div>
                      <div className="notification-content-date">
                        {timeForm(notification.notificationDate)}
                      </div>
                    </div>
                    <div className="notification-contents">
                      {notification.commentContent}
                    </div>
                    <div className="notification-content-3">
                      <div className="notification-content-src">
                        <span>
                          [{notification.sport}][{notification.board}]
                        </span>
                        {notification.postTitle}
                      </div>
                      <div className="notification-actions">
                        {!notification.isRead && (
                          <button onClick={() => markAsRead(notification.id)}>
                            읽음
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {notification.notificationType === '소모임신청' && (
                  <div>
                    <div className="notification-content-head">
                      <div className="notification-content-title">
                        <span>{notification.nickname}</span> 님이 소모임 신청을
                        보냈습니다
                      </div>
                      <div className="notification-content-date">
                        {timeForm(notification.notificationDate)}
                      </div>
                    </div>
                    <div
                      className={`notification-contents ${
                        notification.isProcessed ? 'disabled' : ''
                      }`}
                      onClick={() => {
                        if (!notification.isProcessed) {
                          markAsRead(notification.id);
                          openModal(notification);
                        }
                      }}
                    >
                      <span>[클릭]</span> 자기소개 보러 가기
                    </div>
                    <div className="notification-content-3">
                      <div
                        className="notification-content-src"
                        onClick={() => {
                          nav(
                            `/clubpost/${translatedSportType}/${notification.id}`
                          );
                        }}
                      >
                        <span>[{notification.sport}]</span>{' '}
                        {notification.postTitle}
                      </div>
                      <div className="notification-actions">
                        {!notification.isRead && (
                          <button onClick={() => markAsRead(notification.id)}>
                            읽음
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {notification.notificationType === '소모임수락' && (
                  <div>
                    <div className="notification-content-head">
                      <div className="notification-content-title">
                        <span>{notification.nickname}</span> 님이 소모임 신청을
                        수락했습니다
                      </div>
                      <div className="notification-content-date">
                        {timeForm(notification.notificationDate)}
                      </div>
                    </div>
                    <div className="notification-contents">
                      <span>[클릭]</span> 오픈 채팅방 참여하러 가기
                    </div>
                    <div className="notification-content-3">
                      <div
                        className="notification-content-src"
                        onClick={() => {
                          nav(
                            `/clubpost/${translatedSportType}/${notification.id}`
                          );
                        }}
                      >
                        <span>[{notification.sport}]</span>{' '}
                        {notification.postTitle}
                      </div>
                      <div className="notification-actions">
                        {!notification.isRead && (
                          <button onClick={() => markAsRead(notification.id)}>
                            읽음
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {notification.notificationType === '소모임마감' && (
                  <div
                    onClick={() => {
                      nav(
                        `/clubpost/${translatedSportType}/${notification.id}`
                      );
                    }}
                  >
                    <div className="notification-content-head">
                      <div className="notification-content-title">
                        <div>소모임이 마감되었습니다.</div>
                      </div>
                      <div className="notification-content-date">
                        {timeForm(notification.notificationDate)}
                      </div>
                    </div>
                    <div className="notification-contents">
                      {notification.close
                        ? `${notification.nickname}님이 소모임을 마감했습니다.`
                        : '마감 예정일이 지나 소모임이 마감되었습니다.'}
                    </div>
                    <div className="notification-content-3">
                      <div className="notification-content-src">
                        <span>[{notification.sport}]</span>{' '}
                        {notification.postTitle}
                      </div>
                      <div className="notification-actions">
                        {!notification.isRead && (
                          <button onClick={() => markAsRead(notification.id)}>
                            읽음
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      {isModalOpen && modalContent && (
        <RequestModal
          toggleRequestModal={closeModal}
          nickname={modalContent.nickname}
          title={modalContent.postTitle}
          info={modalContent.commentContent || modalContent.info}
          gender={modalContent.gender}
          age={modalContent.age}
          onConfirm={() => markAsProcessed(modalContent.id)}
        />
      )}
    </div>
  );
};

const MyPage = () => {
  const nav = useNavigate();
  const { username } = useParams();
  const [selectedActivity, setSelectedActivity] = useState('활동 내역');
  const [user, setUser] = useState({
    id: null,
    profileImage: <ProfileImage />,
    nickname: '',
    sport: '',
    follower: 0,
    following: 0,
    club: 0,
  });
  const [isFollow, setIsFollow] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        const userId = localStorage.getItem('userId');

        const response = await axios.get(
          `/api/api/header?userId=${userId}&&userNickname=${username}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // 헤더에 토큰 추가
            },
          }
        );
        const {
          nickname,
          top_priority_sports_name,
          follower_num,
          followed_num,
          participating_club_num,
          user_profile_image_url,
        } = response.data;

        // 상태 업데이트
        setUser({
          profileImage: user_profile_image_url || <ProfileImage />,
          nickname: nickname,
          sport: top_priority_sports_name,
          follower: follower_num,
          following: followed_num,
          club: participating_club_num,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [username]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUser((prevUser) => ({
        ...prevUser,
        profileImage: <img src={reader.result} alt="Profile" />,
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const toggleFollowing = () => {
    setIsFollow(!isFollow);
  };

  const toggleModifying = () => {
    setIsModified(!isModified);
  };

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
  };

  const [isFocused, setIsFocused] = useState(false);
  const [isUnique, setIsUnique] = useState(true);
  const [showError, setShowError] = useState(false);
  const [inputClass, setInputClass] = useState('');
  const [nickname, setNickname] = useState(user.nickname);
  const [selectedButtons, setSelectedButtons] = useState(user.sport);

  const sports = [
    '축구',
    '야구',
    '농구',
    '볼링',
    '배드민턴',
    '클라이밍',
    '복싱',
    '테니스',
    '사이클',
    '골프',
    '수영',
    '런닝',
    '발레',
    '필라테스',
    '등산',
    '크로스핏',
    '탁구',
    '요가',
  ];

  useEffect(() => {
    setNickname(user.nickname);
    setSelectedButtons(user.sport);
  }, [user]);

  const existingNicknames = ['user1', 'user2', 'user3']; // 실제 데이터로 대체

  const validateNickname = (name) => {
    if (!/^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{3,12}$/.test(name)) {
      alert('한글, 영어, 숫자포함 3자~12자 가능합니다');
      setInputClass('error');
      return false;
    }
    setInputClass('');
    return true;
  };

  const checkNicknameUnique = (name) => {
    if (existingNicknames.includes(name)) {
      setIsUnique(false);
      setInputClass('error');
      return false;
    }
    setIsUnique(true);
    setInputClass('success');
    return true;
  };

  const handleChange = (e) => {
    setNickname(e.target.value);
    setInputClass('');
    setShowError(false);
  };

  const handleCheckNickname = () => {
    setShowError(true);
    if (validateNickname(nickname)) {
      checkNicknameUnique(nickname);
    } else {
      setIsUnique(true);
    }
  };

  const handleBtnClick = (button) => {
    setSelectedButtons((prevSelected) => {
      if (prevSelected.includes(button)) {
        return prevSelected.filter((item) => item !== button);
      } else {
        if (prevSelected.length < 5) {
          return [...prevSelected, button];
        } else {
          alert('최대 5개까지 선택 가능합니다.');
          return prevSelected;
        }
      }
    });
  };

  const getBadgeNumber = (button) => {
    return selectedButtons.indexOf(button) + 1;
  };

  const handleComplete = () => {
    if (inputClass !== 'success') {
      alert('중복확인을 완료해야 합니다');
      return;
    }
    setUser((prevUser) => ({
      ...prevUser,
      nickname: nickname,
      sport: selectedButtons,
    }));
    toggleModifying();
    nav(`/mypage/${nickname}`);
  };

  if (isModified) {
    return (
      <div className="mypage-container">
        <div className="mypage-title">마이페이지</div>
        <div className="mypage-modified-profile-container-wrap">
          <div className="mypage-modified-profile-container">
            <div>
              <div className="mypage-profile-image-wrap">
                {user.profileImage === null ? (
                  <DefaultProfile className="mypage-profile-image" />
                ) : (
                  user.profileImage
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>
              <button
                className="my-page-modify-btn-profile-img"
                onClick={handleButtonClick}
              >
                프로필 이미지 수정
              </button>
            </div>
            <div className="mypage-profile-info-container">
              <div className="mypage-profile-info-namebox">
                <div className="mypage-profile-info-name">{user.nickname}</div>
              </div>
              <div className="mypage-profile-info-sportsbox">
                {renderSportIcon(user.sport)}
                <div className="mypage-profile-info-sport-name">
                  {user.sport}
                </div>
              </div>
              <div className="mypage-profile-info-activitybox">
                <div className="mypage-profile-info-activity-followingbox">
                  <div className="mypage-profile-info-activity-following">
                    팔로잉
                  </div>
                  <div className="mypage-profile-info-activity-followingnumber">
                    {user.following}
                  </div>
                </div>
                <div className="mypage-profile-info-activity-followerbox">
                  <div className="mypage-profile-info-activity-follower">
                    팔로워
                  </div>
                  <div className="mypage-profile-info-activity-followernumber">
                    {user.follower}
                  </div>
                </div>
                <div className="mypage-profile-info-activity-clubbox">
                  <div className="mypage-profile-info-activity-club">
                    참여한 소모임 수
                  </div>
                  <div className="mypage-profile-info-activity-clubnumber">
                    {user.club}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-page-modified-setting">
          <div className="my-page-modified-nickWrap">
            <h2 className="my-page-modified-nickSet">닉네임 설정</h2>
            <div className="my-page-modified-inputWrap">
              <input
                placeholder="닉네임은 영어, 숫자포함 3자에서 12자까지 설정할 수 있어요"
                type="text"
                value={nickname}
                onChange={handleChange}
                className={`${inputClass} ${isFocused ? 'focused' : ''}`}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <button className="redund" onClick={handleCheckNickname}>
                중복확인
              </button>
            </div>
            {showError && !isUnique && (
              <div className="message">이미 존재하는 닉네임입니다</div>
            )}
            {showError && isUnique && inputClass === 'success' && (
              <div className="successMessage">사용가능한 닉네임입니다</div>
            )}
          </div>
          <div className="my-page-modified-pickSports">
            <h2 className="my-page-modified-sportsSet">선호 종목 선택</h2>
            <h4 className="my-page-modified-sportsSetInfo">
              최대 5개까지 설정 가능합니다. 추후에 변경 가능합니다.
            </h4>
            <div className="btnContainer">
              {sports.map((button) => (
                <div key={button} className="buttonWrap">
                  <button
                    className={`sportsButton ${
                      selectedButtons.includes(button)
                        ? 'selectedSportsButton'
                        : ''
                    }`}
                    onClick={() => handleBtnClick(button)}
                  >
                    {button}
                  </button>
                  {selectedButtons.includes(button) && (
                    <span className="badge">{getBadgeNumber(button)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="wrap">
          <button
            className="my-page-modified-Complete"
            onClick={handleComplete}
          >
            설정완료
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-container">
      <div className="mypage-title">마이페이지</div>
      <div className="mypage-profile-container">
        <div className="mypage-profile-image-wrap">
          {user.profileImage === null ? (
            <DefaultProfile className="mypage-profile-image" />
          ) : (
            user.profileImage
          )}
        </div>
        <div className="mypage-profile-info-container">
          <div className="mypage-profile-info-namebox">
            <div className="mypage-profile-info-name">{user.nickname}</div>
            <div>
              {user.nickname === username ? (
                <button
                  className="mypage-profile-info-edit"
                  onClick={toggleModifying}
                >
                  회원정보 수정
                </button>
              ) : (
                <button
                  className="mypage-profile-info-edit"
                  onClick={toggleFollowing}
                >
                  팔로우 {isFollow ? <GreenCheckIcon /> : ' +'}
                </button>
              )}
            </div>
          </div>
          <div className="mypage-profile-info-sportsbox">
            {renderSportIcon(user.sport)}
            <div className="mypage-profile-info-sport-name">{user.sport}</div>
          </div>
          <div className="mypage-profile-info-activitybox">
            <div className="mypage-profile-info-activity-followingbox">
              <div className="mypage-profile-info-activity-following">
                팔로잉
              </div>
              <div className="mypage-profile-info-activity-followingnumber">
                {user.following}
              </div>
            </div>
            <div className="mypage-profile-info-activity-followerbox">
              <div className="mypage-profile-info-activity-follower">
                팔로워
              </div>
              <div className="mypage-profile-info-activity-followernumber">
                {user.follower}
              </div>
            </div>
            <div className="mypage-profile-info-activity-clubbox">
              <div className="mypage-profile-info-activity-club">
                참여한 소모임 수
              </div>
              <div className="mypage-profile-info-activity-clubnumber">
                {user.club}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mypage-detail-container">
        <div className="mypage-detail-left-container">
          <ul className="mypage-detail-left-list-container">
            {['활동 내역', '팔로잉', '팔로워', '알림'].map((activity) => (
              <li
                key={activity}
                className={`mypage-detail-left-list ${
                  selectedActivity === activity
                    ? 'mypage-detail-left-list-selected'
                    : ''
                }`}
                onClick={() => handleActivityClick(activity)}
              >
                {activity}
              </li>
            ))}
          </ul>
        </div>
        <div
          className={`mypage-detail-right-container ${
            selectedActivity === '활동 내역' ? 'selected-activity' : ''
          }`}
        >
          {selectedActivity === '활동 내역' && <Activity />}
          {selectedActivity === '팔로잉' && (
            <Following userName={user.nickname} />
          )}
          {selectedActivity === '팔로워' && (
            <Follower userName={user.nickname} />
          )}
          {selectedActivity === '알림' && <Notification />}
        </div>
      </div>
    </div>
  );
};
export default MyPage;
