"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import { apiClient } from "@/lib/http/api-client";
import { useAuth } from "@/hooks/useAuth";
import { listMyCourses } from "@/lib/courses/course-service";
import { listCourseEnrollments } from "@/lib/enrollments/enrollment-service";
import type { InstructorMetrics } from "@/types/instructor.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CourseStats {
  id: string;
  title: string;
  studentCount: number;
  avgProgress: number;
}

const chartConfig = {
  studentCount: {
    label: "Alunos",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function InstructorDashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<InstructorMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [courseStats, setCourseStats] = useState<CourseStats[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  useEffect(() => {
    apiClient
      .get<InstructorMetrics>("/instructor/metrics")
      .then(({ data }) => setMetrics(data))
      .catch(() => setError("Não foi possível carregar as métricas."));
  }, []);

  useEffect(() => {
    listMyCourses()
      .then(async (courses) => {
        const enrollmentsPerCourse = await Promise.all(
          courses.map((course) => listCourseEnrollments(course.id)),
        );

        setCourseStats(
          courses.map((course, index) => {
            const enrollments = enrollmentsPerCourse[index];
            const avgProgress = enrollments.length
              ? enrollments.reduce((sum, e) => sum + e.progress, 0) /
                enrollments.length
              : 0;

            return {
              id: course.id,
              title: course.title,
              studentCount: enrollments.length,
              avgProgress,
            };
          }),
        );
      })
      .catch((error) => console.error("Erro ao buscar dados dos cursos", error))
      .finally(() => setIsLoadingCourses(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-foreground">
        Olá, {user?.name}
      </h1>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          icon={GraduationCap}
          label="Alunos"
          value={metrics?.totalAlunos}
        />
        <MetricCard
          icon={TrendingUp}
          label="Taxa de conclusão média"
          value={
            metrics
              ? `${(metrics.taxaDeConclusaoMedia * 100).toFixed(0)}%`
              : undefined
          }
        />
        <MetricCard
          icon={BookOpen}
          label="Cursos publicados"
          value={metrics?.cursosPublicados}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">Meus cursos</h2>

        {isLoadingCourses ? (
          <Skeleton className="mt-4 h-72 rounded-xl" />
        ) : courseStats.length === 0 ? (
          <p className="mt-4 text-muted-foreground">
            Você ainda não publicou nenhum curso. Assim que tiver alunos
            matriculados, o desempenho de cada curso aparece aqui.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Alunos matriculados por curso</CardTitle>
                <CardDescription>
                  Quantos alunos cada curso já atraiu.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="w-full"
                  style={{
                    height: Math.max(200, courseStats.length * 48),
                  }}
                >
                  <BarChart
                    data={courseStats}
                    layout="vertical"
                    margin={{ left: 0 }}
                  >
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="title"
                      width={120}
                      tickFormatter={(title: string) =>
                        title.length > 18 ? `${title.slice(0, 18)}…` : title
                      }
                    />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Bar
                      dataKey="studentCount"
                      fill="var(--color-studentCount)"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progresso por curso</CardTitle>
                <CardDescription>
                  Progresso médio dos alunos matriculados em cada curso.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Curso</TableHead>
                      <TableHead>Progresso</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseStats.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="max-w-40 truncate font-medium">
                          {course.title}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={course.avgProgress}
                              className="w-24"
                            />
                            <span className="text-sm text-muted-foreground">
                              {Math.round(course.avgProgress)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            nativeButton={false}
                            render={
                              <Link href={`/instructor/courses/${course.id}`} />
                            }
                            variant="outline"
                            size="sm"
                          >
                            Gerenciar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number | undefined;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">{label}</dt>
          <dd className="text-2xl font-semibold text-foreground">
            {value ?? "—"}
          </dd>
        </div>
      </CardContent>
    </Card>
  );
}
