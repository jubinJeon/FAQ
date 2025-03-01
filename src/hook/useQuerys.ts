import { useQuery } from "@tanstack/react-query";

// 카테고리 데이터를 가져오는 함수
const fetchCategories = async (type:string) => {
  const response = await fetch("http://localhost:5000/"+`${type}`); // 실제 API URL로 변경
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
};

// React Query를 사용한 커스텀 훅
export const useCategories = (type:string) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(type)
  });
};


// 상세 데이터를 가져오는 함수
const fetchCategoryList = async (categoryID:string) => {
  const response = await fetch("http://localhost:5000/"+`${categoryID}`); // 실제 API URL로 변경
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
};

// React Query를 사용한 커스텀 훅
export const useCategoryList = (categoryID:string) => {
  return useQuery({
    queryKey: ["categoryList"],
    queryFn: () => fetchCategoryList(categoryID),
  });
};

