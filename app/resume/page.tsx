export const metadata = {
  title: "Resume",
  description: "My professional experience and skills.",
};

export default function ResumePage() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Resume</h1>

      <div className="prose prose-neutral dark:prose-invert">
        <h2>Experience</h2>
        <h3>
          <span>Front End Developer - </span>
          <a href="https://www.hirschtec.eu/" target="_blank" rel="noopener noreferrer">
            Hirschtec GmbH & Co. KG
          </a>
        </h3>
        Mar 2023 - Present (+2 years)
        <ul>
          <li>Spearheaded the development of happycrm.de, enhancing CRM functionalities and user engagement
            by 10%, by integrating advanced JavaScript and TypeScript solutions.</li>
          <li>Collaborated in a team to innovate company product offerings, leading to a 15% increase in product
            usability and customer satisfaction through strategic UI/UX design enhancements.</li>
          <li>Designed and deployed a proprietary library of product interface components, resulting in a 12%
            reduction in frontend development time by leveraging React expertise.</li>
        </ul>

        <h3>
          <span>Front End Developer - </span>
          <a href="https://timeweb.ru/" target="_blank" rel="noopener noreferrer">
            Timeweb
          </a>
        </h3>
        Feb 2023 - Apr 2023 (3 months)
        <ul>
          <li>Led a comprehensive overhaul of the legacy codebase, transitioning to cutting-edge technologies,
            which catalyzed a 9% surge in website conversion rates.</li>
          <li>Championed ongoing A/B testing initiatives, optimizing user experience and facilitating data-driven
            decisions, resulting in a 7% uplift in user engagement.</li>
          <li>Fostered collaboration with UX/UI designers to revamp the user interface, significantly elevating user
            satisfaction and engagement by 14%.</li>
        </ul>

        <h3>
          <span>Front End Developer - </span>
          <a href="https://ati.su/" target="_blank" rel="noopener noreferrer">
            ATI.SU
          </a>
        </h3>
        Mar 2022 - Feb 2023 (1 year)
        <ul>
          <li>Spearheaded the launch of 5+ internal services across 3 departments, enhancing operational
            efficiency by automating inspections using RESTful API services and webjobs, directly aligning with the
            need for technical proficiency in JavaScript and TypeScript.</li>
          <li>Collaborated with product team members on new feature developments, demonstrating strong
            teamwork and communication skills, essential for Agile environments.</li>
          <li>Adapted project outputs to meet changing business deadlines, showcasing flexibility and a
            commitment to meeting project goals within the Sprint timeline, reflecting an Agile methodology
            mindset.</li>
        </ul>

        <h3>
          Full Stack Developer - Freelance
        </h3>
        Jul 2019 - Mar 2022 (2 years 9 months)
        <ul>
          <li>Launched diverse web solutions, including websites and mobile applications, from inception to
            deployment, enhancing digital presence and user accessibility by adopting a pioneering mobile-first
            strategy.</li>
          <li>Revolutionized output standardization through the implementation of a responsive, mobile-first design
            philosophy, resulting in a 20% surge in mobile traffic by optimizing user experience across devices.</li>
          <li>Conducted meticulous assessments of UX and UI designs for technical viability, ensuring seamless
            integration and functionality that aligns with strategic business goals.</li>
        </ul>

        <h2>Skills</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "JavaScript", "TypeScript", "React", "Redux", "Next.js",
            "HTML", "CSS", "SASS", "Node.js", "Express.js",
            "REST API", "GraphQL", "Git", "GitHub"
          ].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm hover:bg-neutral-200"
            >
              {skill}
            </span>
          ))}
        </div>

        <h2>Education</h2>
        <h3>
          <span>Master of Engineering - </span>
          <a href="https://www.sibstrin.ru/" target="_blank" rel="noopener noreferrer">
            Novosibirsk State University of Architecture and Civil Engeering
          </a>
        </h3>
        Jul 2009 - 2014
        <p>Master of Engeering</p>

        <h2>Licenses & Certifications</h2>
        <a href="https://www.efset.org/cert/EW2iu3" target="_blank" rel="noopener noreferrer">
          Test of English as a Foreign Language - EF Standard English Test (EF SET)
        </a>

      </div>
      <div className="mt-8">
        <a
          href="https://drive.google.com/file/d/1nHWiY8zfWpUEKTqWO3VwaAAUKH9XGtOb/view?usp=sharing"
          className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 cursor-pointer"
          download
        >
          Download PDF
        </a>
      </div>
    </section >
  );
}