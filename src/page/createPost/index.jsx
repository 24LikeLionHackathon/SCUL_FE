import React, { useState, useRef, useEffect } from 'react';
import { useFetcher, useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import styled from 'styled-components';
import 'react-quill/dist/quill.snow.css';
import { ReactComponent as Select } from '../../assets/images/FilterSelect.svg';
import axios from 'axios';

const StyledReactQuill = styled(ReactQuill)`
  .ql-editor strong {
    font-weight: 700;
  }
  .ql-editor em {
    font-style: italic;
  }
  .ql-editor img {
    max-width: none;
    width: auto;
    height: auto;
  }
`;

const boardNameMapping = {
  '후기 게시판': 'review',
  '자유 게시판': 'free',
  '정보 게시판': 'info',
};

const CreatePost = () => {
  const [isBoardOpen, setIsBoardOpen] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState('게시판을 선택해 주세요');
  const [selectedOption, setSelectedOption] = useState('분류 선택');
  const [options, setOptions] = useState([]);
  const [isOptionDisabled, setIsOptionDisabled] = useState(true);
  const [content, setContent] = useState('');
  const titleRef = useRef(null);
  const [files, setFiles] = useState([]);
  const { sport, post_id } = useParams();
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true,
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleFileDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const toggleBoardDropdown = () => {
    setIsBoardOpen(!isBoardOpen);
    setIsOptionOpen(false);
  };

  const toggleOptionDropdown = () => {
    setIsOptionOpen(!isOptionOpen);
    setIsBoardOpen(false);
  };

  const handleBoardSelect = (board) => {
    setSelectedBoard(board);
    setIsBoardOpen(false);
    setSelectedOption('분류 선택');
    switch (board) {
      case '자유 게시판':
        setOptions(['자유']);
        setIsOptionDisabled(false);
        break;
      case '후기 게시판':
        setOptions(['소모임', '용품', '시설', '운동']);
        setIsOptionDisabled(false);
        break;
      case '정보 게시판':
        setOptions(['대회', '경기 결과', '경기 일정']);
        setIsOptionDisabled(false);
        break;
      default:
        setOptions([]);
        setIsOptionDisabled(true);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOptionOpen(false);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  useEffect(() => {
    if (post_id) {
      // Fetch existing post data for editing
      const fetchPostData = async () => {
        const accessToken = localStorage.getItem('accessToken');
        try {
          const response = await axios.get(`/api/posts/${post_id}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });

          // Set board, tag, title, content, and images
          setSelectedBoard(response.data.board_name);
          setSelectedOption(response.data.tag_name);
          if (titleRef.current) {
            titleRef.current.value = response.data.post_title;
          }
          setContent(response.data.post_content);
          console.log(response.data);

          // Set image URLs in state
          const imageUrls = response.data.image_urls.map((url) => ({
            url,
          }));
          setFiles(imageUrls);

          // Set options based on board name
          const board = response.data.board_name;
          switch (board) {
            case '자유 게시판':
              setOptions(['자유']);
              break;
            case '후기 게시판':
              setOptions(['소모임', '용품', '시설', '운동']);
              break;
            case '정보 게시판':
              setOptions(['대회', '경기 결과', '경기 일정']);
              break;
            default:
              setOptions([]);
          }
          setIsOptionDisabled(false);
        } catch (error) {
          console.error('Failed to fetch post data:', error);
        }
      };

      fetchPostData();
    }
  }, [post_id]);
  const handleSubmit = async () => {
    if (selectedBoard === '게시판을 선택해 주세요') {
      alert('게시판을 선택해 주세요');
      return;
    }

    if (selectedBoard !== '자유 게시판' && selectedOption === '분류 선택') {
      alert('분류를 선택해 주세요');
      return;
    }

    if (titleRef.current.value.trim() === '') {
      alert('제목을 작성해 주세요');
      return;
    }

    if (content.trim() === '') {
      alert('내용을 입력해 주세요');
      return;
    }

    const formData = new FormData();
    const date = new Date();
    const isoDate = date.toISOString();
    const selectedSports = JSON.parse(localStorage.getItem('selectedSport'));
    const sportsName = selectedSports?.name || '';
    formData.append('boardName', selectedBoard);
    formData.append('tagName', selectedOption);
    formData.append('sportsName', sportsName);
    formData.append('postTitle', titleRef.current.value);
    formData.append('postContent', content);
    formData.append('createdAt', isoDate);

    files.forEach((file) => {
      if (file.isNew) {
        formData.append('files', file.file);
      } else {
        formData.append('imageUrls', file.url);
      }
    });
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      if (post_id) {
        await axios.put(`/api/posts/${post_id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        alert('게시글이 성공적으로 수정되었습니다.');
      } else {
        await axios.post('/api/newpost', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        alert('게시글이 성공적으로 등록되었습니다.');
      }

      // 게시글 등록 후 리다이렉트
      const boardUrl = boardNameMapping[selectedBoard] || 'default';
      navigate(`/community/${boardUrl}/${sport}`);
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      alert('게시글 등록에 실패했습니다.');
    }
  };

  CreatePost.modules = {
    toolbar: [
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ color: [] }, { background: [] }],
      [
        { align: '' },
        { align: 'center' },
        { align: 'right' },
        { align: 'justify' },
      ],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'video'],
    ],
  };

  CreatePost.formats = [
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'align',
    'list',
    'bullet',
    'indent',
    'link',
    'video',
    'color',
    'background',
    'height',
    'width',
  ];
  return (
    <div className="CreatePost">
      <h1>{post_id ? '글 수정하기' : '글 작성하기'}</h1>
      <div className="postSetting">
        <div className="setDropdown">
          <div className="createBoardDropdown">
            <button className="setBoardBtn" onClick={toggleBoardDropdown}>
              {selectedBoard}
              <Select className="selectIcon" />
            </button>
            {isBoardOpen && (
              <div className="setMenu">
                <div onClick={() => handleBoardSelect('후기 게시판')}>
                  후기 게시판
                </div>
                <div onClick={() => handleBoardSelect('자유 게시판')}>
                  자유 게시판
                </div>
                <div onClick={() => handleBoardSelect('정보 게시판')}>
                  정보 게시판
                </div>
              </div>
            )}
          </div>

          <div className="createTagDropdown">
            <button
              className={`setTagBtn ${isOptionDisabled ? 'disabled' : ''}`}
              onClick={toggleOptionDropdown}
              disabled={isOptionDisabled}
            >
              {selectedOption}
              <Select className="selectIcon" />
            </button>
            {isOptionOpen && (
              <div className="setMenu">
                {options.map((option) => (
                  <div key={option} onClick={() => handleOptionSelect(option)}>
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <input
          className="setTitle"
          placeholder="제목을 입력해 주세요"
          type="text"
          ref={titleRef}
        />
      </div>
      <div className="quill">
        <StyledReactQuill
          value={content}
          onChange={handleContentChange}
          modules={CreatePost.modules}
          formats={CreatePost.formats}
          placeholder="내용을 입력해 주세요"
        />
      </div>
      <input type="file" multiple onChange={handleFileChange} />
      <div className="uploadedFiles">
        {files.map((file, index) => (
          <div key={index} className="fileItem">
            <img
              src={file.url}
              alt={`file preview ${index}`}
              className="filePreview"
            />
            <button onClick={() => handleFileDelete(index)}>삭제</button>
          </div>
        ))}
      </div>
      <div className="createBtn">
        <button className="create" onClick={handleSubmit}>
          {post_id ? '글 수정' : '게시글 등록'}
        </button>
      </div>
    </div>
  );
};
export default CreatePost;
