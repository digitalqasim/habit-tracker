"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useHabitStore } from "@/lib/store/habit-store";
import { toast } from "sonner";
import { Download, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function ExportImportData() {
  const exportUserData = useHabitStore((state) => state.exportUserData);
  const importUserData = useHabitStore((state) => state.importUserData);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [jsonData, setJsonData] = useState("");

  const handleExport = () => {
    try {
      const data = exportUserData();
      
      // Create a blob and download link
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `habit-tracker-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Data exported successfully");
      console.log("Exported user data", { dataSize: data.length });
    } catch (error) {
      console.error("Export failed", error);
      toast.error("Failed to export data");
    }
  };

  const handleImport = () => {
    try {
      if (!jsonData.trim()) {
        toast.error("Please paste your exported data");
        return;
      }
      
      const success = importUserData(jsonData);
      
      if (success) {
        toast.success("Data imported successfully");
        setImportDialogOpen(false);
        setJsonData("");
      } else {
        toast.error("Failed to import data. Please check the format.");
      }
    } catch (error) {
      console.error("Import failed", error);
      toast.error("Failed to import data");
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={handleExport}
      >
        <Download className="h-4 w-4" />
        Export
      </Button>
      
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Habit Data</DialogTitle>
            <DialogDescription>
              Paste your previously exported JSON data below.
              This will replace your current habit data.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder='{"habits":[...],"userPreferences":{...}}'
            className="h-40 font-mono text-xs"
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleImport}>Import Data</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}