"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, CircleAlert } from "lucide-react";
import { listMyCertificates } from "@/lib/certificates/certificate-service";
import type { Certificate } from "@/types/certificate.types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function StudentCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    listMyCertificates()
      .then((data) => {
        if (isMounted) setCertificates(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar certificados", error);
        if (isMounted) setHasLoadError(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          Certificados
        </h1>
        <p className="text-muted-foreground">
          Suas conquistas de cursos concluídos na EduStream.
        </p>
      </div>

      {hasLoadError && (
        <Alert variant="destructive" className="mt-6">
          <CircleAlert />
          <AlertTitle>Não foi possível carregar seus certificados</AlertTitle>
          <AlertDescription>
            Tente recarregar a página em instantes.
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        !hasLoadError && (
          <p className="mt-8 text-muted-foreground">
            Você ainda não concluiu nenhum curso. Continue assistindo às suas
            aulas para ganhar seu primeiro certificado.
          </p>
        )
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <Card key={certificate.id}>
              <CardHeader>
                <Award className="size-6 text-primary" />
                <CardTitle className="mt-2">
                  {certificate.courseTitle}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-1 text-sm text-muted-foreground">
                <p>Emitido para {certificate.studentName}</p>
                <p>
                  {new Date(certificate.generateAt).toLocaleDateString(
                    "pt-BR",
                    { day: "2-digit", month: "long", year: "numeric" },
                  )}
                </p>
              </CardContent>

              <CardFooter>
                <Button
                  render={
                    <Link
                      href={`/certificates/validate/${certificate.validationHash}`}
                      target="_blank"
                    />
                  }
                  variant="outline"
                  className="w-full"
                >
                  Ver certificado público
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
