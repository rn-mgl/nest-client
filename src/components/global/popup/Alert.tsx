import { useAlert } from "@/src/context/AlertContext";

const Alert = () => {
  const { alert, hideAlert } = useAlert();

  if (!alert) return null;

  return (
    <div
      className="w-full h-full fixed top-0 left-0 z-60 bg-gradient-to-br from-accent-blue/30 to-accent-green/30 backdrop-blur-md
                animate-fade flex flex-col items-center justify-center p-4 t:p-8"
    >
      <div className="w-full flex flex-col items-center justify-center shadow-md max-w-(--breakpoint-m-l)">
        <div className="bg-white p-4 w-full rounded-lg flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-full flex flex-col items-center justify-center text-center gap-2">
            {alert.icon ? (
              <div className="text-5xl text-accent-blue/30 drop-shadow-sm">
                {alert.icon}
              </div>
            ) : null}
            <p className="font-bold text-xl capitalize">{alert.title}</p>
            <p className="text-sm">{alert.body}</p>
          </div>

          <div className="w-full flex flex-row items-center justify-center gap-2 mt-2">
            <button
              onClick={hideAlert}
              className="w-full max-w-40 p-2 rounded-md bg-red-600 font-bold text-neutral-100"
            >
              No
            </button>

            <button
              onClick={() => {
                alert.confirmAlert();
                hideAlert();
              }}
              className="w-full max-w-40 p-2 rounded-md bg-accent-blue font-bold text-neutral-100"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
