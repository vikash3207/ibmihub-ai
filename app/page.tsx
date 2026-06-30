export default function Home() {
  return (
    <main className="container">
      <section className="hero">
        <h1>IBMiHub AI</h1>
        <p>Build, learn, and modernize IBM i with AI-powered tools for RPGLE, CL, SQL, and job logs.</p>
      </section>

      <section className="cards">
        <article>
          <h2>AI Tutor</h2>
          <p>Ask questions, get explanations, and learn IBM i skills with AI guidance.</p>
        </article>
        <article>
          <h2>RPG Playground</h2>
          <p>Upload RPGLE code for review, explanation, and modernization suggestions.</p>
        </article>
        <article>
          <h2>Learning Center</h2>
          <p>Follow lessons, complete exercises, and track your IBM i progress.</p>
        </article>
      </section>
    </main>
  );
}
