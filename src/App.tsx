import { BrowserRouter, Route, Routes } from "react-router"; 
import DashboardLayout from "./layouts/DashboardLayout";
import ExcelFormatter1 from "./pages/ExcelFormatter1";
import ExcelFormatter2 from "./pages/ExcelFormatter2";
import Home from "./pages/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />}/>
        <Route element={<DashboardLayout />}>
          <Route path="formatter1" element={<ExcelFormatter1 />}/>
          <Route path="formatter2" element={<ExcelFormatter2 />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
