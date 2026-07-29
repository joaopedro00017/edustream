"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { CircleAlert, Pencil, Plus, Trash2 } from "lucide-react";
import { listMyCourses } from "@/lib/courses/course-service";
import {
  deleteModule,
  listModulesByCourse,
  updateModule,
} from "@/lib/modules/module-service";
import {
  createLesson,
  deleteLesson,
  listLessonsByModule,
  updateLesson,
} from "@/lib/lessons/lesson-service";
import type { Course } from "@/types/course.types";
import type { CourseModule } from "@/types/module.types";
import type { Lesson } from "@/types/lesson.types";
import type { ApiErrorResponse } from "@/types/api.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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

const EMPTY_LESSON_FORM = { title: "", description: "", videoUrl: "" };

export default function InstructorModuleDetailPage() {
  const { courseId, moduleId } = useParams<{
    courseId: string;
    moduleId: string;
  }>();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [courseModule, setCourseModule] = useState<CourseModule | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  const [isEditModuleOpen, setIsEditModuleOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isSavingModule, setIsSavingModule] = useState(false);

  const [isDeleteModuleOpen, setIsDeleteModuleOpen] = useState(false);
  const [isDeletingModule, setIsDeletingModule] = useState(false);

  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonForm, setLessonForm] = useState(EMPTY_LESSON_FORM);
  const [isSavingLesson, setIsSavingLesson] = useState(false);

  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    Promise.all([
      listMyCourses(),
      listModulesByCourse(courseId),
      listLessonsByModule(moduleId),
    ])
      .then(([cursos, modulosDoCurso, aulasDoModulo]) => {
        setCourse(cursos.find((c) => c.id === courseId) ?? null);
        const moduloAtual =
          modulosDoCurso.find((m) => m.id === moduleId) ?? null;
        setCourseModule(moduloAtual);
        setLessons(aulasDoModulo);
        if (moduloAtual) {
          setEditTitle(moduloAtual.title);
          setEditDescription(moduloAtual.description);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar dados do módulo", error);
        setHasLoadError(true);
      })
      .finally(() => setIsLoading(false));
  }, [courseId, moduleId]);

  async function handleUpdateModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingModule(true);

    try {
      const moduloAtualizado = await updateModule(moduleId, {
        title: editTitle,
        description: editDescription,
        courseId,
      });
      setCourseModule(moduloAtualizado);
      toast.success("Módulo atualizado!");
      setIsEditModuleOpen(false);
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as ApiErrorResponse | undefined)?.message
          : undefined;
      toast.error(message ?? "Não foi possível atualizar o módulo.");
    } finally {
      setIsSavingModule(false);
    }
  }

  async function handleDeleteModule() {
    setIsDeletingModule(true);

    try {
      await deleteModule(moduleId);
      toast.success("Módulo excluído.");
      router.push(`/instructor/courses/${courseId}`);
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as ApiErrorResponse | undefined)?.message
          : undefined;
      toast.error(message ?? "Não foi possível excluir o módulo.");
      setIsDeletingModule(false);
    }
  }

  function openCreateLessonDialog() {
    setEditingLesson(null);
    setLessonForm(EMPTY_LESSON_FORM);
    setIsLessonDialogOpen(true);
  }

  function openEditLessonDialog(lesson: Lesson) {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
    });
    setIsLessonDialogOpen(true);
  }

  async function handleSubmitLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingLesson(true);

    try {
      if (editingLesson) {
        const aulaAtualizada = await updateLesson(editingLesson.id, {
          ...lessonForm,
          moduleId,
        });
        setLessons((previous) =>
          previous.map((aula) =>
            aula.id === aulaAtualizada.id ? aulaAtualizada : aula,
          ),
        );
        toast.success("Aula atualizada!");
      } else {
        const aulaCriada = await createLesson({ ...lessonForm, moduleId });
        setLessons((previous) => [...previous, aulaCriada]);
        toast.success(`Aula "${aulaCriada.title}" criada!`);
      }
      setIsLessonDialogOpen(false);
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as ApiErrorResponse | undefined)?.message
          : undefined;
      toast.error(message ?? "Não foi possível salvar a aula.");
    } finally {
      setIsSavingLesson(false);
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    try {
      await deleteLesson(lessonId);
      setLessons((previous) => previous.filter((aula) => aula.id !== lessonId));
      toast.success("Aula excluída.");
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as ApiErrorResponse | undefined)?.message
          : undefined;
      toast.error(message ?? "Não foi possível excluir a aula.");
    } finally {
      setDeletingLessonId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-6 h-8 w-1/2" />
        <Skeleton className="mt-8 h-40 rounded-xl" />
      </div>
    );
  }

  if (hasLoadError || !course || !courseModule) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Não foi possível carregar este módulo</AlertTitle>
          <AlertDescription>
            Tente recarregar a página em instantes.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/instructor/courses" />}>
              Meus cursos
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href={`/instructor/courses/${courseId}`} />}
            >
              {course.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{courseModule.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">
            {courseModule.title}
          </h1>
          <p className="text-muted-foreground">{courseModule.description}</p>
        </div>

        <div className="flex shrink-0 gap-2">
          <Dialog open={isEditModuleOpen} onOpenChange={setIsEditModuleOpen}>
            <DialogTrigger render={<Button variant="outline" size="sm" />}>
              <Pencil />
              Editar
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar módulo</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateModule} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-module-title">Título</Label>
                  <Input
                    id="edit-module-title"
                    required
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-module-description">Descrição</Label>
                  <Textarea
                    id="edit-module-description"
                    required
                    value={editDescription}
                    onChange={(event) =>
                      setEditDescription(event.target.value)
                    }
                  />
                </div>
                <DialogFooter>
                  <DialogClose
                    render={<Button type="button" variant="outline" />}
                  >
                    Cancelar
                  </DialogClose>
                  <Button type="submit" disabled={isSavingModule}>
                    {isSavingModule ? "Salvando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <AlertDialog
            open={isDeleteModuleOpen}
            onOpenChange={setIsDeleteModuleOpen}
          >
            <AlertDialogTrigger
              render={<Button variant="destructive" size="sm" />}
            >
              <Trash2 />
              Excluir
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Excluir &quot;{courseModule.title}&quot;?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Isso também exclui todas as aulas deste módulo. Essa ação
                  não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={handleDeleteModule}
                  disabled={isDeletingModule}
                >
                  {isDeletingModule ? "Excluindo..." : "Excluir"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground">Aulas</h2>

        <Dialog
          open={isLessonDialogOpen}
          onOpenChange={(open) => {
            setIsLessonDialogOpen(open);
            if (!open) setEditingLesson(null);
          }}
        >
          <DialogTrigger render={<Button size="sm" onClick={openCreateLessonDialog} />}>
            <Plus />
            Nova aula
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLesson ? "Editar aula" : "Nova aula"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitLesson} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="lesson-title">Título</Label>
                <Input
                  id="lesson-title"
                  required
                  value={lessonForm.title}
                  onChange={(event) =>
                    setLessonForm((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lesson-description">Descrição</Label>
                <Textarea
                  id="lesson-description"
                  required
                  value={lessonForm.description}
                  onChange={(event) =>
                    setLessonForm((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lesson-video-url">URL do vídeo</Label>
                <Input
                  id="lesson-video-url"
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={lessonForm.videoUrl}
                  onChange={(event) =>
                    setLessonForm((previous) => ({
                      ...previous,
                      videoUrl: event.target.value,
                    }))
                  }
                />
              </div>
              <DialogFooter>
                <DialogClose
                  render={<Button type="button" variant="outline" />}
                >
                  Cancelar
                </DialogClose>
                <Button type="submit" disabled={isSavingLesson}>
                  {isSavingLesson ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4">
        {lessons.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma aula criada ainda.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Vídeo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.map((aula) => (
                <TableRow key={aula.id}>
                  <TableCell className="font-medium">{aula.title}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {aula.videoUrl}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2 text-right">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => openEditLessonDialog(aula)}
                    >
                      <Pencil />
                    </Button>

                    <AlertDialog
                      open={deletingLessonId === aula.id}
                      onOpenChange={(open) =>
                        setDeletingLessonId(open ? aula.id : null)
                      }
                    >
                      <AlertDialogTrigger
                        render={<Button variant="destructive" size="icon-sm" />}
                      >
                        <Trash2 />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Excluir &quot;{aula.title}&quot;?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Essa ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => handleDeleteLesson(aula.id)}
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
