import { Link, Outlet, useLocation } from "react-router";

const DashboardLayout = () => {
  const location = useLocation()
  const pathname = location.pathname

  const paths = [
    "/excel-to-excel",
    "/formatter1",
    "/formatter2"
  ]

  const getActiveLinkClass = (path: string) => {
    const isValidPath = paths.includes(path)
    const activeClass = (isValidPath && pathname === path) 
      ? "border-b border-black" 
      : ""

    return activeClass
  }

  return (
    <>
      <header
        className={`bg-white shadow-md w-screen flex items-center h-16 px-8 sticky top-0`}
      >
        <div className="flex items-center justify-between gap-12 max-w-6xl w-full m-auto">
          <h1 className="text-sm font-semibold">Bari Workspace</h1>
          <nav className="">
            <ul 
              className="transtion text-sm flex gap-4 font-normal"
            >
              <li className={`${getActiveLinkClass("/excel-to-excel")}`}>
                <Link to={"/excel-to-excel"}>Excel to Excel</Link>
              </li>
            </ul>
          </nav>
        </div>
  
      </header>

      <main
        className={`
          font-jakarta bg-background flex h-screen w-screen overflow-hidden
        `}
      >
    
        <section className="w-full flex flex-col pt-16 px-8 gap-12">
          <div className="w-full flex items-center justify-center">
            <Outlet />
          </div>
        </section>
      </main>
    </>
  );
}

export default DashboardLayout;
