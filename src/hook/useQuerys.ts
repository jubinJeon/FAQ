import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchCategoryList } from '../utils/api'


// React Query를 사용한 커스텀 훅
export const useCategories = (type:string) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(type)
  });
};



// React Query를 사용한 커스텀 훅
export const useCategoryList = (categoryID:string) => {
  return useQuery({
    queryKey: ["categoryList"],
    queryFn: () => fetchCategoryList(categoryID),
  });
};
