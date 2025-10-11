import React from "react";

const About = () => {
  return (
    <div
      id="about"
      className="w-full min-h-screen h-screen flex flex-col items-center justify-start bg-accent-yellow"
    >
      <div className="w-full h-full flex flex-col items-center justify-center max-w-(--breakpoint-l-s) text-left p-4 gap-8 t:text-center t:p-8">
        <div className="w-full flex flex-col items-center justify-center gap-4  text-neutral-900">
          <p className="text-2xl font-extrabold t:text-3xl l-s:text-4xl l-l:text-5xl text-accent-blue">
            Built to simplify and strengthen your organization&apos;s people
            operations.
          </p>

          <p className="text-sm t:text-base">
            Designed for both HR managers and employees, Nest integrates all
            essential HR processes — from onboarding to performance evaluation —
            into one secure and intuitive system. With role-based access, live
            dashboards, and smart reporting, Nest empowers HR teams to manage,
            track, and optimize workforce performance efficiently.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
