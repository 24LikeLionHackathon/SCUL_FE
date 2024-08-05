import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ReactComponent as Select } from '../../assets/images/AgeSelect.svg';

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

const Initial = () => {
  const navigate = useNavigate();
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isUnique, setIsUnique] = useState(false);
  const [showError, setShowError] = useState(false);
  const [inputClass, setInputClass] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);

  const validateNickname = (name) => {
    if (!/^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{3,12}$/.test(name)) {
      alert('한글, 영어, 숫자포함 3자~12자 가능합니다');
      setInputClass('error');
      return false;
    }
    setInputClass('');
    return true;
  };

  const checkNicknameUnique = async (nickname) => {
    try {
      const response = await axios.get(
        `/api/user/check-nickname?nickname=${nickname}`
      );
      console.log('반환', response.data);
      setIsUnique(!response.data); // 반대로 설정 (true -> false, false -> true)
      setInputClass(!response.data ? 'success' : 'error'); // 중복인 경우 error, 아닌 경우 success
    } catch (error) {
      console.error('닉네임 중복 확인 오류:', error);
    }
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
      setIsUnique(false);
    }
  };

  const handleButtonClick = (button) => {
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

  const handleComplete = async () => {
    if (inputClass !== 'success') {
      alert('중복확인을 완료해야 합니다');
      return;
    }
    const response = {
      gender,
      age,
      nickname,
      sportsName: selectedButtons,
    };
    console.log(response);
    console.log('스포츠', selectedButtons);
    try {
      // 사용자 정보를 제출합니다.
      const response = await axios.post('/api/auth/join/submit-info', {
        gender,
        age,
        nickname,
        sportsName: selectedButtons,
      });
      // 백엔드에서 토큰을 처리하고 메인 페이지로 리다이렉트합니다.
      const { access_token, refresh_token } = response.data;

      // 토큰 저장
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.removeItem('userCode');
      // 메인 페이지로 이동
      navigate('/main');
    } catch (error) {
      console.error('회원 정보 제출 오류:', error);
    }
  };

  const ageOptions = Array.from({ length: 58 }, (_, i) => i + 8);

  return (
    <div className="Initial">
      <div className="nickWrap">
        <div className="nickSet">닉네임 설정</div>
        <div className="inputWrap">
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
          <div className="message">이미 존재하는 닉네임입니다.</div>
        )}
        {showError && isUnique && inputClass === 'success' && (
          <div className="successMessage">사용 가능한 닉네임입니다.</div>
        )}
      </div>
      <div className="pickSports">
        <div className="sportsSet">선호 종목 선택</div>
        <div className="sportsSetInfo">
          최대 5개까지 설정 가능합니다. 추후에 변경 가능합니다.
        </div>
        <div className="btnContainer">
          {sports.map((button) => (
            <div key={button} className="buttonWrap">
              <button
                className={`sportsButton ${
                  selectedButtons.includes(button) ? 'selectedSportsButton' : ''
                }`}
                onClick={() => handleButtonClick(button)}
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
      <div className="initial-additional-container">
        <div className="initial-additional-left">
          <div>나이</div>
          <div
            className="initial-additional-left-age-container"
            onClick={() => setShowAgeDropdown(!showAgeDropdown)}
          >
            <div className="initial-additional-left-age-select">
              {age || '선택'}
            </div>
            <Select className="initial-additional-left-age-icon" />
            {showAgeDropdown && (
              <ul className="age-list">
                {ageOptions.map((ageOption) => (
                  <li
                    key={ageOption}
                    className={`age-item ${
                      age === ageOption ? 'selected-age' : ''
                    }`}
                    onClick={() => {
                      setAge(ageOption);
                      setShowAgeDropdown(false);
                    }}
                  >
                    {ageOption}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="initial-additional-right">
          <div className="initial-additional-right-gender">성별</div>
          <div className="initial-additional-right-gender-radio">
            <label className="initial-additional-right-gender-radio-box">
              <input
                className="initial-additional-right-gender-radio-button"
                type="radio"
                value="남자"
                checked={gender === '남자'}
                onChange={(e) => setGender(e.target.value)}
              />
              남자
            </label>
            <label className="initial-additional-right-gender-radio-box">
              <input
                className="initial-additional-right-gender-radio-button"
                type="radio"
                value="여자"
                checked={gender === '여자'}
                onChange={(e) => setGender(e.target.value)}
              />
              여자
            </label>
          </div>
        </div>
      </div>
      <button className="submitButton" onClick={handleComplete}>
        설정완료
      </button>
    </div>
  );
};

export default Initial;
