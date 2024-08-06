import React, { useState, useEffect, useRef } from 'react';
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
import { ReactComponent as Ad1 } from '../../assets/images/Ad1.svg';
import { ReactComponent as Ad2 } from '../../assets/images/Ad1.svg';
import { ReactComponent as Ad3 } from '../../assets/images/Ad1.svg';
import { ReactComponent as Ad4 } from '../../assets/images/Ad1.svg';
import axios from 'axios';
import DOMPurify from 'dompurify';
const SafeHtml = ({ htmlString }) => {
  const sanitizedHtml = DOMPurify.sanitize(htmlString);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};
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
  return new Date(date).toLocaleDateString;
};

const MorePostList = ({ posts, board_name }) => {
  return (
    <ul className="more-post-lists">
      {posts.map((post) => (
        <li key={post.id} className="more-post-item">
          <div className="more-post-head">
            {board_name === '자유' ? (
              ''
            ) : (
              <div className="more-post-tag">{post.tag}</div>
            )}
            {post.created_img === 'true' ? (
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
              {timeForm(post.created_at)}
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

//게시글더보기용 mockdata
const mockPosts = [
  {
    id: 1,
    board: '후기',
    tag: '소모임',
    title: '운동 소모임 후기',
    created_at: '2024-03-11T15:23:45Z',
    likes: 120,
    views: 850,
    comments: 35,
    nickname: '운동왕',
    created_img: 'true',
  },
  {
    id: 2,
    board: '정보',
    tag: '대회',
    title: '최신 대회 정보',
    created_at: '2024-04-22T11:10:30Z',
    likes: 95,
    views: 625,
    comments: 22,
    nickname: '스포츠매니아',
    created_img: 'false',
  },
  {
    id: 3,
    board: '자유',
    tag: '',
    title: '자유롭게 이야기해요',
    created_at: '2024-01-15T09:20:15Z',
    likes: 50,
    views: 450,
    comments: 10,
    nickname: '토크고수',
    created_img: 'false',
  },
  {
    id: 4,
    board: '후기',
    tag: '용품',
    title: '새로운 운동 용품 사용기',
    created_at: '2024-06-05T17:45:00Z',
    likes: 160,
    views: 930,
    comments: 45,
    nickname: '용품전문가',
    created_img: 'false',
  },
  {
    id: 5,
    board: '정보',
    tag: '경기 일정',
    title: '다음 주 경기 일정',
    created_at: '2024-02-20T14:15:00Z',
    likes: 85,
    views: 610,
    comments: 18,
    nickname: '일정관리자',
    created_img: 'false',
  },
  {
    id: 6,
    board: '자유',
    tag: '',
    title: '일상 이야기',
    created_at: '2024-07-01T10:05:00Z',
    likes: 30,
    views: 310,
    comments: 7,
    nickname: '일상러버',
    created_img: 'false',
  },
  {
    id: 7,
    board: '후기',
    tag: '운동',
    title: '새로운 운동 시작 후기',
    created_at: '2024-05-18T13:30:00Z',
    likes: 140,
    views: 880,
    comments: 40,
    nickname: '새내기운동맨',
    created_img: 'false',
  },
  {
    id: 9,
    board: '자유',
    tag: '',
    title: '참여 후기',
    created_at: '2024-02-08T12:45:00Z',
    likes: 45,
    views: 380,
    comments: 12,
    nickname: '참여마스터',
    created_img: 'true',
  },
  {
    id: 10,
    board: '후기',
    tag: '시설',
    title: '새로운 운동 시설 후기',
    created_at: '2024-06-21T16:20:00Z',
    likes: 155,
    views: 910,
    comments: 42,
    nickname: '시설체험러',
    created_img: 'false',
  },
  {
    id: 11,
    board: '정보',
    tag: '대회',
    title: '다음 대회 준비사항',
    created_at: '2024-05-10T14:10:00Z',
    likes: 92,
    views: 595,
    comments: 20,
    nickname: '대회준비생',
    created_img: 'false',
  },
  {
    id: 12,
    board: '자유',
    tag: '',
    title: '오늘의 일상',
    created_at: '2024-04-28T11:05:00Z',
    likes: 37,
    views: 340,
    comments: 9,
    nickname: '오늘하루',
    created_img: 'true',
  },
  {
    id: 13,
    board: '후기',
    tag: '소모임',
    title: '소모임 후기',
    created_at: '2024-01-18T15:25:00Z',
    likes: 128,
    views: 845,
    comments: 36,
    nickname: '소모임전문가',
    created_img: 'true',
  },
  {
    id: 14,
    board: '정보',
    tag: '경기 일정',
    title: '다가오는 경기 일정',
    created_at: '2024-03-12T18:35:00Z',
    likes: 78,
    views: 560,
    comments: 16,
    nickname: '경기예고자',
    created_img: 'true',
  },
  {
    id: 15,
    board: '자유',
    tag: '',
    title: '자유롭게 이야기합시다',
    created_at: '2024-07-07T13:00:00Z',
    likes: 55,
    views: 410,
    comments: 14,
    nickname: '자유로운영혼',
    created_img: 'false',
  },
  {
    id: 16,
    board: '후기',
    tag: '용품',
    title: '운동용품 리뷰',
    created_at: '2024-06-30T09:30:00Z',
    likes: 175,
    views: 960,
    comments: 48,
    nickname: '용품박사',
    created_img: 'true',
  },
  {
    id: 17,
    board: '정보',
    tag: '경기 결과',
    title: '최근 경기 결과 분석',
    created_at: '2024-04-04T20:40:00Z',
    likes: 112,
    views: 690,
    comments: 27,
    nickname: '경기해설자',
    created_img: 'false',
  },
  {
    id: 18,
    board: '자유',
    tag: '',
    title: '일상 토크',
    created_at: '2024-02-02T12:30:00Z',
    likes: 42,
    views: 365,
    comments: 11,
    nickname: '토크마니아',
    created_img: 'false',
  },
  {
    id: 19,
    board: '후기',
    tag: '운동',
    title: '새로운 운동 도전기',
    created_at: '2024-05-27T17:50:00Z',
    likes: 148,
    views: 890,
    comments: 39,
    nickname: '운동도전자',
    created_img: 'true',
  },
  {
    id: 20,
    board: '정보',
    tag: '대회',
    title: '대회 정보 공유',
    created_at: '2024-06-15T14:55:00Z',
    likes: 87,
    views: 575,
    comments: 19,
    nickname: '정보공유자',
    created_img: 'true',
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
          <div className="report-content-in">
            <SafeHtml htmlString={content} />
          </div>
        </div>
        <div className="report-reason">
          <p>신고 사유</p>
          <textarea
            placeholder="신고 사유를 작성해 주세요"
            maxLength="178"
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

const ads = [Ad1, Ad2, Ad3, Ad4];

const Post = () => {
  const nav = useNavigate();
  const { sport, board, post_id } = useParams(); // Extract parameters from URL에서 가져옵니다
  const [postData, setPostData] = useState(null);
  const [isLike, setIsLike] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalReport, setModalReport] = useState(false);
  const [reportInfo, setReportInfo] = useState({ nickname: '', content: '' });
  const randomIndex = Math.floor(Math.random() * ads.length);
  const RandomAdComponent = ads[randomIndex];

  // Log post_id to check if it is being extracted correctly

  // Fetch post data
  // Fetch post data including comments
  const fetchPostData = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.get(
        `/api/api/posts?postId=${post_id}&&userId=${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log('Post data:', response.data); // 응답 데이터를 로그로 출력
      setPostData(response.data);
      response.data.is_like ? setIsLike(true) : setIsLike(false);
      response.data.is_following ? setIsFollow(true) : setIsFollow(false);
    } catch (error) {
      console.error('Failed to fetch post data:', error);
    }
  };

  useEffect(() => {
    fetchPostData();
  }, [post_id]); // `post_id` 변경 시 데이터 가져오기
  //댓글 컴포넌트
  const Comment = ({
    comment_id,
    picture,
    nickname,
    content,
    created_at,
    toggleReportModal,
    updateComment,
  }) => {
    const [isCommentRevise, setIsCommentRevise] = useState(false);
    const [alterText, setAlterText] = useState(content);

    const onChange = (e) => {
      setAlterText(e.target.value);
    };

    const submitCommentRevise = () => {
      updateComment(alterText);
      setIsCommentRevise(false);
    };

    const toggleCommentRevise = () => {
      setIsCommentRevise(!isCommentRevise);
      setAlterText(content);
    };

    const handleCommentDelete = async () => {
      const accessToken = localStorage.getItem('accessToken');
      console.log('comment_id : ', comment_id);
      try {
        await axios.delete(`/api/comment/${comment_id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // 인증 토큰 포함
          },
        });
        alert('댓글이 성공적으로 삭제되었습니다.');
      } catch (error) {
        console.error('댓글 삭제 오류:', error);
        alert('댓글 삭제에 실패했습니다.');
      }
      fetchPostData();
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
                  maxLength="326"
                  className="post-comment-input"
                  onChange={onChange}
                  value={alterText}
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
            <div className="post-comment-content">
              <SafeHtml htmlString={content} />
            </div>
          )}

          <div className="post-comment-footer">
            <span className="post-comment-time">{timeForm(created_at)}</span>
            {true && (
              <>
                <button
                  className="post-comment-action"
                  onClick={toggleCommentRevise}
                >
                  수정
                </button>
                <button
                  className="post-comment-action"
                  onClick={handleCommentDelete}
                >
                  삭제
                </button>
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
  const board_name = '';
  //   postData.board_name === 'free'
  //     ? '자유'
  //     : postData.board_name === 'review'
  //     ? '후기'
  //     : '정보';
  const handlePostReviseClick = () => {
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/createpost/${sport.toLowerCase()}/${
      postData.post_id
    }`;
  };
  const handlePostDelete = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      await axios.delete(`/api/posts/${post_id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // 인증 토큰 포함
        },
      });
      nav(-1); // 포스트 삭제 후 이전 화면으로 이동
      alert('게시글이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.log(post_id);
      console.error('게시글 삭제 오류:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
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

  const toggleFollows = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      if (isFollow) {
        // 언팔로우 요청 (DELETE 요청)
        const response = await axios.delete(
          `/api/follow`, // URL
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`, // 인증 토큰 포함
            },
            data: { followed_nick_name: postData.nickname }, // 본문 데이터
          }
        );
        console.log('언팔로우 성공');
      } else {
        // 현재 팔로우 되어있지 않을 경우, 팔로우를 추가합니다 (POST 요청)
        const response = await axios.post(
          `/api/follow`,
          { followed_nick_name: postData.nickname },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`, // 인증 토큰 포함
            },
          }
        );
        console.log('팔로우 성공');
      }
      fetchPostData();
    } catch (error) {
      console.error('팔로우 업데이트 오류:', error);
    }
  };

  const toggleLikes = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      if (isLike) {
        // 현재 좋아요가 되어있을 경우, 좋아요를 취소합니다 (DELETE 요청)
        const response = await axios.delete(`/api/like?post_id=${post_id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // 인증 토큰 포함
          },
        });
        console.log('좋아요 취소 성공');
      } else {
        // 현재 좋아요가 되어있지 않을 경우, 좋아요를 추가합니다 (POST 요청)
        const response = await axios.post(
          `/api/like?post_id=${post_id}`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`, // 인증 토큰 포함
            },
          }
        );
        console.log('좋아요 설정 성공');
      }

      // 좋아요 상태를 UI에서 업데이트
      fetchPostData();
    } catch (error) {
      console.error('좋아요 업데이트 오류:', error);
    }
  };

  const handleButton = async () => {
    let redirectUrl = '';
    switch (board_name) {
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

  const updateComment = async (updated_content, comment_id) => {
    const accessToken = localStorage.getItem('accessToken');
    const updatedAt = new Date().toISOString();
    try {
      // 댓글 수정 요청을 보냅니다.
      const response = await axios.put(
        `/api/comment/${comment_id}`, // URL 경로에 댓글 ID 포함
        {
          comment_content: updated_content,
          created_at: updatedAt,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // 인증 토큰 포함
          },
        }
      );
      console.log(updated_content, accessToken, comment_id);
      alert('댓글 수정 성공');
      fetchPostData();
    } catch (error) {
      console.error('댓글 수정 오류:', error);
    }
  };

  const filteredPosts = mockPosts
    .filter((post) => post.board === board_name)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const className = `${modalReport ? 'report-modal-back' : ''}`;
  const [comments, setComments] = useState([]);
  const commentInputRef = useRef(null);
  const handleCommentSubmit = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const comment_content = commentInputRef.current.value;
    const date = new Date();

    const commentData = {
      post_id: post_id,
      comment_content: comment_content,
      created_at: date,
    };

    try {
      console.log(commentData.post_id);
      const response = await axios.post('/api/comment', commentData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Comment submitted successfully:', response.data);

      // Clear the textarea
      commentInputRef.current.value = '';

      // Update the comments state to include the new comment
      setComments([...comments, response.data]);
    } catch (error) {
      console.error('Failed to submit comment:', error);
      // Handle error, e.g., notify the user or retry the request
    }
    fetchPostData();
  };

  if (!postData) return <div>Loading...</div>; // 데이터 로딩 중일 때 표시할 컴포넌트

  return (
    <div className="Post">
      <div className="post-content-wrap">
        <button className="post-board-btn" onClick={handleButton}>
          {board_name} 게시판 &#10095;
        </button>
        <div className="post-title-wrap">
          <div className="post-title-1">
            {board_name === '자유' ? (
              ''
            ) : (
              <div className="post-tag">{postData.tag_name}</div>
            )}
            <div className="post-title">{postData.post_title}</div>
          </div>
          <div className="post-title-2">
            <button className="post-profile_btn" onClick={() => nav('/myPage')}>
              {postData.profile_img ? (
                <img
                  src={postData.profile_img}
                  alt={postData.post_title}
                  className="post-profileImg"
                />
              ) : (
                <DefaultProfile className="post-profileImg" />
              )}
              <span className="post-nickname"> {postData.nickname}</span>
            </button>
            {postData.is_me ? (
              ''
            ) : (
              <button className="post-follow" onClick={toggleFollows}>
                팔로우 {isFollow ? <GreenCheckIcon /> : '+'}
              </button>
            )}

            <span className="post-time">{timeForm(postData.created_at)}</span>
            <span className="post-views">
              · <ViewsIcon className="viewIcon" /> {postData.post_view}
            </span>
          </div>
        </div>

        <div className="post-content">
          <SafeHtml htmlString={postData.post_content} />
          <div>
            {postData.image_urls.map((url, index) => (
              <img key={index} src={url} alt={`Image ${index + 1}`} />
            ))}
          </div>
        </div>
        <div className="post-ads">
          <RandomAdComponent />
        </div>
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
              <span className="likes2">{postData.like_count}</span>
            </button>
            <span className="post-comments-num">
              <ChatIcon className="chatIcon" />
              <span className="comments1">댓글</span>
              <span className="comments2">{postData.comments.length}</span>
            </span>
          </div>
          <div className="post-btn2">
            {postData.is_me ? (
              <>
                <button onClick={handlePostReviseClick}>수정</button>|
                <button onClick={handlePostDelete}>삭제</button>|
              </>
            ) : (
              <>
                <button
                  onClick={() =>
                    toggleReportModal(postData.nickname, postData.post_title)
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
            key={comment.comment_id} // 고유한 key prop 추가
            comment_id={comment.comment_id}
            picture={comment.picture}
            nickname={comment.nickname}
            content={comment.comment_content}
            created_at={comment.created_at}
            toggleReportModal={() =>
              toggleReportModal(comment.nickname, comment.comment_content)
            }
            updateComment={(updated_content) =>
              updateComment(updated_content, comment.comment_id)
            }
          />
        ))}
        <div className="create-post-comment">
          <DefaultProfile className="post-comment-profileImg" />
          <div className="add-post-comment">
            <textarea
              ref={commentInputRef}
              placeholder="댓글을 입력해 주세요"
              maxLength="326"
              className="post-comment-input"
            ></textarea>
            <button
              className="post-comment-submit"
              onClick={handleCommentSubmit}
            >
              등록
            </button>
          </div>
        </div>
      </div>
      <div className="more-post">
        <div className="more-post-title">{board_name} 게시글 더보기</div>
        <MorePostList posts={filteredPosts} board_name={board_name} />
      </div>
    </div>
  );
};

