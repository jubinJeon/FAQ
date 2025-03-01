import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FAQ from "./pages/FAQ"
import Header from "./pages/header"
import Footer from "./pages/footer"

const queryClient = new QueryClient();

const AppRouter = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="wrapper">
        {/* 라우터 */}
        <Router>
          {/* 헤더 */}
          <Header/>
          {/* 몸통 */}
          <div className="container">
            <Routes>
              {/* home이없어서 */}
              <Route path="/" element={<FAQ />} />  
              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </div>
          {/* 바텀 */}
          <Footer/>
        </Router>
      </div>
    </QueryClientProvider>
  );
};

export default AppRouter;