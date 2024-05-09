import UploadForm from "@/components/forms/UploadForm";
import { Form } from "@/components/ui/form";

export default function UploadPage() {
  return (
    <div className="xl:px-36 px-12 flex flex-col text-foreground bg-background">
      <div>
        <UploadForm />
      </div>
    </div>
  );
}
