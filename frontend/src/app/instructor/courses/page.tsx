"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { CircleAlert, Plus } from "lucide-react";
import { listMyCourses, createCourse } from "@/lib/courses/course-service";
import type { Course } from "@/types/course.types";
import type { ApiErrorResponse } from "@/types/api.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    listMyCourses()
      .then((data) => {
        if (isMounted) setCourses(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar meus cursos", error);
        if (isMounted) setHasLoadError(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleCreateCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const curso = await createCourse({ title, description });
      setCourses((previous) => [...previous, curso]);
      toast.success(`Curso "${curso.title}" criado!`);
      setTitle("");
      setDescription("");
      setIsDialogOpen(false);
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as ApiErrorResponse | undefined)?.message
          : undefined;
      toast.error(message ?? "Não foi possível criar o curso.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">
            Meus cursos
          </h1>
          <p className="text-muted-foreground">
            Gerencie os cursos que você publicou na EduStream.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button />}>
            <Plus />
            Novo curso
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo curso</DialogTitle>
              <DialogDescription>
                Preencha os dados básicos. Módulos e aulas você adiciona
                depois.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  required
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              <DialogFooter>
                <DialogClose render={<Button type="button" variant="outline" />}>
                  Cancelar
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Criando..." : "Criar curso"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {hasLoadError && (
        <Alert variant="destructive" className="mt-6">
          <CircleAlert />
          <AlertTitle>Não foi possível carregar seus cursos</AlertTitle>
          <AlertDescription>
            Tente recarregar a página em instantes.
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          !hasLoadError && (
            <p className="text-muted-foreground">
              Você ainda não publicou nenhum curso. Crie o primeiro acima.
            </p>
          )
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">
                    {course.title}
                  </TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">
                    {course.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
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
        )}
      </div>
    </div>
  );
}
