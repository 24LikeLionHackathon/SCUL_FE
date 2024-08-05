import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as ViewsIcon } from '../../assets/images/ViewsIcon.svg';
import { ReactComponent as LikesIcon_Red } from '../../assets/images/LikesIcon_Red.svg';
import { ReactComponent as ChatIcon } from '../../assets/images/ChatIcon.svg';
import { ReactComponent as LikesIcon_Red_Full } from '../../assets/images/LikesIcon_Red_Full.svg';
import { ReactComponent as DefaultProfile } from '../../assets/images/DefaultProfile.svg';
import { ReactComponent as PostImg } from '../../assets/images/PostImg.svg';
import { ReactComponent as PostNoImg } from '../../assets/images/PostNoImg.svg';
import { ReactComponent as LikesIcon } from '../../assets/images/LikesIcon.svg';
import { ReactComponent as GreenCheckIcon } from '../../assets/images/GreenCheckIcon.svg';
import axios from 'axios';

//시간 나타내는 폼
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

//댓글 컴포넌트
const Comment = ({
  picture,
  nickname,
  content,
  createdAt,
  userId,
  currentUserId,
  toggleReportModal,
  updateComment,
  commentIndex,
}) => {
  const [isCommentRevise, setIsCommentRevise] = useState(false);
  const [alterText, setAlterText] = useState('기본 글');

  const onChange = (e) => {
    setAlterText(e.target.value);
  };

  const submitCommentRevise = () => {
    updateComment(alterText, commentIndex);
    setIsCommentRevise(!isCommentRevise);
  };

  const toggleCommentRevise = () => {
    setIsCommentRevise(!isCommentRevise);
    setAlterText(content);
  };

  return (
    <div className="post-comments">
      <div className="post-comment-content-wrap">
        <div className="post-comment-header">
          {picture ? (
            <img
              src={picture}
              alt={nickname}
              className="post-comment-profileImg"
            />
          ) : (
            <DefaultProfile className="post-comment-profileImg" />
          )}
          <span className="post-comment-nickname">{nickname}</span>
        </div>
        {isCommentRevise ? (
          <div className="create-post-comment">
            <div className="add-post-comment">
              <textarea
                placeholder="댓글을 입력해 주세요"
                maxlength="326"
                className="post-comment-input"
                onChange={onChange}
              ></textarea>
              <button
                className="post-comment-submit"
                onClick={submitCommentRevise}
              >
                수정
              </button>
            </div>
          </div>
        ) : (
          <div className="post-comment-content">{content}</div>
        )}

        <div className="post-comment-footer">
          <span className="post-comment-time">{timeForm(createdAt)}</span>
          {userId === currentUserId && (
            <>
              <button
                className="post-comment-action"
                onClick={toggleCommentRevise}
              >
                수정
              </button>
              <button className="post-comment-action">삭제</button>
            </>
          )}
          <button
            className="post-comment-action"
            onClick={() => toggleReportModal(nickname, content)}
          >
            신고
          </button>
        </div>
      </div>
    </div>
  );
};

