import {
  CloudUpload,
  Download,
  FileImage,
  FileText,
  FileType2,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { useAuth } from "../../context/AuthContext";
import { useAddMedicalRecord, useMedicalRecords } from "../../hooks/useQueries";
import type { MedicalRecord } from "../../types";

function fileIcon(fileType: string) {
  if (fileType.startsWith("image/")) return FileImage;
  if (fileType === "application/pdf") return FileType2;
  return FileText;
}

function formatDate(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function generateId() {
  return `rec_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

export default function PatientRecordsPage() {
  const { patientSession } = useAuth();
  const patientId = patientSession?.patientId ?? "";
  const { data: records = [], isLoading } = useMedicalRecords(patientId);
  const addRecord = useAddMedicalRecord();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);

  const visibleRecords = records.filter((r) => !deletedIds.has(r.id));

  function handleFileUpload(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 10MB.");
      return;
    }
    setUploading(true);
    const record: MedicalRecord = {
      id: generateId(),
      patientId,
      appointmentId: "",
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      uploadedAt: BigInt(Date.now()),
    };
    addRecord.mutate(record, {
      onSuccess: () => {
        toast.success(`"${file.name}" uploaded successfully`);
        setUploading(false);
      },
      onError: () => {
        toast.error("Upload failed. Please try again.");
        setUploading(false);
      },
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDelete(record: MedicalRecord) {
    setDeletedIds((prev) => new Set([...prev, record.id]));
    toast.success(`"${record.fileName}" removed`);
  }

  return (
    <div className="space-y-6" data-ocid="patient.records.page">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Medical Records
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Upload and manage your health documents securely
        </p>
      </div>

      {/* Upload zone */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-subtle">
        <h2 className="text-base font-semibold text-foreground mb-4">
          Upload Record
        </h2>

        {/* Drag-and-drop area */}
        <button
          type="button"
          className={`w-full border-2 border-dashed rounded-xl px-6 py-10 text-center transition-smooth cursor-pointer text-left ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          data-ocid="patient.records.dropzone"
          aria-label="Upload medical record"
        >
          <CloudUpload
            className={`w-10 h-10 mx-auto mb-3 transition-colors ${dragOver ? "text-primary" : "text-muted-foreground"}`}
          />
          <p className="font-medium text-foreground mb-1">
            {dragOver ? "Drop your file here" : "Drag & drop your file here"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse your device
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            data-ocid="patient.records.upload_button"
          >
            {uploading ? "Uploading…" : "Choose File"}
          </Button>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={handleInputChange}
        />

        <p className="text-xs text-muted-foreground mt-3 text-center">
          Max 10MB per file. Supported: PDF, Images (JPG, PNG), Word docs (.doc,
          .docx)
        </p>
      </div>

      {/* Records list */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-subtle">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            Your Records
            {visibleRecords.length > 0 && (
              <span className="ml-2 text-sm text-muted-foreground font-normal">
                ({visibleRecords.length})
              </span>
            )}
          </h2>
        </div>

        {isLoading ? (
          <div
            className="p-6 space-y-3"
            data-ocid="patient.records.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : visibleRecords.length === 0 ? (
          <div
            className="px-6 py-12 text-center"
            data-ocid="patient.records.empty_state"
          >
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium text-foreground mb-1">
              No medical records uploaded yet
            </p>
            <p className="text-sm text-muted-foreground">
              Upload prescriptions, lab reports, or other health documents
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {visibleRecords.map((record, i) => {
              const Icon = fileIcon(record.fileType);
              return (
                <li
                  key={record.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-smooth"
                  data-ocid={`patient.records.item.${i + 1}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {record.fileName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded {formatDate(record.uploadedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-primary"
                      onClick={() => toast.info("Download started")}
                      aria-label="Download file"
                      data-ocid={`patient.records.download_button.${i + 1}`}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(record)}
                      aria-label="Delete file"
                      data-ocid={`patient.records.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
