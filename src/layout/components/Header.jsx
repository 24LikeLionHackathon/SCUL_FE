import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { ReactComponent as SoccerIcon } from '../../assets/images/Soccer.svg';
import { ReactComponent as Select } from '../../assets/images/Select.svg';
import { ReactComponent as Review } from '../../assets/images/Review.svg';
import { ReactComponent as MyPage } from '../../assets/images/Mypage.svg';
import { ReactComponent as Logout } from '../../assets/images/Logout.svg';
import { ReactComponent as Information } from '../../assets/images/Information.svg';
import { ReactComponent as Free } from '../../assets/images/Free.svg';
import { ReactComponent as More } from '../../assets/images/More.svg';
import { ReactComponent as DefaultProfile } from '../../assets/images/DefaultProfile.svg';
import { ReactComponent as BasketballIcon } from '../../assets/images/Basketball.svg';
import { ReactComponent as BaseballIcon } from '../../assets/images/Baseball.svg';
import { ReactComponent as BadmintonIcon } from '../../assets/images/Badminton.svg';
import { ReactComponent as Alert } from '../../assets/images/Alert.svg';
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

const sportIcons = {
  Soccer: SoccerIcon, // 축구 아이콘
  Baseball: BaseballIcon, // 야구 아이콘
  Basketball: BasketballIcon, // 농구 아이콘
  Badminton: BadmintonIcon, // 배드민턴 아이콘
  Bowling: BowlingIcon, // 볼링 아이콘
  Climbing: ClimbingIcon, // 클라이밍 아이콘
  Boxing: BoxingIcon, // 복싱 아이콘
  Tennis: TennisIcon, // 테니스 아이콘
  Cycling: CyclingIcon, // 사이클 아이콘
  Golf: GolfIcon, // 골프 아이콘
  Swimming: SwimmingIcon, // 수영 아이콘
  Running: RunningIcon, // 런닝 아이콘
  Pilates: PilatesIcon, // 필라테스 아이콘
  Hiking: HikingIcon, // 등산 아이콘
  CrossFit: CrossFitIcon, // 크로스핏 아이콘
  TableTennis: TableTennisIcon, // 탁구 아이콘
  Yoga: YogaIcon, // 요가 아이콘
};

