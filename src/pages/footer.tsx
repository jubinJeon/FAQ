import React from "react";


const Footer: React.FC = () => {
    return (
      <footer className="footer">



        <div className="inner">
          <div className="information">
            {/* 개인정보 처리방침 & 이용약관 버튼 */}
            <span className="util">
              <button type="button">
                <b>개인정보 처리방침</b>
              </button>
              <button type="button">이용약관</button>
            </span>
  
            {/* 회사 정보 */}
            <address>
              <span>서울특별시 서초구 헌릉로 12 <em>기아㈜</em></span>
              <br />
              <span>대표: <i>송호성, 최준영</i></span>
              <br />
              <span>사업자등록번호: <i>119-81-02316</i></span>
              <br />
              <span>통신판매번호: <i>2006-07935</i></span>
              <br />
              <span>고객센터: <i>1833-4964</i></span>
              <br />
              <span>
                제휴문의: <a href="mailto:wible.biz@kia.com">wible.biz@kia.com</a>
              </span>
            </address>
          </div>
  
          {/* 저작권 정보 */}
          <p className="copyright">© 2023 KIA CORP. All Rights Reserved.</p>
        </div>

        
      </footer>
    );
  };
  
  export default Footer;