const MorePostList = ({ posts, boardName }) => {
  return (
    <ul className="more-post-lists">
      {posts.map((post) => (
        <li key={post.id} className="more-post-item">
          <div className="more-post-head">
            {boardName === '자유' ? (
              ''
            ) : (
              <div className="more-post-tag">{post.tag}</div>
            )}
            {post.contentImg === 'true' ? (
              <PostImg className="more-post-img" />
            ) : (
              <PostNoImg className="more-post-img" />
            )}
            <div className="more-post-intitle">{post.title}</div>
            <div className="more-post-comments">{post.comments}</div>
          </div>
          <div className="more-post-foot">
            <div className="more-post-nickname">{post.nickname}</div>·
            <div className="more-post-createdAt">
              {timeForm(post.createdAt)}
            </div>
            ·
            <span>
              <ViewsIcon className="more-post-viewIcon" /> {post.views}
            </span>
            ·
            <span>
              <LikesIcon className="more-post-likesIcon" />{' '}
              <span className="more-post-likesNum">{post.likes}</span>
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

//게시글 mockdata
// const mockPost = {
//     id: 8,
//     board: '정보',
//     tag: '대회',
//     title: '제목입니당',
//     createdAt: '2024-07-05T12:00:00Z',
//     likes: 10,
//     views: 100,
//     comments: 5,
//     content: '게시글내용입니다 게시글 내용 게시글 내용입니다',
//     nickname: '도라산너구리',
//     profileImg: '',
//     comment: [
//         {
//             picture: '',
//             nickname: '도라산너구리',
//             content: '댓글내용입니다만여기까지가스무글자입니다여기부터오버',
//             createdAt: '2024-07-12T12:00:00Z',
//         },
//         {
//             picture: '',
//             nickname: '스트로베리',
//             content: '비밀 댓글입니다',
//             createdAt: '2024-07-19T12:00:00Z',
//         },
//         {
//             picture: '',
//             nickname: '도라산너구리',
//             content: '비밀 댓글입니다',
//             createdAt: '2024-07-29T12:00:00Z',
//         },
//     ],
// };

//게시글더보기용 mockdata
const mockPosts = [
  {
    id: 1,
    board: '후기',
    tag: '소모임',
    title: '운동 소모임 후기',
    createdAt: '2024-03-11T15:23:45Z',
    likes: 120,
    views: 850,
    comments: 35,
    nickname: '운동왕',
    contentImg: 'true',
  },
  {
    id: 2,
    board: '정보',
    tag: '대회',
    title: '최신 대회 정보',
    createdAt: '2024-04-22T11:10:30Z',
    likes: 95,
    views: 625,
    comments: 22,
    nickname: '스포츠매니아',
    contentImg: 'false',
  },
  {
    id: 3,
    board: '자유',
    tag: '',
    title: '자유롭게 이야기해요',
    createdAt: '2024-01-15T09:20:15Z',
    likes: 50,
    views: 450,
    comments: 10,
    nickname: '토크고수',
    contentImg: 'false',
  },
  {
    id: 4,
    board: '후기',
    tag: '용품',
    title: '새로운 운동 용품 사용기',
    createdAt: '2024-06-05T17:45:00Z',
    likes: 160,
    views: 930,
    comments: 45,
    nickname: '용품전문가',
    contentImg: 'false',
  },
  {
    id: 5,
    board: '정보',
    tag: '경기 일정',
    title: '다음 주 경기 일정',
    createdAt: '2024-02-20T14:15:00Z',
    likes: 85,
    views: 610,
    comments: 18,
    nickname: '일정관리자',
    contentImg: 'false',
  },
  {
    id: 6,
    board: '자유',
    tag: '',
    title: '일상 이야기',
    createdAt: '2024-07-01T10:05:00Z',
    likes: 30,
    views: 310,
    comments: 7,
    nickname: '일상러버',
    contentImg: 'false',
  },
  {
    id: 7,
    board: '후기',
    tag: '운동',
    title: '새로운 운동 시작 후기',
    createdAt: '2024-05-18T13:30:00Z',
    likes: 140,
    views: 880,
    comments: 40,
    nickname: '새내기운동맨',
    contentImg: 'false',
  },
  {
    id: 9,
    board: '자유',
    tag: '',
    title: '참여 후기',
    createdAt: '2024-02-08T12:45:00Z',
    likes: 45,
    views: 380,
    comments: 12,
    nickname: '참여마스터',
    contentImg: 'true',
  },
  {
    id: 10,
    board: '후기',
    tag: '시설',
    title: '새로운 운동 시설 후기',
    createdAt: '2024-06-21T16:20:00Z',
    likes: 155,
    views: 910,
    comments: 42,
    nickname: '시설체험러',
    contentImg: 'false',
  },
  {
    id: 11,
    board: '정보',
    tag: '대회',
    title: '다음 대회 준비사항',
    createdAt: '2024-05-10T14:10:00Z',
    likes: 92,
    views: 595,
    comments: 20,
    nickname: '대회준비생',
    contentImg: 'false',
  },
  {
    id: 12,
    board: '자유',
    tag: '',
    title: '오늘의 일상',
    createdAt: '2024-04-28T11:05:00Z',
    likes: 37,
    views: 340,
    comments: 9,
    nickname: '오늘하루',
    contentImg: 'true',
  },
  {
    id: 13,
    board: '후기',
    tag: '소모임',
    title: '소모임 후기',
    createdAt: '2024-01-18T15:25:00Z',
    likes: 128,
    views: 845,
    comments: 36,
    nickname: '소모임전문가',
    contentImg: 'true',
  },
  {
    id: 14,
    board: '정보',
    tag: '경기 일정',
    title: '다가오는 경기 일정',
    createdAt: '2024-03-12T18:35:00Z',
    likes: 78,
    views: 560,
    comments: 16,
    nickname: '경기예고자',
    contentImg: 'true',
  },
  {
    id: 15,
    board: '자유',
    tag: '',
    title: '자유롭게 이야기합시다',
    createdAt: '2024-07-07T13:00:00Z',
    likes: 55,
    views: 410,
    comments: 14,
    nickname: '자유로운영혼',
    contentImg: 'false',
  },
  {
    id: 16,
    board: '후기',
    tag: '용품',
    title: '운동용품 리뷰',
    createdAt: '2024-06-30T09:30:00Z',
    likes: 175,
    views: 960,
    comments: 48,
    nickname: '용품박사',
    contentImg: 'true',
  },
  {
    id: 17,
    board: '정보',
    tag: '경기 결과',
    title: '최근 경기 결과 분석',
    createdAt: '2024-04-04T20:40:00Z',
    likes: 112,
    views: 690,
    comments: 27,
    nickname: '경기해설자',
    contentImg: 'false',
  },
  {
    id: 18,
    board: '자유',
    tag: '',
    title: '일상 토크',
    createdAt: '2024-02-02T12:30:00Z',
    likes: 42,
    views: 365,
    comments: 11,
    nickname: '토크마니아',
    contentImg: 'false',
  },
  {
    id: 19,
    board: '후기',
    tag: '운동',
    title: '새로운 운동 도전기',
    createdAt: '2024-05-27T17:50:00Z',
    likes: 148,
    views: 890,
    comments: 39,
    nickname: '운동도전자',
    contentImg: 'true',
  },
  {
    id: 20,
    board: '정보',
    tag: '대회',
    title: '대회 정보 공유',
    createdAt: '2024-06-15T14:55:00Z',
    likes: 87,
    views: 575,
    comments: 19,
    nickname: '정보공유자',
    contentImg: 'true',
  },
];

//모달(복사)
const Modal = () => (
  <div className="modal-copyhref">
    <p>링크 복사가 완료되었습니다</p>
  </div>
);

//모달(신고)
const ReportModal = ({ toggleReportModal, nickname, content }) => {
  const [reportReason, setReportReason] = useState('');

  const handleReportClick = () => {
    if (reportReason.trim() === '') {
      alert('내용을 작성해주세요.');
    } else {
      alert('신고가 완료되었습니다.');
      toggleReportModal(); // 신고 처리 함수 호출
    }
  };

  return (
    <div className="report-modal-back" onClick={toggleReportModal}>
      <div className="modal-report" onClick={(e) => e.stopPropagation()}>
        <div className="report-head">
          <h1>신고하기</h1>
          <button onClick={toggleReportModal}>&#x2715;</button>
        </div>
        <div className="report-nickname">
          <p>작성자</p> {nickname}
        </div>
        <div className="report-content">
          <p>내용</p>
          <div className="report-content-in">{content}</div>
        </div>
        <div className="report-reason">
          <p>신고 사유</p>
          <textarea
            placeholder="신고 사유를 작성해 주세요"
            maxlength="178"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="input-report"
          />
        </div>
        <div className="report-btn">
          <button className="submit-report" onClick={handleReportClick}>
            신고하기
          </button>
        </div>
      </div>
    </div>
  );
};

const Post = () => {
  const nav = useNavigate();
  const { sport, board, postId } = useParams(); // Extract parameters from URL에서 가져옵니다
  const [postData, setPostData] = useState(null);
  const [isLike, setIsLike] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalReport, setModalReport] = useState(false);
  const [reportInfo, setReportInfo] = useState({ nickname: '', content: '' });
  const currentUserNickname = '스트로베리'; // 임시 현재 유저 닉네임

  // Log postId to check if it is being extracted correctly
  useEffect(() => {
    console.log('postId:', postId);
  }, [postId]);

  // Fetch post data
  useEffect(() => {
    const fetchPostData = async () => {
      if (postId) {
        // Ensure postId is defined before making the API call
        try {
          const response = await axios.get(`/api/post/${postId}`);
          console.log('Post data:', response.data); // Log the response data
          setPostData(response.data);
        } catch (error) {
          console.error('Failed to fetch post data:', error);
        }
      } else {
        console.error('Post ID is not defined');
      }
    };

    fetchPostData();
  }, [postId]);
  const boardName = postData
    ? postData.boardName === 'free'
      ? '자유'
      : postData.boardName === 'review'
      ? '후기'
      : '정보'
    : '';

  const handlePostReviseClick = () => {
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/createpost/${sport.toLowerCase()}`;
  };

  useEffect(() => {
    if (modal) {
      const timer = setTimeout(() => {
        setModal(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [modal]);

  const currentUrl = window.location.href;
  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setModal(true);
  };

  const toggleReportModal = (nickname = '', content = '') => {
    setReportInfo({ nickname, content });
    setModalReport(!modalReport);
  };

  const toggleFollows = () => {
    setIsFollow(!isFollow);
  };

  const toggleLikes = async () => {
    try {
      setIsLike(!isLike);
      const likeChange = isLike ? -1 : 1;
      await axios.post(`/api/post/${postId}/like`, { change: likeChange }); // 실제 API 엔드포인트에 맞게 수정
      setPostData((prevData) => ({
        ...prevData,
        likeCount: prevData.likeCount + likeChange,
      }));
    } catch (error) {
      console.error('좋아요 업데이트 오류:', error);
    }
  };

  const handleButton = async () => {
    let redirectUrl = '';
    switch (boardName) {
      case '자유':
        redirectUrl = `/community/free/${sport.toLowerCase()}`;
        break;
      case '후기':
        redirectUrl = `/community/review/${sport.toLowerCase()}`;
        break;
      case '정보':
        redirectUrl = `/community/info/${sport.toLowerCase()}`;
        break;
      default:
        redirectUrl = '/';
    }
    window.location.href = redirectUrl;
  };

  const updateComment = async (updatedContent, commentIndex) => {
    try {
      await axios.put(
        `/api/post/${postId}/comment/${postData.comments[commentIndex].id}`,
        { content: updatedContent }
      );
      setPostData((prevPost) => {
        const updatedComments = [...prevPost.comments];
        updatedComments[commentIndex] = {
          ...updatedComments[commentIndex],
          content: updatedContent,
          createdAt: new Date().toISOString(),
        };
        return {
          ...prevPost,
          comments: updatedComments,
        };
      });
    } catch (error) {
      console.error('댓글 수정 오류:', error);
    }
  };

  const filteredPosts = mockPosts
    .filter((post) => post.board === boardName)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


  const className = `${modalReport ? 'report-modal-back' : ''}`;

  if (!postData) return <div>Loading...</div>; // 데이터 로딩 중일 때 표시할 컴포넌트

  return (
    <div className="Post">
      <div className="post-content-wrap">
        <button className="post-board-btn" onClick={handleButton}>
          {boardName} 게시판 &#10095;
        </button>
        <div className="post-title-wrap">
          <div className="post-title-1">
            {boardName === '자유' ? (
              ''
            ) : (
              <div className="post-tag">{postData.tagName}</div>
            )}
            <div className="post-title">{postData.postTitle}</div>
          </div>
          <div className="post-title-2">
            <button className="post-profile_btn" onClick={() => nav('/myPage')}>
              {postData.profileImg ? (
                <img
                  src={postData.profileImg}
                  alt={postData.postTitle}
                  className="post-profileImg"
                />
              ) : (
                <DefaultProfile className="post-profileImg" />
              )}
              <span className="post-nickname"> {postData.nickname}</span>
            </button>
            {postData.nickname === currentUserNickname ? (
              ''
            ) : (
              <button className="post-follow" onClick={toggleFollows}>
                팔로우 {isFollow ? <GreenCheckIcon /> : '+'}
              </button>
            )}

            <span className="post-time">{timeForm(postData.createdAt)}</span>
            <span className="post-views">
              · <ViewsIcon className="viewIcon" /> {postData.postView}
            </span>
          </div>
        </div>

        <div className="post-content">{postData.postContent}</div>

        {modal && <Modal />}
        {modalReport && (
          <ReportModal
            toggleReportModal={toggleReportModal}
            nickname={reportInfo.nickname}
            content={reportInfo.content}
          />
        )}

        <div className="post-btn">
          <div className="post-btn1">
            <button className="post-likes" onClick={toggleLikes}>
              {isLike ? (
                <LikesIcon_Red_Full className="likes-redIcon" />
              ) : (
                <LikesIcon_Red className="likes-redIcon" />
              )}
              <span className="likes1">좋아요</span>
              <span className="likes2">{postData.likeCount}</span>
            </button>
            <span className="post-comments-num">
              <ChatIcon className="chatIcon" />
              <span className="comments1">댓글</span>
              <span className="comments2">{postData.comments.length}</span>
            </span>
          </div>
          <div className="post-btn2">
            {postData.nickname === currentUserNickname ? (
              <>
                <button onClick={handlePostReviseClick}>수정</button>|
                <button>삭제</button>|
              </>
            ) : (
              <>
                <button
                  onClick={() =>
                    toggleReportModal(postData.nickname, postData.postTitle)
                  }
                >
                  신고
                </button>
                |
              </>
            )}
            <button className="post-copy" onClick={handleCopy}>
              주소 복사
            </button>
          </div>
        </div>
      </div>
      <div className="post-comment">
        <h1>댓글</h1>
        {postData.comments.map((comment) => (
          <Comment
            key={comment.id}
            picture={comment.picture}
            nickname={comment.nickname}
            content={comment.content}
            createdAt={comment.createdAt}
            userId={comment.nickname}
            currentUserId={currentUserNickname}
            toggleReportModal={() =>
              toggleReportModal(comment.nickname, comment.content)
            }
            updateComment={(updatedContent) =>
              updateComment(updatedContent, comment.id)
            }
          />
        ))}
        <div className="create-post-comment">
          <DefaultProfile className="post-comment-profileImg" />
          <div className="add-post-comment">
            <textarea
              placeholder="댓글을 입력해 주세요"
              maxLength="326"
              className="post-comment-input"
            ></textarea>
            <button className="post-comment-submit">등록</button>
          </div>
        </div>
      </div>
      <div className="more-post">
        <div className="more-post-title">{boardName} 게시글 더보기</div>
        <MorePostList posts={filteredPosts} boardName={boardName} />
      </div>
    </div>
  );
};

export default Post;
