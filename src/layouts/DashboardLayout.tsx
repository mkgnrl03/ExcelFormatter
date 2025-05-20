import { Link, Outlet, useLocation } from "react-router";

const DashboardLayout = () => {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <main
      className="flex bg-gray-100 h-screen w-screen overflow-hidden"
    >
      <header
        className={`
         bg-white w-72
          flex flex-col items-start gap-12 p-4
        `}
      >
        <div className="bg-gray-100 rounded-md w-full p-3 flex items-center gap-2">
          <img className="w-8 h-8 rounded-full bg-gray-500"/>
          <h1 className="text-sm font-semibold">Bari Workspace</h1>
        </div>

        <nav className="ml-2">
          <ul 
            className="transtion text-sm flex flex-col gap-2 tracking-wide font-semibold"
          >
            <li className={`
              transition
              ${pathname === "/formatter1" ? "border-b" : "border-none"} 
            `}>
              <Link to={"/formatter1"}>Excel Formatter v1</Link>
            </li>
           <li className={`
              ${pathname === "/formatter2" ? "border-b" : "border-none"} 
            `}>
              <Link to={"/formatter2"}>Excel Formatter v2</Link>
            </li>
          </ul>
        </nav>
      </header>
       <section className="w-full flex flex-col pt-16 px-8 gap-12">
        <div className="w-full flex items-center justify-center">
           <Outlet />
        </div>
      </section>
    </main>
  );
}

export default DashboardLayout;
