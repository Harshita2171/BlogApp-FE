export const isAuthenticated = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return !!userInfo;
  };
  
  export const isAdmin = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo && userInfo.type === 1;
  };
  
  export const isBlogWriter = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo && userInfo.type === 2;
  };
  