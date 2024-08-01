import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill, { Quill, quillRef } from 'react-quill';
import styled from 'styled-components';
import 'react-quill/dist/quill.snow.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ImageDrop } from 'quill-image-drop-module';
import { format } from 'date-fns';
import axios from 'axios';
import ImageResize from '@looop/quill-image-resize-module-react';

import { ReactComponent as Select } from '../../assets/images/FilterSelect.svg';
import { ReactComponent as CalendarPrev } from '../../assets/images/CalendarPrev.svg';
import { ReactComponent as CalendarNext } from '../../assets/images/CalendarNext.svg';
import { ko } from 'date-fns/locale/ko';

// 전역 스코프에 Quill 인스턴스 등록
window.Quill = Quill;

Quill.register('modules/imageDrop', ImageDrop);
Quill.register('modules/imageResize', ImageResize);

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

//Firebase Storage로 이미지 처리하기
//참고 :: https://yhuj79.github.io/React/230214/
const imageHandler = () => {
  //에디터에서 이미지 버튼을 클릭하면 핸들러 시작

  const input = document.createElement('input');

  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.addEventListener('change', async () => {
    console.log('온체인지');
    const file = input.files[0];
    const formData = new FormData();
    formData.append('img', file);
    try {
      const result = await axios.post('http://localhost:3000/img', formData);
      console.log('성공 시, 백엔드가 보내주는 데이터', result.data.url);
      const IMG_URL = result.data.url;
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      editor.insertEmbed(range.index, 'image', IMG_URL);
    } catch (error) {
      console.log('이미지 업로드 실패:', error);
    }
  });
};

const formatDate = (date) => {
  return date
    ? format(date, 'yyyy년 M월 d일 EEEE', { locale: ko })
    : '날짜 선택';
};

const CreateClub = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [endDate, setEndDate] = useState(null);

  const [isBoardOpen, setIsBoardOpen] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState('게시판을 선택해 주세요');
  const [selectedOption, setSelectedOption] = useState('분류 선택');
  const [options, setOptions] = useState([]);
  const [isOptionDisabled, setIsOptionDisabled] = useState(true);
  const [content, setContent] = useState('');
  const titleRef = useRef(null);
  const [startDate, setStartDate] = useState('');
  const { sport } = useParams();

  useEffect(() => {
    if (startDate > endDate) {
      setEndDate('');
    }
  }, [startDate, endDate]);

  const handleDateChange = (date) => {
    setStartDate(date);
    setShowDatePicker(false); // 날짜 선택 후 달력 숨김
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setShowEndDatePicker(false);
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
      case '후기 게시판':
        setOptions(['소모임', '용품', '시설', '운동']);
        setIsOptionDisabled(false);
        break;
      case '문의 / 신고':
        setOptions([
          '신고',
          '문의하기',
          '중복 게시 건의',
          '게시판 개선 건의',
          '분류 추가 건의',
        ]);
        setIsOptionDisabled(false);
        alert('문의 / 신고 게시판은 관리자만 조회 할 수 있습니다');
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

  // 사이트 탈주 알림
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
    //일단
    if (content.trim() === '') {
      alert('내용을 입력해 주세요');
      return;
    }

    let redirectUrl = '';
    switch (selectedBoard) {
      case '자유 게시판':
        redirectUrl = `/community/free/${sport.toLowerCase()}`;
        break;
      case '후기 게시판':
        redirectUrl = `/community/review/${sport.toLowerCase()}`;
        break;
      case '정보 게시판':
        redirectUrl = `/community/info/${sport.toLowerCase()}`;
        break;
      case '문의 / 신고':
        redirectUrl = `/inquiry`;
        break;
      default:
        redirectUrl = '/';
    }

    window.location.href = redirectUrl;
  };

  const renderCustomHeader = ({ date, decreaseMonth, increaseMonth }) => (
    <div className="custom-header">
      <button onClick={decreaseMonth} className="custom-nav-button-prev">
        <CalendarPrev />
      </button>
      <span className="react-datepicker__current-month">
        {format(date, 'yyyy년 M월', { locale: ko })}
      </span>
      <button onClick={increaseMonth} className="custom-nav-button-next">
        <CalendarNext />
      </button>
    </div>
  );

  return (
    <div className="CreatePost">
      <h1>글 작성하기</h1>
      <div className="postSetting">
        <div className="postSetting-2">
          <button onClick={() => setShowDatePicker(!showDatePicker)}>
            {formatDate(startDate)}
          </button>
          {showDatePicker && (
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              dateFormat="yyyy/MM/dd"
              locale={ko}
              renderCustomHeader={renderCustomHeader}
              inline
            />
          )}
          <button onClick={() => setShowEndDatePicker(!showEndDatePicker)}>
            {endDate ? formatDate(endDate) : '모집 마감일 선택'}
          </button>
          {showEndDatePicker && (
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              dateFormat="yyyy/MM/dd"
              locale={ko}
              minDate={startDate || new Date()}
              renderCustomHeader={renderCustomHeader}
              inline
              disabledKeyboardNavigation
            />
          )}
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
          modules={CreateClub.modules}
          formats={CreateClub.formats}
          placeholder="내용을 입력해 주세요"
        />
      </div>

      <div className="createBtn">
        <button className="create" onClick={handleSubmit}>
          게시글 등록
        </button>
      </div>
    </div>
  );
};

CreateClub.modules = {
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
    ['link', 'image', 'video'],
  ],
  imageDrop: true,

  imageResize: {
    modules: ['Resize'],

    handlers: {
      image: imageHandler,
    },
  },
};

CreateClub.formats = [
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
  'image',
  'video',
  'color',
  'background',
  'height',
  'width',
];

export default CreateClub;
