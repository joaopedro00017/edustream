export default function StudentCoursesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-foreground">Catálogo</h1>
      <p className="mt-2 text-muted">
        TODO: listar cursos via <code className="text-foreground">apiClient.get(&quot;/courses&quot;)</code>{" "}
        e permitir matrícula com{" "}
        <code className="text-foreground">apiClient.post(&quot;/enrollments/{"{courseId}"}&quot;)</code>.
      </p>
    </div>
  );
}
