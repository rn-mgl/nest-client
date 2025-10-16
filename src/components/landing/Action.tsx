import Logo from "../global/navigation/Logo";

const Action = () => {
  return (
    <div
      id="action"
      className="w-full min-h-screen h-screen flex flex-col items-center justify-start bg-accent-blue"
    >
      <div
        className="w-full h-full flex flex-col items-start justify-center max-w-(--breakpoint-l-s) text-left p-4 gap-8
                    t:items-center t:justify-start t:text-center "
      >
        <div className="w-full flex flex-col items-start justify-start gap-4 t:items-center t:justify-center my-auto text-neutral-50">
          <p className="text-2xl font-extrabold t:text-3xl l-s:text-4xl text-accent-yellow">
            Build a Smarter, Connected Workplace with Nest
          </p>

          <p className="text-xl">
            Take control of your organization&apos;s HR operations.
          </p>

          <LogoNav type="light" url="/#hero" />
        </div>
      </div>
    </div>
  );
};

export default Action;
