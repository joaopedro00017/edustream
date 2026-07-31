"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { CircleAlert, Pencil, Plus, Trash2 } from "lucide-react";
import {
  deleteCourse,
  getCourse,
  updateCourse,
} from "@/lib/courses/course-service";
import {
  createModule,
  listModulesByCourse,
} from "@/lib/modules/module-service";
import { listCourseEnrollments } from "@/lib/enrollments/enrollment-service";
import type { Course } from "@/types/course.types";
import type { CourseModule } from "@/types/module.types";
import type { EnrolledStudent } from "@/types/enrollment.types";
import type { ApiErrorResponse } from "@/types/api.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export default function InstructorCourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isSavingCourse, setIsSavingCourse] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeletingCourse, setIsDeletingCourse] = useState(false);

  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [isCreatingModule, setIsCreatingModule] = useState(false);

  useEffect(() => {
    Promise.all([
      getCourse(courseId),
      listModulesByCourse(courseId),
      listCourseEnrollments(courseId),
    ])
      .then(([cursoAtual, modulosDoCurso, alunosMatriculados]) => {
        setCourse(cursoAtual);
        setModules(modulosDoCurso);
        setEnrolledStudents(alunosMatriculados);
        setEditTitle(cursoAtual.title);
        setEditDescription(cursoAtual.description);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados do curso", error);
        setHasLoadError(true);
      })
      .finally(() => setIsLoading(false));
  }, [courseId]);

  async function handleUpdateCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingCourse(true);

    try {
      const cursoAtualizado = await updateCourse(courseId, {
        title: editTitle,
        description: editDescription,
      });
      setCourse(cursoAtualizado);
      toast.success("Curso atualizado!");
      setIsEditOpen(false);
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as ApiErrorResponse | undefined)?.message
          : undefined;
      toast.error(message ?? "Não foi possível atualizar o curso.");
    } finally {
      setIsSavingCourse(false);
    }
  }

  async function handleDeleteCourse() {
    setIsDeletingCourse(true);

    try {
      await deleteCourse(courseId);
      toast.success("Curso excluído.");
      router.push("/instructor/courses");
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as ApiErrorResponse | undefined)?.message
          : undefined;
      toast.error(message ?? "Não foi possível excluir o curso.");
      setIsDeletingCourse(false);
    }
  }

  async function handleCreateModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsCreatingModule(true);

    try {
      const modulo = await createModule({
        title: moduleTitle,
        description: moduleDescription,
        courseId,
      });
      setModules((previous) => [...previous, modulo]);
      toast.success(`Módulo "${modulo.title}" criado!`);
      setModuleTitle("");
      setModuleDescription("");
      setIsModuleDialogOpen(false);
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as ApiErrorResponse | undefined)?.message
          : undefined;
      toast.error(message ?? "Não foi possível criar o módulo.");
    } finally {
      setIsCreatingModule(false);
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

  if (hasLoadError || !course) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Não foi possível carregar este curso</AlertTitle>
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
            <BreadcrumbPage>{course.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">
            {course.title}
          </h1>
          <p className="text-muted-foreground">{course.description}</p>
        </div>

        <div className="flex shrink-0 gap-2">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger render={<Button variant="outline" size="sm" />}>
              <Pencil />
              Editar
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar curso</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateCourse} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-title">Título</Label>
                  <Input
                    id="edit-title"
                    required
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-description">Descrição</Label>
                  <Textarea
                    id="edit-description"
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
                  <Button type="submit" disabled={isSavingCourse}>
                    {isSavingCourse ? "Salvando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
              <Trash2 />
              Excluir
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir &quot;{course.title}&quot;?</AlertDialogTitle>
                <AlertDialogDescription>
                  Isso também exclui todos os módulos e aulas deste curso.
                  Essa ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={handleDeleteCourse}
                  disabled={isDeletingCourse}
                >
                  {isDeletingCourse ? "Excluindo..." : "Excluir"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="modulos" className="mt-10">
        <TabsList>
          <TabsTrigger value="modulos">Módulos</TabsTrigger>
          <TabsTrigger value="alunos">Alunos matriculados</TabsTrigger>
        </TabsList>

        <TabsContent value="modulos">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground">Módulos</h2>

            <Dialog
              open={isModuleDialogOpen}
              onOpenChange={setIsModuleDialogOpen}
            >
              <DialogTrigger render={<Button size="sm" />}>
                <Plus />
                Novo módulo
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo módulo</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateModule} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="module-title">Título</Label>
                    <Input
                      id="module-title"
                      required
                      value={moduleTitle}
                      onChange={(event) =>
                        setModuleTitle(event.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="module-description">Descrição</Label>
                    <Textarea
                      id="module-description"
                      required
                      value={moduleDescription}
                      onChange={(event) =>
                        setModuleDescription(event.target.value)
                      }
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose
                      render={<Button type="button" variant="outline" />}
                    >
                      Cancelar
                    </DialogClose>
                    <Button type="submit" disabled={isCreatingModule}>
                      {isCreatingModule ? "Criando..." : "Criar módulo"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-4 space-y-3">
            {modules.length === 0 ? (
              <p className="text-muted-foreground">
                Nenhum módulo criado ainda.
              </p>
            ) : (
              modules.map((modulo) => (
                <Card key={modulo.id}>
                  <CardHeader>
                    <CardTitle>{modulo.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {modulo.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      nativeButton={false}
                      render={
                        <Link
                          href={`/instructor/courses/${courseId}/modules/${modulo.id}`}
                        />
                      }
                      variant="outline"
                      className="w-full"
                    >
                      Gerenciar aulas
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="alunos">
          {enrolledStudents.length === 0 ? (
            <p className="text-muted-foreground">
              Nenhum aluno matriculado neste curso ainda.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Progresso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrolledStudents.map((aluno) => (
                  <TableRow key={aluno.studentId}>
                    <TableCell>{aluno.studentName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {aluno.studentEmail}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={aluno.progress}
                          className="w-32"
                        />
                        <span className="text-sm text-muted-foreground">
                          {Math.round(aluno.progress)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
