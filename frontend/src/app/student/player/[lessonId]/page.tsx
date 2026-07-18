interface PlayerPageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPlayerPage({ params }: PlayerPageProps) {
  const { lessonId } = await params;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-foreground">
        Aula <span className="text-muted">#{lessonId}</span>
      </h1>
      <p className="mt-2 text-muted">
        TODO: carregar a aula, renderizar o player de vídeo e registrar o
        progresso com{" "}
        <code className="text-foreground">
          apiClient.post(&quot;/lessons-progress/{"{lessonId}"}/watch&quot;)
        </code>
        .
      </p>
    </div>
  );
}
