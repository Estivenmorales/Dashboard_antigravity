import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const stationSchema = z.object({
  name: z.string().min(3, "El nombre de la estación debe tener al menos 3 caracteres"),
  isp: z.string().min(1, "Por favor selecciona un ISP"),
  department: z.string().min(1, "Por favor selecciona un departamento"),
  availability: z
    .number()
    .min(0)
    .max(100, "La disponibilidad debe estar entre 0 y 100"),
  downtime: z.number().min(0, "La indisponibilidad no puede ser negativa"),
});

type StationFormValues = z.infer<typeof stationSchema>;

interface AddStationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (data: StationFormValues) => void;
}

export function AddStationModal({
  open,
  onOpenChange,
  onSuccess,
}: AddStationModalProps) {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StationFormValues>({
    resolver: zodResolver(stationSchema),
    defaultValues: {
      name: "",
      isp: "",
      department: "",
      availability: 100,
      downtime: 0,
    },
  });

  const onSubmit = async (data: StationFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    addToast({
      title: "Estación Añadida",
      description: `Estación ${data.name} añadida exitosamente`,
      type: "success",
    });

    onSuccess(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Añadir Nueva Estación</DialogTitle>
        <DialogDescription>
          Ingresa los detalles de la nueva estación de telecomunicaciones. Haz clic en guardar cuando termines.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">
            Nombre de Estación
          </label>
          <input
            {...register("name")}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            placeholder="ej. BOG_NORTE_01"
          />
          {errors.name && (
            <p className="text-xs text-rose-400">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">ISP</label>
            <select
              {...register("isp")}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="">Seleccionar ISP</option>
              <option value="Claro">Claro</option>
              <option value="Tigo">Tigo</option>
              <option value="WOM">WOM</option>
              <option value="Movistar">Movistar</option>
            </select>
            {errors.isp && (
              <p className="text-xs text-rose-400">{errors.isp.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">
              Departamento
            </label>
            <select
              {...register("department")}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="">Seleccionar Depto</option>
              <option value="Bogota">Bogota</option>
              <option value="Antioquia">Antioquia</option>
              <option value="Valle">Valle</option>
              <option value="Atlantico">Atlantico</option>
            </select>
            {errors.department && (
              <p className="text-xs text-rose-400">
                {errors.department.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">
              Disponibilidad (%)
            </label>
            <input
              type="number"
              step="0.1"
              {...register("availability", { valueAsNumber: true })}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            {errors.availability && (
              <p className="text-xs text-rose-400">
                {errors.availability.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">
              Indisponibilidad (hrs)
            </label>
            <input
              type="number"
              step="0.1"
              {...register("downtime", { valueAsNumber: true })}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            {errors.downtime && (
              <p className="text-xs text-rose-400">{errors.downtime.message}</p>
            )}
          </div>
        </div>

        <DialogFooter className="pt-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? "Guardando..." : "Guardar Estación"}
          </button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
