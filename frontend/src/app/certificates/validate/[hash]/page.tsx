import { API_BASE_URL } from "@/lib/config/env";
import type { Certificate } from "@/types/certificate.types";

interface ValidateCertificatePageProps {
  params: Promise<{ hash: string }>;
}

/**
 * Rota pública — busca direto no backend em Server Component (sem passar
 * pelo apiClient, que depende de localStorage e só existe no client).
 */
async function fetchCertificate(hash: string): Promise<Certificate | null> {
  const response = await fetch(`${API_BASE_URL}/certificates/validate/${hash}`, {
    cache: "no-store",
  });

  if (!response.ok) return null;
  return response.json() as Promise<Certificate>;
}

export default async function ValidateCertificatePage({
  params,
}: ValidateCertificatePageProps) {
  const { hash } = await params;
  const certificate = await fetchCertificate(hash);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-surface p-8 text-center">
        {certificate ? (
          <>
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Certificado válido
            </span>
            <h1 className="text-2xl font-semibold text-foreground">
              {certificate.courseTitle}
            </h1>
            <p className="text-muted-foreground">
              Emitido para{" "}
              <span className="text-foreground">{certificate.studentName}</span> em{" "}
              {new Date(certificate.generateAt).toLocaleDateString("pt-BR")}
            </p>
            <p className="break-all text-xs text-muted-foreground">
              Hash: {certificate.validationHash}
            </p>
          </>
        ) : (
          <>
            <span className="inline-block rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">
              Certificado não encontrado
            </span>
            <p className="text-muted-foreground">
              O hash informado não corresponde a nenhum certificado emitido pela
              EduStream.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
