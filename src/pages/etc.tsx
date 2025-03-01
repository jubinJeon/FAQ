import React from "react";
        
interface TabType {
    icon: string;
    title: string;
    description: string;
  }
  
  // 이용가이드
  const processSteps: TabType[]  = [
    { icon: "process-1", title: "문의 등록", description: "상담 문의를 등록해 주시면, 담당자가 맞춤형 상담을 제공합니다." },
    { icon: "process-2", title: "관리자 설정", description: "관리자 Web 접속 후 결제방식 및 회사정보를 설정합니다." },
    { icon: "process-3", title: "임직원 가입", description: "사용자 App에서 회원가입 후 소속 회사 인증을 진행합니다." },
    { icon: "process-4", title: "서비스 이용", description: "사용자 App에서 차량 예약을 하고 위블존에서 바로 이용하세요!" }
  ];

  
  const Etc: React.FC = () => {


    return (
        <>
            {/* 서비스 */}
            <h2 className="heading-2">서비스 문의</h2>

                {/* 상품 다운 */}
                <div className="inquiry-info">
                    <a className="btn-xxlg btn-tertiary" href="/static/media/proposal.604393960f70e45463b6.pdf" download="위블비즈 상품제안서">
                    <i className="ic download"></i>
                    <span>상품제안서 다운로드</span>
                    </a>

                {/* 상담문의 등록 */}
                <a className="btn-xxlg btn-tertiary" href="/Counsel">
                <i className="ic write"></i>
                <span>상담문의 등록하기</span>
                </a>

                {/* 카카오톡 문의 */}
                <a
                className="btn-xxlg btn-tertiary"
                href="https://pf.kakao.com/_xfLxjdb"
                target="_blank"
                rel="noreferrer"
                >
                <i className="ic talk"></i>
                <span>카톡으로 문의하기 
                    <em>ID: Wible Biz(위블 비즈)</em>
                    </span>
                </a>
            </div>



            {/* 이용 프로세스 안내 */}
            <h2 className="heading-2">이용 프로세스 안내</h2>
            <ol className="process-info">
                {processSteps.map((step, index) => (
                    <li key={index}>
                    <i className={`ic ${step.icon}`}></i>
                    <span>
                        <strong>{step.title}</strong>
                        <em>{step.description}</em>
                    </span>
                    </li>
                ))}
            </ol>

            {/* 앱 */}
            <div className="app-info">
                <h2>
                <em>위블 비즈 App</em> 지금 만나보세요!
                </h2>
                <a
                href="https://play.google.com/store/apps/details?id=kor.mop.user.app"
                target="_blank"
                className="gp"
                rel="noreferrer"
                >
                Google Play
                </a>
                <a
                href="https://apps.apple.com/kr/app/%EC%9C%84%EB%B8%94-%EB%B9%84%EC%A6%88/id1598065794"
                target="_blank"
                className="as"
                rel="noreferrer"
                >
                App Store
                </a>
            </div>
      </>
    );

};

export default Etc;