const Header = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [notifications, setNotifications] = useState(false);
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMoreSports, setShowMoreSports] = useState(false);

  useEffect(() => {
    setProfileImage(null);
    setNotifications(false);
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
    setSports(sportsList);

    const savedSport = JSON.parse(localStorage.getItem('selectedSport'));
    if (savedSport) {
      setSelectedSport(savedSport);
    } else {
      const initialSport = sportsList[0];
      setSelectedSport(initialSport);
      localStorage.setItem('selectedSport', JSON.stringify(initialSport));
    }
  }, []);

  const token = localStorage.getItem('accessToken');
  useEffect(() => {
    if (token) {
      setLoggedIn(true);
    }
  }, [token]);

  const goHome = () => {
    navigate(`/main}`);
  };

  const handleNavigate = () => {
    navigate(`/auth`);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('selectedSport');
    alert('Logged out!');
    setLoggedIn(false);
    setProfileImage(null);
    setNotifications(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
    localStorage.setItem('selectedSport', JSON.stringify(sport));
    setShowDropdown(false);
    setShowMoreSports(false);
    navigate(`/main/${sport.englishName.toLowerCase()}`);
  };

  const handleShowMoreSports = () => {
    setShowMoreSports(!showMoreSports);
  };

  const renderSportIcon = (englishName) => {
    const SvgComponent = sportIcons[englishName];
    return SvgComponent ? <SvgComponent /> : null;
  };

  return (
    <header className="header-container">
      <div className="header-logo" onClick={goHome}>
        S-CUL
      </div>
      <div className="header-sports-container">
        <div className="header-sports-dropdown-container">
          {selectedSport && renderSportIcon(selectedSport.englishName)}
          <span className="header-sports-dropdown-title">
            {selectedSport ? selectedSport.name : '선택하세요'}
          </span>
          <div
            className="header-sports-dropdown-icon-container"
            onClick={toggleDropdown}
          >
            <Select className="header-sports-dropdown-icon" />
          </div>
        </div>
        {showDropdown && (
          <div
            className={`header-sports-dropdown-contents-container ${
              showMoreSports ? 'expanded' : ''
            }`}
          >
            {sports
              .filter((sport) => sport.name !== selectedSport.name)
              .slice(0, 3)
              .map((sport, index) => (
                <div
                  className="header-sports-dropdown-contents-sport"
                  key={index}
                  onClick={() => handleSportSelect(sport)}
                >
                  {renderSportIcon(sport.englishName)}
                  <div className="header-sports-dropdown-contents-sport-name">
                    {sport.name}
                  </div>
                </div>
              ))}
            {showMoreSports && (
              <>
                {sports
                  .filter((sport) => sport.name !== selectedSport.name)
                  .slice(3)
                  .map((sport, index) => (
                    <div
                      className="header-sports-dropdown-contents-sport"
                      key={index + 3}
                      onClick={() => handleSportSelect(sport)}
                    >
                      {renderSportIcon(sport.englishName)}
                      <div className="header-sports-dropdown-contents-sport-name">
                        {sport.name}
                      </div>
                    </div>
                  ))}
              </>
            )}
            <hr style={{ backgroundColor: '#FFF', width: '100%', margin: 0 }} />
            <div
              className="header-sports-dropdown-more-icon"
              onClick={handleShowMoreSports}
            >
              <More />
            </div>
          </div>
        )}
      </div>
      <nav className="header-nav-container">
        <ul className="header-nav-list-container">
          <li className="header-nav-list">
            <div>커뮤니티</div>
            <ul className="header-nav-list-dropdown-container">
              <li className="header-nav-list-dropdown-list">
                <Free />
                <div
                  onClick={() =>
                    navigate(
                      `/community/free/${
                        selectedSport
                          ? selectedSport.englishName.toLowerCase()
                          : 'soccer'
                      }`
                    )
                  }
                >
                  자유 게시판
                </div>
              </li>
              <li className="header-nav-list-dropdown-list">
                <Review />
                <div
                  onClick={() =>
                    navigate(
                      `/community/review/${
                        selectedSport
                          ? selectedSport.englishName.toLowerCase()
                          : 'soccer'
                      }`
                    )
                  }
                >
                  후기 게시판
                </div>
              </li>
              <li className="header-nav-list-dropdown-list">
                <Information />
                <div
                  onClick={() =>
                    navigate(
                      `/community/info/${
                        selectedSport
                          ? selectedSport.englishName.toLowerCase()
                          : 'soccer'
                      }`
                    )
                  }
                >
                  정보 게시판
                </div>
              </li>
            </ul>
          </li>
          <li className="header-nav-list">
            <div
              onClick={() =>
                navigate(
                  `/club/${
                    selectedSport
                      ? selectedSport.englishName.toLowerCase()
                      : 'soccer'
                  }`
                )
              }
            >
              소모임
            </div>
          </li>
          <li className="header-nav-list">
            <div onClick={() => navigate('/inquiry')}>문의/신고</div>
          </li>
          {loggedIn ? (
            <li className="header-nav-profile">
              <div className="header-nav-profile-image">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" id="profileImage" />
                ) : (
                  <DefaultProfile />
                )}
                {notifications && (
                  <div className="header-nav-profile-notification">N</div>
                )}
              </div>
              <ul className="header-nav-profile-dropdown-list-container">
                <li className="header-nav-profile-dropdown-list">
                  <div onClick={() => navigate('/mypage')}>
                    <MyPage />
                    마이 페이지
                  </div>
                </li>
                <li className="header-nav-profile-dropdown-list">
                  <div onClick={() => navigate('/notifications')}>
                    <Alert />
                    알림
                  </div>{' '}
                </li>
                <li className="header-nav-profile-dropdown-list">
                  <div onClick={logout}>
                    <Logout />
                    로그아웃
                  </div>
                </li>
              </ul>
            </li>
          ) : (
            <li className="header-nav-list">
              <div onClick={handleNavigate}>로그인</div> /
              <div onClick={handleNavigate}>회원가입</div>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
