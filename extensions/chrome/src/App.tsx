// import { useState } from "react";

function App() {
  // const [open, setOpen] = useState(true);

  const open = true;
  return (
    <>
      {!open && (
        <div className="app absolute right-0 top-0 h-4 w-4 rounded-md bg-white p-4 shadow-md">
          <h2 className="mb-2 text-lg font-semibold">Control Panel</h2>
          <div className="flex flex-col space-y-2">
            <button
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-gray-600"
              // onClick={() => setOpen(true)}
            >
              open
            </button>
          </div>
        </div>
      )}
      {open && (
        <div className="app absolute right-0 top-0 h-96 w-96 rounded-md bg-white p-4 shadow-md">
          <h2 className="mb-2 text-lg font-semibold">Control Panel</h2>
          <div className="flex flex-col space-y-2">
            <button
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-gray-600"
              // onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;