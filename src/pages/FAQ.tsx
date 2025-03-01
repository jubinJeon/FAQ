import React, { useEffect, useState } from "react";
import { useCategories, useCategoryList } from "../hook/useQuerys";
import Etc from './etc'


// tab 제목
enum TabEnum {
  CONSULT = "CONSULT", // 서비스 이름
  USAGE = "USAGE"      // 서비스 이용
}

interface TabType {
  type: TabEnum;
  name: string;
}

// 제목 텝 리스트
const tabTypeList: TabType[] = [
  { type: TabEnum.CONSULT, name: "서비스 이름" },
  { type: TabEnum.USAGE, name: "서비스 이용" }
];

// 중간 tab 제목
interface TabType {
  categoryID: string;
  name: string;
}

// 중간 tab 제목
const tabTitle : TabType[] = [
  { categoryID : "ALL_CONSULT", name : "전체" }
]

// itemList
interface FAQItemType {
  id: number;
  categoryName: string,
  subCategoryName: string,
  question: string,
  answer : string
}

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


const FAQ: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // 검색어 상태

  const [selectedTab, setSelectedTab] = useState<string>(tabTypeList[0].type); // 현재 선택된 탭 (초기 타입)
  const [filter, setFilter] = useState<string>(tabTitle[0].categoryID);    // 제목 필터 상태 (초기 전체)

  const { data : categoryList, isLoading, error, refetch: reUseCategories } = useCategories(selectedTab); // 텝 데이터 가지오기 (초기 )
  const { data : categoryItemList, isLoading : l, error : e, refetch: reUseCategoryList } = useCategoryList(filter); // 텝 데이터 가지오기 (초기 )

  const [openIndex, setOpenIndex] = useState<number | null>(null); // 아코디언 토글



  // const { data: faqs, error, isLoading } = useFAQs();


  // 중간 tab 제목
  const tabTitleList : TabType[] = [
    { categoryID : selectedTab === TabEnum.CONSULT ? "ALL_CONSULT" : "ALL_USAGE", name : "전체" }
  ]

  // FAQ 데이터 (실제 API 연결 가능)
  const faqData: FAQItemType[] = [...(categoryItemList?.items || [])];

  // 검색 필터링
  const filteredFAQs = faqData.filter((faq) => {
    return (
      (filter === "전체") &&
      faq.question.includes(searchQuery)
    );
  });



  // 클릭 이벤트
  const tabHandleClickEvent = (type : string) => {
    // // 선택 바꿈
    setSelectedTab(type);
  };


  // 선택함수가 바뀐후 API돌리기 
  useEffect(() => {
    reUseCategories();
    // // 필터 초기화 
    setFilter(selectedTab === TabEnum.CONSULT ? "ALL_CONSULT" : "ALL_USAGE");
    // 아코디언 초기화
    setOpenIndex(null);
  }, [selectedTab]);


  // 리스트 API돌리기 
  useEffect(() => {
    reUseCategoryList();
    // 아코디언 초기화
    setOpenIndex(null);
  }, [filter]);

  return (
    <div className="content">
        {/* 제목 */}
        <h1>
          자주 묻는 질문 <em>궁금하신 내용을 빠르게 찾아보세요.</em>
        </h1>
        <i className="sticky-checker"></i>

        {/* 01. 탭 메뉴 */}
        <ul className="tabs">
          {tabTypeList.map((tab, index) => (
            <li key={index} className={selectedTab === tab.type ? "active" : ""}>
              <a onClick={()=>tabHandleClickEvent(tab.type)}>{tab.name}</a>
            </li>
          ))}
        </ul>


        {/* 02. 검색창 */}
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
        

        {/* 03. 소제목 */}
        <div className="filter">
          { (tabTitleList.concat(categoryList) || []).map((category, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    name="filter"
                    checked={filter === category?.categoryID}
                    onChange={() => setFilter(category?.categoryID)}
                  />
                  <i>{category?.name}</i>
                </label>
              ))
          }
        </div>

        {/* 04. FAQ 리스트 */}
        <ul className="faq-list">
          {faqData.filter((faq) => {
                return ( faq.question.includes(searchQuery));
              }).map((faq, index) => (
                    <li key={index} data-ui-item="true">
                      <h4 className="a">
                        <button
                          type="button"
                          data-ui-click="dropdown-toggle"
                          onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        >
                          <em>{faq.categoryName}</em>
                          <strong>{faq.question}</strong>
                        </button>
                      </h4>
                      {/* 05. 상세 리스트 */}
                      {openIndex === index && (
                        <div className="q" data-ui-target="true">
                          <div className="inner"dangerouslySetInnerHTML={{ __html: faq.answer }}/>
                        </div>
                      )}
                    </li>
                ))}
        </ul>



        {/* 서비스 */}
        <Etc/>

    </div>
  );
};

export default FAQ;