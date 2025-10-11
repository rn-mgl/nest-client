import Image from "next/image";
import dashboard from "@/public/landing/dashboard.png";
import users from "@/public/landing/management/users.png";
import attendanceManagement from "@/public/landing/management/attendances.png";
import onboardingManagement from "@/public/landing/management/onboardings.png";
import leaveManagement from "@/public/landing/management/leaves.png";
import performanceManagement from "@/public/landing/management/performances.png";
import trainingManagement from "@/public/landing/management/trainings.png";
import onboardings from "@/public/landing/onboardings.png";
import leaves from "@/public/landing/leaves.png";
import performances from "@/public/landing/performances.png";
import trainings from "@/public/landing/trainings.png";
import documents from "@/public/landing/documents.png";

const Offers = () => {
  return (
    <div
      id="offers"
      className="w-full h-auto flex flex-col items-center justify-start  bg-neutral-100"
    >
      <div className="w-full h-full flex flex-col items-center justify-start max-w-(--breakpoint-l-s) p-4 text-center gap-4 t:p-8">
        <div className="w-full text-center">
          <p
            className="text-2xl font-extrabold t:text-3xl l-s:text-4xl l-l:text-5xl text-center bg-gradient-to-br 
                  from-accent-blue to-accent-green text-transparent bg-clip-text"
          >
            All-in-One
          </p>
          <p className="font-semibold">Human Resource Manager</p>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div className="flex items-start flex-col text-left gap-2">
            <p className="font-bold text-lg">Dashboard</p>
            <p className="text-sm">
              Gain full visibility into your organization’s HR activities with a
              comprehensive dashboard
            </p>

            <Image
              src={dashboard}
              alt="dashboard"
              className="w-full rounded-md hover:scale-110 transition-all"
            />
          </div>

          <div className="flex items-end flex-col text-right gap-2">
            <p className="font-bold text-lg">Management</p>
            <p className="text-sm">Monitor employee records with ease.</p>

            <Image
              src={users}
              alt="dashboard"
              className="w-full rounded-md hover:scale-110 transition-all"
            />

            <Image
              src={attendanceManagement}
              alt="dashboard"
              className="w-full rounded-md hover:scale-110 transition-all"
            />

            <Image
              src={onboardingManagement}
              alt="dashboard"
              className="w-full rounded-md hover:scale-110 transition-all"
            />

            <Image
              src={leaveManagement}
              alt="dashboard"
              className="w-full rounded-md hover:scale-110 transition-all"
            />

            <Image
              src={performanceManagement}
              alt="dashboard"
              className="w-full rounded-md hover:scale-110 transition-all"
            />

            <Image
              src={trainingManagement}
              alt="dashboard"
              className="w-full rounded-md hover:scale-110 transition-all"
            />
          </div>

          <div className="flex items-start flex-col text-left gap-2">
            <p className="font-bold text-lg">Onboardings</p>
            <p className="text-sm">Digitize your onboarding process.</p>

            <Image
              src={onboardings}
              alt="Onboarding"
              className="w-full rounded-md hover:scale-110 transition-all"
            />
          </div>

          <div className="flex items-end flex-col text-right gap-2">
            <p className="font-bold text-lg">Leave Management</p>
            <p className="text-sm">
              Simplify the leave process with a clear workflow.
            </p>

            <Image
              src={leaves}
              alt="leaves"
              className="w-full rounded-md hover:scale-110 transition-all"
            />
          </div>

          <div className="flex items-start flex-col text-left gap-2">
            <p className="font-bold text-lg">Performance Review</p>
            <p className="text-sm">
              Set up structured performance cycles with custom evaluation forms,
              feedback modules, and goal-setting features.
            </p>

            <Image
              src={performances}
              alt="Performances"
              className="w-full rounded-md hover:scale-110 transition-all"
            />
          </div>

          <div className="flex items-end flex-col text-right gap-2">
            <p className="font-bold text-lg">Training & Development</p>
            <p className="text-sm">Track employee growth.</p>

            <Image
              src={trainings}
              alt="trainings"
              className="w-full rounded-md hover:scale-110 transition-all"
            />
          </div>

          <div className="flex items-start flex-col text-left gap-2">
            <p className="font-bold text-lg">Global Documents</p>
            <p className="text-sm">
              Manage documents, policies, and resources efficiently.
            </p>

            <Image
              src={documents}
              alt="documents"
              className="w-full rounded-md hover:scale-110 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;
