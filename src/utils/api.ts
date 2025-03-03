// 카테고리 데이터를 가져오는 함수
export const fetchCategories = async (type:string) => {
    const response = await fetch("http://localhost:5000/"+`${type}`); // 실제 API URL로 변경
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return response.json();
  };
  
  
// 상세 데이터를 가져오는 함수
export const fetchCategoryList = async (categoryID:string) => {
    const response = await fetch("http://localhost:5000/"+`${categoryID}`); // 실제 API URL로 변경
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return response.json();
  };
  

// viewCount POST하는 함수
export const fechAddViewCount = async () => {
  const response = await fetch('http://localhost:5000/viewCounts', {
    method: 'POST', // POST 요청
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      viewCount: 1, // 예시로 1로 설정
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch addViewCount');
  }
  return response.json();
}