export default function StudentCertificatesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-foreground">Certificados</h1>
      <p className="mt-2 text-muted">
        TODO: listar conquistas via{" "}
        <code className="text-foreground">apiClient.get(&quot;/certificates/me&quot;)</code>.
      </p>
    </div>
  );
}
