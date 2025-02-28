import React, { useState } from "react";

// FAQ 데이터 타입 정의
interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [selectedTab, setSelectedTab] = useState("서비스 도입"); // 현재 선택된 탭
  const [filter, setFilter] = useState("전체"); // 필터 상태
  const [openIndex, setOpenIndex] = useState<number | null>(null); // 아코디언 토글


  // FAQ 데이터 (실제 API 연결 가능)
  const faqData: FAQItem[] = [
    {
      category: "서비스 상품",
      question: "위블 비즈에서는 어떤 상품을 이용할 수 있나요?",
      answer: "위블 비즈에서는 업무용 및 개인용 차량을 편리하게 이용할 수 있습니다.",
    },
    {
      category: "서비스 상품",
      question: "위블 비즈 비즈니스용 상품 이용 시 무엇이 좋은가요?",
      answer: "기업 맞춤형 차량 운영, 간편한 대여 및 자동 결제 등의 장점이 있습니다.",
    },
    {
      category: "도입 상담",
      question: "비즈니스 상품 도입 기간은 얼마나 걸리나요?",
      answer: "일반적으로 도입 후 상담 후 빠른 시일 내에 이용 가능합니다.",
    },
    {
      category: "계약",
      question: "비즈니스 상품 도입 절차가 어떻게 되나요?",
      answer: "1:1 상담 → 상품 협의 → 계약 → 관리자 설정 → 임직원 가입 → 서비스 이용",
    },
  ];

  // 검색 필터링
  const filteredFAQs = faqData.filter((faq) => {
    return (
      (filter === "전체" || faq.category === filter) &&
      faq.question.includes(searchQuery)
    );
  });

  return (
    <div className="content">
        {/* 제목 */}
        <h1>
          자주 묻는 질문 <em>궁금하신 내용을 빠르게 찾아보세요.</em>
        </h1>
        <i className="sticky-checker"></i>

        {/* 탭 메뉴 */}
        <ul className="tabs">
          {["서비스 도입", "서비스 이용"].map((tab) => (
            <li key={tab} className={selectedTab === tab ? "active" : ""}>
              <a onClick={() => setSelectedTab(tab)}>{tab}</a>
            </li>
          ))}
        </ul>

        {/* 검색창 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.length < 2) {
              alert("검색어는 2글자 이상 입력해주세요.");
            }
          }}
        >
          <div className="search">
            <div className="input-wrap">
              <input
                type="text"
                placeholder="찾으시는 내용을 입력해 주세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" className="clear" onClick={() => setSearchQuery("")}>
                다시입력
              </button>
              <button type="submit" className="submit">
                검색
              </button>
            </div>
          </div>
        </form>

        {/* 필터 */}
        <div className="filter">
          {["전체", "서비스 상품", "도입 상담", "계약"].map((category) => (
            <label key={category}>
              <input
                type="radio"
                name="filter"
                checked={filter === category}
                onChange={() => setFilter(category)}
              />
              <i>{category}</i>
            </label>
          ))}
        </div>

        {/* FAQ 리스트 */}
        <ul className="faq-list">
          {filteredFAQs.map((faq, index) => (
            <li key={index} className="faq-item">
              <h4 className="a">
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <em>{faq.category}</em>
                  <strong>{faq.question}</strong>
                </button>
              </h4>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
    </div>
  );
};

export default FAQ;