export default Post;

/*

Authorization Header: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmbnNsMTAyNjI2QGdtYWlsLmNvbSIsImV4cCI6MTcyMzM4MTg0MH0.jfcuujARcY8pTr0yg_xD_FGhFtxvFis2c0NiOgGGsouhhUbiKmpCOtGC28QLZB8EX0R179-hh-4uHjucHgYLFA
Validating token: eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmbnNsMTAyNjI2QGdtYWlsLmNvbSIsImV4cCI6MTcyMzM4MTg0MH0.jfcuujARcY8pTr0yg_xD_FGhFtxvFis2c0NiOgGGsouhhUbiKmpCOtGC28QLZB8EX0R179-hh-4uHjucHgYLFA
Hibernate: select p1_0.post_id,b1_0.board_id,b1_0.board_name,s1_0.sports_id,s1_0.sports_name,p1_0.created_at,p1_0.post_content,p1_0.post_title,p1_0.post_view,t1_0.tag_id,t1_0.tag_name,u1_0.user_id,u1_0.age,u1_0.email,u1_0.gender,u1_0.nickname from post p1_0 left join board b1_0 on b1_0.board_id=p1_0.board_id left join sports s1_0 on s1_0.sports_id=b1_0.sports_id left join tag t1_0 on t1_0.tag_id=p1_0.tag_id left join user u1_0 on u1_0.user_id=p1_0.user_id where p1_0.post_id=?
Hibernate: select ui1_0.user_image_id,ui1_0.image_url,ui1_0.user_id,u1_0.user_id,u1_0.age,u1_0.email,u1_0.gender,u1_0.nickname from user_image ui1_0 join user u1_0 on u1_0.user_id=ui1_0.user_id where ui1_0.user_id=?
Hibernate: select i1_0.image_id,i1_0.image_url,i1_0.post_id from image i1_0 where i1_0.post_id=?
Hibernate: select c1_0.post_id,c1_0.comment_id,c1_0.comment_content,c1_0.created_at,u1_0.user_id,u1_0.age,u1_0.email,u1_0.gender,u1_0.nickname from comment c1_0 left join user u1_0 on u1_0.user_id=c1_0.user_id where c1_0.post_id=?



Authorization Header: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmbnNsMTAyNjI2QGdtYWlsLmNvbSIsImV4cCI6MTcyMzM4MTg0MH0.jfcuujARcY8pTr0yg_xD_FGhFtxvFis2c0NiOgGGsouhhUbiKmpCOtGC28QLZB8EX0R179-hh-4uHjucHgYLFA
Validating token: eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmbnNsMTAyNjI2QGdtYWlsLmNvbSIsImV4cCI6MTcyMzM4MTg0MH0.jfcuujARcY8pTr0yg_xD_FGhFtxvFis2c0NiOgGGsouhhUbiKmpCOtGC28QLZB8EX0R179-hh-4uHjucHgYLFA
Hibernate: select p1_0.post_id,b1_0.board_id,b1_0.board_name,s1_0.sports_id,s1_0.sports_name,p1_0.created_at,p1_0.post_content,p1_0.post_title,p1_0.post_view,t1_0.tag_id,t1_0.tag_name,u1_0.user_id,u1_0.age,u1_0.email,u1_0.gender,u1_0.nickname from post p1_0 left join board b1_0 on b1_0.board_id=p1_0.board_id left join sports s1_0 on s1_0.sports_id=b1_0.sports_id left join tag t1_0 on t1_0.tag_id=p1_0.tag_id left join user u1_0 on u1_0.user_id=p1_0.user_id where p1_0.post_id=?
Hibernate: select ui1_0.user_image_id,ui1_0.image_url,ui1_0.user_id,u1_0.user_id,u1_0.age,u1_0.email,u1_0.gender,u1_0.nickname from user_image ui1_0 join user u1_0 on u1_0.user_id=ui1_0.user_id where ui1_0.user_id=?
Hibernate: select i1_0.image_id,i1_0.image_url,i1_0.post_id from image i1_0 where i1_0.post_id=?
Hibernate: select c1_0.post_id,c1_0.comment_id,c1_0.comment_content,c1_0.created_at,u1_0.user_id,u1_0.age,u1_0.email,u1_0.gender,u1_0.nickname from comment c1_0 left join user u1_0 on u1_0.user_id=c1_0.user_id where c1_0.post_id=?
Hibernate: select l1_0.post_id,l1_0.like_id,u1_0.user_id,u1_0.age,u1_0.email,u1_0.gender,u1_0.nickname from likes l1_0 left join user u1_0 on u1_0.user_id=l1_0.user_id where l1_0.post_id=?
Hibernate: update post set board_id=?,created_at=?,post_content=?,post_title=?,post_view=?,tag_id=?,user_id=? where post_id=?



*/
