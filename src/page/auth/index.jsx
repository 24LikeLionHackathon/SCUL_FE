import React, { useEffect, useState } from 'react';
import { ReactComponent as Kakao } from '../../assets/images/Kakao.svg';
import { ReactComponent as Google } from '../../assets/images/Google.svg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(localStorage.getItem('provider'));

  // 리디렉션 후 URL에서 code 파라미터 추출 및 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const storedProvider = localStorage.getItem('provider');
    console.log(code, storedProvider);

    if (code && storedProvider) {
      const fetchTokens = async () => {
        try {
          const res = await axios.get(
            `/api/oauth2/${storedProvider}?code=${code}`
          );
          const { access_token, refresh_token, is_member } = res.data;
          console.log(
            res.data,
            'access:',
            access_token,
            'refresh:',
            refresh_token
          );
          if (access_token && refresh_token) {
            localStorage.setItem('accessToken', access_token);
            localStorage.setItem('refreshToken', refresh_token);
          }

          if (is_member) {
            navigate('/main');
          } else {
            navigate('/initial');
          }
        } catch (error) {
          console.error('Error fetching tokens:', error);
        }
      };

      fetchTokens();
    }
  }, [navigate]);

  const handleLogin = (auth) => {
    setProvider(auth);
    localStorage.setItem('provider', auth);

    let authUrl = '';
    if (auth === 'kakao') {
      authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URL}&response_type=code`;
    } else if (auth === 'google') {
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=email%20openid&response_type=code&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URL}&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}`;
    }

    window.location.href = authUrl;
  };

  return (
    <div className="Auth">
      <h2 className="h2_wrap">로그인</h2>
      <div className="wrap">
        <button onClick={() => handleLogin('kakao')} className="kakaoLogin">
          <Kakao className="kLogo" />
          카카오로 로그인{provider === 'kakao' && <h1>최근 로그인!</h1>}
        </button>
      </div>
      <div className="wrap">
        <button onClick={() => handleLogin('google')} className="googleLogin">
          <Google className="gLogo" />
          구글로 로그인{provider === 'google' && <h1>최근 로그인!</h1>}
        </button>
      </div>
    </div>
  );
};

export default Auth;
