import { apiClient } from "@/lib/http/api-client";
import type { Certificate } from "@/types/certificate.types";

// Rota Exclusiva para Alunos
export const listMyCertificates = () =>
  apiClient
    .get<Certificate[]>("/certificates/me")
    .then((response) => response.data);
