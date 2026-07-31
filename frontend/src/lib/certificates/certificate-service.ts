import { apiClient } from "@/lib/http/api-client";
import type { Certificate } from "@/types/certificate.types";
import type { PagedResponse } from "@/types/api.types";

// Rota Exclusiva para Alunos
export const listMyCertificates = (page = 0, size = 12) =>
  apiClient
    .get<PagedResponse<Certificate>>("/certificates/me", {
      params: { page, size },
    })
    .then((response) => response.data);
